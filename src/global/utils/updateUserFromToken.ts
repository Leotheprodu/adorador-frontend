import { $user } from '@stores/users';
import { getTokens } from './jwtUtils';
import { setLocalStorage } from './handleLocalStorage';

/**
 * Decodifica el JWT access token y actualiza el store del usuario con los datos actualizados
 */
export const updateUserFromToken = () => {
  const tokens = getTokens();

  if (!tokens || !tokens.accessToken) {
    console.log('[UpdateUser] No hay token disponible');
    return false;
  }

  try {
    // Decodificar el payload del JWT (segunda parte del token)
    const base64Url = tokens.accessToken.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    );

    const payload = JSON.parse(jsonPayload);

    console.log('[UpdateUser] Token decodificado:', payload);

    // Actualizar el store del usuario con los datos del token
    const updatedUser = {
      id: payload.sub || 0,
      name: payload.name || '',
      email: payload.email || '',
      isLoggedIn: true,
      status: payload.status || 'inactive',
      roles: payload.roles || [],
      memberships: payload.memberships || [],
      membersofBands: payload.membersofBands || [],
      phone: payload.phone || '',
      birthdate: payload.birthdate || '',
    };

    console.log('[UpdateUser] Usuario actualizado:', updatedUser);

    // Actualizar tanto el store como el localStorage
    $user.set(updatedUser);
    setLocalStorage('user', updatedUser);

    return true;
  } catch (error) {
    console.error('[UpdateUser] Error al decodificar token:', error);
    return false;
  }
};
