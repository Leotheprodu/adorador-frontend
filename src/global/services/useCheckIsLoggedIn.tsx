'use client';
import { $user } from '@/global/stores/users';
import { getLocalStorage, setLocalStorage } from '../utils/handleLocalStorage';
import { useStore } from '@nanostores/react';
import { useEffect } from 'react';
import { FetchData } from './HandleAPI';
import { Server1API } from '@global/config/constants';
import toast from 'react-hot-toast';
import { Button } from '@nextui-org/react';
import Link from 'next/link';
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
  const { data, status, isLoading } = checkUser();

  useEffect(() => {
    if (
      !isLoading &&
      !user.isLoggedIn &&
      !localUser.isLoggedIn &&
      user.id === 0
    ) {
      toast.custom(
        (t) => (
          <div
            className={`${
              t.visible ? 'animate-enter' : 'animate-leave'
            } group pointer-events-auto relative mt-[3rem] flex flex-col rounded-lg bg-primario p-2 shadow-lg ring-1 ring-black ring-opacity-5`}
          >
            <button
              onClick={() => toast.remove('not-logged-in-toast')}
              className="invisible absolute right-2 top-2 m-0 flex h-4 w-4 items-center justify-center rounded-full bg-white p-1 text-center duration-200 group-hover:visible"
            >
              <p className="text-danger-500">X</p>
            </button>
            <div className="flex flex-col justify-center">
              <p>No has iniciado sesión</p>
              <div className="mt-2 flex justify-center">
                <Button color="success" as={Link} href="/auth/login">
                  Iniciar sesión
                </Button>
              </div>
            </div>
          </div>
        ),
        { id: 'not-logged-in-toast', duration: 5000, position: 'top-right' },
      );
    }
  }, [user, isLoading, localUser]);

  useEffect(() => {
    if (!localUser) {
      setLocalStorage('user', { id: 0, isLoggedIn: false });
    }
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
