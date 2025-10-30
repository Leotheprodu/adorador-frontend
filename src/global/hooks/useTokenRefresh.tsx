'use client';
import { useEffect, useCallback } from 'react';
import {
  getTokens,
  isTokenExpired,
  refreshAccessToken,
  clearTokens,
} from '@global/utils/jwtUtils';
import { $user } from '@global/stores/users';
import { setLocalStorage } from '@global/utils/handleLocalStorage';

export const useTokenRefresh = () => {
  const checkAndRefreshToken = useCallback(async () => {
    try {
      const tokens = getTokens();

      if (!tokens) {
        return false;
      }

      if (isTokenExpired(tokens)) {
        const newTokens = await refreshAccessToken();
        if (!newTokens) {
          // Si no se pudo renovar el token, limpiar todo
          clearTokens();
          const resetUser = {
            id: 0,
            name: '',
            isLoggedIn: false,
            email: '',
            status: 'inactive' as const,
            roles: [],
            memberships: [],
            membersofBands: [],
            phone: '',
            birthdate: '',
          };
          $user.set(resetUser);
          setLocalStorage('user', resetUser);
          return false;
        }
        return true;
      }

      return true;
    } catch (error) {
      console.error('Error in token refresh:', error);
      return false;
    }
  }, []);

  useEffect(() => {
    // Solo verificar token una vez al cargar
    let mounted = true;

    const initCheck = async () => {
      if (mounted) {
        await checkAndRefreshToken();
      }
    };

    initCheck();

    // Configurar intervalo para verificar token cada 5 minutos
    const interval = setInterval(
      () => {
        if (mounted) {
          checkAndRefreshToken();
        }
      },
      5 * 60 * 1000,
    ); // 5 minutos

    return () => {
      mounted = false;
      clearInterval(interval);
    };
  }, [checkAndRefreshToken]);

  return { checkAndRefreshToken };
};
