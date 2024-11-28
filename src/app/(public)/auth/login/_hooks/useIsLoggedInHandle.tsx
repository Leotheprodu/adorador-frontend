import { useEffect } from 'react';
import { logoutService } from '@auth/login/_services/loginService';
import { LoggedUser } from '@auth/login/_interfaces/LoginInterface';
import { $user } from '@stores/users';
import { setLocalStorage } from '@global/utils/handleLocalStorage';
import toast from 'react-hot-toast';
export const useIsLoggedInHandle = ({ user }: { user: LoggedUser }) => {
  const { error, status, mutate, isPending } = logoutService();
  const errorCode = (error: string) => {
    return parseInt(error.split('-')[0]);
  };
  useEffect(() => {
    if (status === 'success') {
      $user.set({ ...user, isLoggedIn: false });
      setLocalStorage('user', { ...user, isLoggedIn: false });
      toast.success(`Hasta pronto, que Dios te acompañe ${user.name}`);
    } else if (status === 'error') {
      if (errorCode(error.message) === 403) {
        toast.error(`${user.name}, ya has cerrado sesión`);
        $user.set({ ...user, isLoggedIn: false });
        setLocalStorage('user', { ...user, isLoggedIn: false });
        return;
      }

      toast.error('Error al cerrar sesión');
    }
  }, [user, status, error]);

  const handleLogout = () => {
    mutate(null);
  };

  return {
    handleLogout,
    isPending,
  };
};
