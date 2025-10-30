'use client';
import { useEffect, useCallback, useRef } from 'react';
import {
  getTokens,
  isTokenExpired,
  refreshAccessToken,
  clearTokens,
} from '@global/utils/jwtUtils';
import { $user } from '@global/stores/users';
import { setLocalStorage } from '@global/utils/handleLocalStorage';

export const useTokenRefresh = () => {
  const hasInitialized = useRef(false);

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
    // Solo verificar token una vez al cargar, con delay para evitar conflictos
    let mounted = true;

    const initCheck = async () => {
      if (mounted && typeof window !== 'undefined' && !hasInitialized.current) {
        hasInitialized.current = true;
        // Esperar un poco para que la inicialización del usuario termine
        await new Promise((resolve) => setTimeout(resolve, 1000));
        if (mounted) {
          await checkAndRefreshToken();
        }
      }
    };

    // Ejecutar después de un delay inicial
    const timeoutId = setTimeout(() => {
      initCheck();
    }, 2000); // 2 segundos de delay inicial

    // Configurar intervalo para verificar token cada 5 minutos
    const interval = setInterval(
      () => {
        if (mounted && typeof window !== 'undefined') {
          checkAndRefreshToken();
        }
      },
      5 * 60 * 1000,
    ); // 5 minutos

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
      clearInterval(interval);
    };
  }, [checkAndRefreshToken]);

  return { checkAndRefreshToken };
};
