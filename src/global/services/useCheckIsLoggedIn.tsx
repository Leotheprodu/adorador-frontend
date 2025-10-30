'use client';
import { $user } from '@/global/stores/users';
import { getLocalStorage, setLocalStorage } from '../utils/handleLocalStorage';
import { useEffect } from 'react';

// Versión ultra simplificada para evitar bucles infinitos
export const useCheckIsLoggedIn = () => {
  // Solo inicializar localStorage una vez al montar el componente
  useEffect(() => {
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
  }, []); // Sin dependencias para ejecutar solo una vez
};
