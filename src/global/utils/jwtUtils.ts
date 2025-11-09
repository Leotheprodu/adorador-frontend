import { LoggedUser } from '@auth/login/_interfaces/LoginInterface';

// Variables globales para manejo inteligente de renovación
let isRefreshing = false;
let refreshPromise: Promise<TokenStorage | null> | null = null;
let renewalTimeoutId: NodeJS.Timeout | null = null;

export interface TokenStorage {
  accessToken: string;
  refreshToken: string;
  expiresAt: number; // timestamp
}

export interface JWTAuthResponse {
  accessToken: string;
  refreshToken: string;
  user: LoggedUser;
}

// Interfaz para la respuesta real del backend (usuario mezclado con tokens)
export interface BackendLoginResponse extends LoggedUser {
  accessToken: string;
  refreshToken: string;
}

// Función optimizada para almacenar tokens con renovación programada
export const setTokens = (tokens: TokenStorage) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_tokens', JSON.stringify(tokens));
    // Programar renovación automática
    scheduleTokenRenewal(tokens);
  }
};

// Función para obtener tokens
export const getTokens = (): TokenStorage | null => {
  if (typeof window !== 'undefined') {
    const tokens = localStorage.getItem('auth_tokens');
    return tokens ? JSON.parse(tokens) : null;
  }
  return null;
};

// (función clearTokens movida al final del archivo)

// Función para verificar si el token ha expirado
export const isTokenExpired = (token: TokenStorage): boolean => {
  if (!token) return true;
  const now = Date.now();
  // Buffer de 3 minutos - más conservador para dar tiempo a renovación proactiva
  const bufferTime = 3 * 60 * 1000; // 3 minutos en millisegundos
  const result = now >= token.expiresAt - bufferTime;

  if (result) {
    const timeToExpiry = token.expiresAt - now;
    console.log('[JWT] Token considerado expirado:', {
      timeToActualExpiry: Math.round(timeToExpiry / 1000) + 's',
      bufferUsed: bufferTime / 1000 + 's',
    });
  }

  return result;
};

// Función para verificar si el token está realmente expirado (sin buffer)
export const isTokenActuallyExpired = (token: TokenStorage): boolean => {
  if (!token) return true;
  const now = Date.now();
  return now >= token.expiresAt;
};

// Función para extraer el tiempo de expiración del JWT
export const getTokenExpirationTime = (token: string): number => {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000; // Convertir de segundos a millisegundos
  } catch (error) {
    console.error('Error parsing JWT token:', error);
    return Date.now(); // Si hay error, consideramos que ha expirado
  }
};

// Función optimizada para obtener token válido con renovación proactiva
export const getValidAccessToken = async (): Promise<string | null> => {
  const tokens = getTokens();
  if (!tokens) return null;

  // Si el token no está expirado, verificar si necesita renovación proactiva
  if (!isTokenExpired(tokens)) {
    // Renovar proactivamente si está cerca de expirar (5 minutos antes)
    const now = Date.now();
    const timeUntilExpiry = tokens.expiresAt - now;
    const proactiveRenewalThreshold = 5 * 60 * 1000; // 5 minutos

    if (timeUntilExpiry <= proactiveRenewalThreshold && timeUntilExpiry > 0) {
      console.log('[JWT] Renovación proactiva iniciada');
      // Renovar en segundo plano sin bloquear
      refreshAccessTokenInBackground();
    }

    return tokens.accessToken;
  }

  // Si está expirado, renovar de forma bloqueante pero optimizada
  return await getOrWaitForRefresh();
};

// Sistema de renovación con promesa compartida para evitar múltiples requests
const getOrWaitForRefresh = async (): Promise<string | null> => {
  // Si ya hay una renovación en progreso, esperar a que termine
  if (isRefreshing && refreshPromise) {
    console.log('[JWT] Esperando renovación existente...');
    const result = await refreshPromise;
    return result ? result.accessToken : null;
  }

  // Iniciar nueva renovación
  if (!isRefreshing) {
    isRefreshing = true;
    refreshPromise = refreshAccessToken();

    try {
      const newTokens = await refreshPromise;
      return newTokens ? newTokens.accessToken : null;
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  }

  return null;
};

// Renovación en segundo plano (no bloqueante)
const refreshAccessTokenInBackground = () => {
  if (isRefreshing) return; // Ya hay una renovación en progreso

  // Usar setTimeout para no bloquear
  setTimeout(async () => {
    try {
      await refreshAccessToken();
      console.log('[JWT] Renovación proactiva completada');
    } catch (error) {
      console.warn('[JWT] Error en renovación proactiva:', error);
    }
  }, 100);
};

// Programar renovación automática
export const scheduleTokenRenewal = (tokens: TokenStorage) => {
  // Limpiar timeout anterior si existe
  if (renewalTimeoutId) {
    clearTimeout(renewalTimeoutId);
  }

  const now = Date.now();
  const timeUntilExpiry = tokens.expiresAt - now;
  const renewalTime = Math.max(timeUntilExpiry - 5 * 60 * 1000, 30000); // 5 min antes o mín 30s

  if (renewalTime > 0) {
    renewalTimeoutId = setTimeout(() => {
      console.log('[JWT] Renovación programada ejecutándose...');
      refreshAccessTokenInBackground();
    }, renewalTime);

    console.log(
      `[JWT] Renovación programada en ${Math.round(renewalTime / 1000)}s`,
    );
  }
};

// Función optimizada para renovar tokens con retry y timeout
export const refreshAccessToken = async (): Promise<TokenStorage | null> => {
  console.log('[JWT] Intentando renovar token...');
  const tokens = getTokens();
  if (!tokens || !tokens.refreshToken) {
    console.log('[JWT] No hay refresh token disponible');
    clearTokens();
    return null;
  }

  try {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL_1;
    if (!apiUrl) {
      console.error('[JWT] API URL not configured');
      clearTokens();
      return null;
    }

    console.log('[JWT] Llamando a /auth/refresh...');

    // Configuración optimizada para renovación con mejor tolerancia a cold starts
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 20000); // Timeout de 20s para cold starts

    const response = await fetch(`${apiUrl}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache',
        Pragma: 'no-cache',
      },
      body: JSON.stringify({
        refreshToken: tokens.refreshToken,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (response.ok) {
      console.log('[JWT] Token renovado exitosamente');
      const data: JWTAuthResponse = await response.json();
      const newTokens: TokenStorage = {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        expiresAt: getTokenExpirationTime(data.accessToken),
      };

      // Almacenar y programar próxima renovación
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_tokens', JSON.stringify(newTokens));
        scheduleTokenRenewal(newTokens);
      }

      console.log(
        '[JWT] Nuevo token expira en:',
        new Date(newTokens.expiresAt).toLocaleString(),
      );
      return newTokens;
    } else {
      const errorText = await response.text().catch(() => 'Sin detalle');
      console.log(
        '[JWT] Backend rechazó el refresh token. Status:',
        response.status,
        'Error:',
        errorText,
      );

      // Solo limpiar tokens si es error 401/403 (no autorizado)
      if (response.status === 401 || response.status === 403) {
        clearTokens();
      }
      return null;
    }
  } catch (error: unknown) {
    const err = error as Error;
    if (err.name === 'AbortError') {
      console.error('[JWT] Timeout renovando token');
    } else {
      console.error('[JWT] Error al renovar token:', error);
    }

    // No limpiar tokens en errores de red - puede ser temporal
    if (err.name !== 'AbortError' && !err.message?.includes('fetch')) {
      clearTokens();
    }
    return null;
  }
};

// Función de limpieza mejorada
export const clearTokens = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_tokens');
  }

  // Limpiar renovación programada
  if (renewalTimeoutId) {
    clearTimeout(renewalTimeoutId);
    renewalTimeoutId = null;
  }

  // Reset variables globales
  isRefreshing = false;
  refreshPromise = null;
};
