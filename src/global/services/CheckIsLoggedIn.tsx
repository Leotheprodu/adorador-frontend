'use client';
import { $user } from '@/global/stores/users';
import { getLocalStorage } from '../utils/handleLocalStorage';

export const checkIsLoggedIn = () => {
  const checkLocalData = getLocalStorage('user');

  if (checkLocalData) {
    $user.set(checkLocalData);
  }
};
