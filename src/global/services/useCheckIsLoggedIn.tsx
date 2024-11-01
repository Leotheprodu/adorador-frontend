'use client';
import { $user } from '@/global/stores/users';
import { getLocalStorage } from '../utils/handleLocalStorage';
import { useStore } from '@nanostores/react';
import { useEffect } from 'react';

export const useCheckIsLoggedIn = () => {
  const user = useStore($user);
  const localUser = getLocalStorage('user');

  useEffect(() => {
    if (user?.id === 0 && localUser?.id !== 0) {
      $user.set(localUser);
    }
  }, [user, localUser]);
};
