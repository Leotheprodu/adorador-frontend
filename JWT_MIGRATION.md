# Migración de Autenticación de Cookies a JWT

## Cambios Realizados

### 1. Nuevas Utilidades JWT (`src/global/utils/jwtUtils.ts`)

- **TokenStorage**: Interface para almacenar tokens con expiración
- **JWTAuthResponse**: Interface para la respuesta de autenticación del backend
- **setTokens()**: Almacena tokens en localStorage
- **getTokens()**: Obtiene tokens del localStorage
- **clearTokens()**: Limpia tokens del localStorage
- **isTokenExpired()**: Verifica si un token ha expirado (con buffer de 5 minutos)
- **getTokenExpirationTime()**: Extrae tiempo de expiración del JWT
- **getValidAccessToken()**: Obtiene un token válido, renovándolo si es necesario
- **refreshAccessToken()**: Renueva el access token usando el refresh token

### 2. Actualización del Sistema de Fetch (`src/global/utils/fetchAPI.ts`)

- Eliminada la configuración `credentials: 'include'` (cookies)
- Agregado soporte para autorización por header `Authorization: Bearer <token>`
- Lista de endpoints públicos que no requieren autenticación
- Manejo automático del error 401 (token expirado)
- Parámetro `skipAuth` para endpoints que no requieren autenticación

### 3. Actualización de HandleAPI (`src/global/services/HandleAPI.ts`)

- Agregado parámetro `skipAuth` a `FetchData` y `PostData`
- Los servicios pueden especificar si necesitan saltar la autenticación

### 4. Hook de Refresh Automático (`src/global/hooks/useTokenRefresh.tsx`)

- Verifica y renueva tokens automáticamente cada 5 minutos
- Limpia el estado de usuario si los tokens no se pueden renovar
- Se ejecuta al cargar la aplicación

### 5. Actualización del Provider Principal (`src/global/utils/Providers.tsx`)

- Agregado `AuthProvider` que incluye el hook `useTokenRefresh`

### 6. Actualización del Sistema de Login

#### Login Service (`src/app/(public)/auth/login/_services/loginService.ts`)

- Cambiado para retornar `JWTAuthResponse` en lugar de `LoggedUser`
- Agregado `skipAuth: true` para el endpoint de login

#### Login Hook (`src/app/(public)/auth/login/_hooks/useLoginForm.tsx`)

- Actualizado para manejar la respuesta JWT
- Almacena tokens usando `setTokens()`
- Actualiza el store de usuario con `data.user`

### 7. Actualización del Sistema de Logout

#### Logout Hook (`src/app/(public)/auth/login/_hooks/useIsLoggedInHandle.tsx`)

- Agregado `clearTokens()` al hacer logout
- Resetea el estado del usuario completamente

### 8. Actualización del Sistema de Verificación de Login (`src/global/services/useCheckIsLoggedIn.tsx`)

- Verificación de tokens JWT en lugar de cookies
- Limpieza automática del estado si no hay tokens válidos
- Sincronización entre tokens y estado del usuario

### 9. Servicios Públicos Actualizados

Todos los siguientes servicios ahora usan `skipAuth: true`:

- `loginService`
- `signUpService`
- `verifyEmailService`
- `PasswordRecoveryService`
- `resetPasswordService`

## Funcionamiento del Sistema JWT

### Flujo de Autenticación

1. **Login**: Usuario ingresa credenciales → Backend retorna `accessToken` y `refreshToken`
2. **Almacenamiento**: Tokens se guardan en localStorage con tiempo de expiración
3. **Requests**: Todos los requests automáticamente incluyen `Authorization: Bearer <accessToken>`
4. **Renovación**: Si el token está por expirar (5 min buffer), se renueva automáticamente
5. **Logout**: Se limpian todos los tokens y el estado del usuario

### Seguridad

- Tokens se almacenan en localStorage (no en cookies)
- Renovación automática antes de la expiración
- Limpieza automática en caso de tokens inválidos
- Manejo de errores 401 con redirección automática

### Endpoints Públicos

Los siguientes endpoints no requieren autenticación:

- `/auth/login`
- `/auth/sign-up`
- `/auth/refresh`
- `/auth/forgot-password`
- `/auth/new-password`
- `/auth/verify-email`
- `/users` (para registro)

## Migración Automática

- Todos los servicios existentes automáticamente incluirán JWT
- No se requieren cambios en componentes individuales
- El sistema mantiene la misma interfaz para los desarrolladores

## Configuración Requerida

- Variable de entorno `NEXT_PUBLIC_API_URL_1` debe estar configurada
- Backend debe soportar endpoint `/auth/refresh` que reciba `refreshToken`
- Backend debe retornar tokens en el formato especificado en `JWTAuthResponse`
