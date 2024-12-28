'use client';
import { $user } from '@/global/stores/users';
import { getLocalStorage } from '../utils/handleLocalStorage';
import { useStore } from '@nanostores/react';
import { useEffect } from 'react';
import { FetchData } from './HandleAPI';
import { Server1API } from '@global/config/constants';
export const checkUser = () => {
  return FetchData<{
    isLoggedIn: boolean;
    id: number;
  }>({
    key: 'checkLoggedInUser',
    url: `${Server1API}/auth/check-login-status`,
  });
};

export const useCheckIsLoggedIn = () => {
  const user = useStore($user);
  const localUser = getLocalStorage('user');

  const { data, status } = checkUser();

  useEffect(() => {
    if (localUser && user?.id === 0 && localUser?.id !== 0) {
      if (
        status === 'success' &&
        data?.isLoggedIn &&
        data?.id === localUser.id
      ) {
        $user.set({ ...localUser, isLoggedIn: data.isLoggedIn });
      }
    }
  }, [user, localUser, status, data]);
};
