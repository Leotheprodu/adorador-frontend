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
  const lastCheckTime = useRef<number>(0);

  const checkAndRefreshToken = useCallback(async () => {
    // Evitar verificaciones demasiado frecuentes (debounce de 10 segundos)
    const now = Date.now();
    if (now - lastCheckTime.current < 10000) {
      console.log('[TokenRefresh] Verificación reciente, saltando...');
      return true;
    }
    lastCheckTime.current = now;

    console.log('[TokenRefresh] Verificando tokens...');
    try {
      const tokens = getTokens();

      if (!tokens) {
        console.log('[TokenRefresh] No hay tokens guardados');
        return false;
      }

      console.log(
        '[TokenRefresh] Token expira en:',
        new Date(tokens.expiresAt).toLocaleString(),
      );

      if (isTokenExpired(tokens)) {
        console.log(
          '[TokenRefresh] Token expirado o próximo a expirar, renovando...',
        );
        const newTokens = await refreshAccessToken();
        if (!newTokens) {
          console.log(
            '[TokenRefresh] Error al renovar token, limpiando sesión...',
          );
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
        console.log('[TokenRefresh] Token renovado exitosamente');
        return true;
      }

      console.log('[TokenRefresh] Token válido, no necesita renovación');
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

    // Configurar intervalo para verificar token cada 2 minutos (más frecuente)
    const interval = setInterval(
      () => {
        if (mounted && typeof window !== 'undefined') {
          checkAndRefreshToken();
        }
      },
      2 * 60 * 1000,
    ); // 2 minutos

    // Verificar token cuando la página vuelve a tener foco (cuando regresas a la app)
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && mounted) {
        checkAndRefreshToken();
      }
    };

    // Verificar token cuando la ventana vuelve a tener foco
    const handleFocus = () => {
      if (mounted) {
        checkAndRefreshToken();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('focus', handleFocus);

    return () => {
      mounted = false;
      clearTimeout(timeoutId);
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('focus', handleFocus);
    };
  }, [checkAndRefreshToken]);

  return { checkAndRefreshToken };
};
