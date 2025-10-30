import { LoggedUser } from '@auth/login/_interfaces/LoginInterface';

// Variable global para prevenir múltiples refreshes simultáneos
let isRefreshing = false;

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

// Función para almacenar tokens
export const setTokens = (tokens: TokenStorage) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth_tokens', JSON.stringify(tokens));
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

// Función para limpiar tokens
export const clearTokens = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth_tokens');
  }
};

// Función para verificar si el token ha expirado
export const isTokenExpired = (token: TokenStorage): boolean => {
  if (!token) return true;
  const now = Date.now();
  // Agregamos un buffer de 5 minutos antes de la expiración real
  const bufferTime = 5 * 60 * 1000; // 5 minutos en millisegundos
  return now >= token.expiresAt - bufferTime;
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

// Función para obtener el access token válido
export const getValidAccessToken = async (): Promise<string | null> => {
  const tokens = getTokens();
  if (!tokens) return null;

  // Si el token no está expirado, devolverlo directamente
  if (!isTokenExpired(tokens)) {
    return tokens.accessToken;
  }

  // Si está expirado, intentar renovar pero solo si no estamos ya en proceso
  if (!isRefreshing) {
    isRefreshing = true;
    try {
      const newTokens = await refreshAccessToken();
      if (newTokens) {
        return newTokens.accessToken;
      }
    } finally {
      isRefreshing = false;
    }
  }

  return null;
};

// Función para renovar el access token usando el refresh token
export const refreshAccessToken = async (): Promise<TokenStorage | null> => {
  const tokens = getTokens();
  if (!tokens || !tokens.refreshToken) {
    clearTokens();
    return null;
  }

  try {
    // Usar la variable de entorno correcta
    const apiUrl = process.env.NEXT_PUBLIC_API_URL_1;
    if (!apiUrl) {
      console.error('API URL not configured');
      clearTokens();
      return null;
    }

    // Usar fetch directo para evitar bucles con fetchAPI
    const response = await fetch(`${apiUrl}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refreshToken: tokens.refreshToken,
      }),
    });

    if (response.ok) {
      const data: JWTAuthResponse = await response.json();
      const newTokens: TokenStorage = {
        accessToken: data.accessToken,
        refreshToken: data.refreshToken,
        expiresAt: getTokenExpirationTime(data.accessToken),
      };

      setTokens(newTokens);
      return newTokens;
    } else {
      // Si el refresh token también ha expirado o es inválido
      clearTokens();
      return null;
    }
  } catch (error) {
    console.error('Error refreshing token:', error);
    clearTokens();
    return null;
  }
};
