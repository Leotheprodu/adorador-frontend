'use client';
import { $user } from '@/global/stores/users';
import { getLocalStorage, setLocalStorage } from '../utils/handleLocalStorage';
import { useIsClient } from '../hooks/useIsClient';
import { useEffect, useRef } from 'react';

// Versión ultra simplificada para evitar bucles infinitos
export const useCheckIsLoggedIn = () => {
  const isClient = useIsClient();
  const isInitializedRef = useRef(false);

  // Solo inicializar localStorage una vez al montar el componente Y después de la hidratación
  useEffect(() => {
    // Solo ejecutar en el cliente después de la hidratación
    if (!isClient) return;

    const initializeUser = () => {
      // Prevenir múltiples ejecuciones (importante en StrictMode y producción)
      if (isInitializedRef.current) return;
      isInitializedRef.current = true;

      const localUser = getLocalStorage('user');

      // Si localUser es null o undefined, crear usuario por defecto
      if (!localUser) {
        const defaultUser = {
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
        setLocalStorage('user', defaultUser);
        $user.set(defaultUser);
      } else {
        // Si existe el usuario local, sincronizar con el store si está vacío
        const currentUser = $user.get();
        if (currentUser.id === 0 && localUser.id !== 0) {
          $user.set(localUser);
        }
      }
    };

    // Usar timeout para evitar hydration issues
    const timeoutId = setTimeout(initializeUser, 100); // Aumentar delay para producción

    return () => {
      clearTimeout(timeoutId);
    };
  }, [isClient]); // Depender de isClient para ejecutar después de hidratación
};
