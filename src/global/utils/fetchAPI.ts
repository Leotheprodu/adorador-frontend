import { getValidAccessToken, clearTokens } from './jwtUtils';

export async function fetchAPI<TResponse, TBody = undefined>({
  url,
  method = 'GET',
  body = null,
  isFormData = false,
  skipAuth = false,
}: {
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  body?: TBody | FormData | null;
  isFormData?: boolean;
  skipAuth?: boolean;
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
    '/users', // Para el registro de usuarios
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

  const response = await fetch(`${url}`, config);

  // Si el token ha expirado y el backend retorna 401
  if (response.status === 401 && !skipAuth) {
    // Limpiar tokens y redirigir al login
    clearTokens();
    // Recargar la página para que el sistema de auth redirija al login
    if (typeof window !== 'undefined') {
      window.location.reload();
    }
    throw new Error('401-Token expired');
  }

  const data = await response.json();

  if (response.ok) {
    return data;
  } else {
    console.error(data);
    throw new Error(`${data.statusCode}-${data.message}`);
  }
}
