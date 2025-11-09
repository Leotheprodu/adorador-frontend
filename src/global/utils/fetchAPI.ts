import { getValidAccessToken, clearTokens } from './jwtUtils';

// Función para detectar si es un error de cold start
const isColdStartError = (error: unknown): boolean => {
  if (error instanceof Error) {
    return (
      error.name === 'AbortError' ||
      error.message.includes('fetch') ||
      error.message.includes('network') ||
      error.message.includes('timeout')
    );
  }
  return false;
};

// Función auxiliar para delay con exponential backoff
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchAPI<TResponse, TBody = undefined>({
  url,
  method = 'GET',
  body = null,
  isFormData = false,
  skipAuth = false,
  maxRetries = 3,
  timeout = 30000, // 30 segundos para permitir cold starts
}: {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: TBody | FormData | null;
  isFormData?: boolean;
  skipAuth?: boolean;
  maxRetries?: number;
  timeout?: number;
}): Promise<TResponse> {
  // eslint-disable-next-line no-undef
  const headers: HeadersInit = isFormData
    ? {}
    : { 'Content-Type': 'application/json' };

  // Lista de endpoints públicos que no requieren autenticación
  const publicEndpoints = [
    '/auth/login',
    '/auth/sign-up',
    '/auth/refresh',
    '/auth/forgot-password',
    '/auth/new-password',
    '/auth/verify-email',
    '/auth/email-service-status', // Para diagnóstico SMTP
    '/auth/admin/test-smtp', // Para diagnóstico SMTP detallado
    '/auth/admin/test-email', // Para prueba de envío de email
    '/users', // Para el registro de usuarios
    '/users/resend-verification', // Para reenvío de verificación
  ];

  const isPublicEndpoint = publicEndpoints.some((endpoint) =>
    url.includes(endpoint),
  );

  // Agregar token de autorización si no es un endpoint público y no se está saltando la auth
  if (!skipAuth && !isPublicEndpoint) {
    const token = await getValidAccessToken();
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  const config: RequestInit = {
    method,
    body:
      method === 'GET' || body === null
        ? undefined
        : isFormData
          ? (body as FormData)
          : JSON.stringify(body),
    headers,
  };

  // Implementar retry logic con exponential backoff
  let lastError: Error | null = null;
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      // Configurar timeout para la request
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);

      const response = await fetch(`${url}`, {
        ...config,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Si el token ha expirado y el backend retorna 401
      if (response.status === 401 && !skipAuth) {
        // Limpiar tokens
        clearTokens();
        // Solo redirigir al login si realmente teníamos un token (es decir, el usuario estaba logueado)
        // Esto evita bucles infinitos cuando el usuario no está logueado desde el inicio
        if (typeof window !== 'undefined' && headers.Authorization) {
          window.location.href = '/auth/login';
        }
        throw new Error('401-Token expired');
      }

      const data = await response.json();

      if (response.ok) {
        // Si tuvo éxito después de retry, loguear
        if (attempt > 0) {
          console.log(
            `[FetchAPI] Éxito después de ${attempt} reintentos (cold start recuperado)`,
          );
        }
        return data;
      } else {
        console.error(data);
        throw new Error(`${data.statusCode}-${data.message}`);
      }
    } catch (error) {
      lastError = error as Error;

      // Si es error 401, no reintentar
      if (lastError.message.includes('401')) {
        throw lastError;
      }

      // Si es posible cold start y aún quedan intentos, reintentar
      if (isColdStartError(error) && attempt < maxRetries) {
        const backoffTime = Math.min(1000 * Math.pow(2, attempt), 8000); // Max 8 segundos
        console.warn(
          `[FetchAPI] Posible cold start detectado. Reintento ${attempt + 1}/${maxRetries} en ${backoffTime}ms...`,
        );
        await delay(backoffTime);
        continue;
      }

      // Si no quedan intentos o no es error de cold start, lanzar error
      if (attempt === maxRetries) {
        console.error(
          `[FetchAPI] Falló después de ${maxRetries} reintentos:`,
          lastError,
        );
        throw lastError;
      }
    }
  }

  // Esto no debería alcanzarse nunca, pero TypeScript lo requiere
  throw lastError || new Error('Fetch failed');
}
