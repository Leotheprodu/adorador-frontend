import { useEffect } from 'react';
import { logoutService } from '../_services/authService';
import { LoggedUser } from '../_interfaces/LoginInterface';
import { $user } from '@/global/stores/users';
import { setLocalStorage } from '@/global/utils/handleLocalStorage';
import toast from 'react-hot-toast';
import { errorCode } from '@/global/utils/errorMsgFormat';
export const useIsLoggedInHandle = ({ user }: { user: LoggedUser }) => {
  const { error, status, mutate, isPending } = logoutService();

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
    // NOTE si ocurre un error prueba quitar data del array de dependencias
  }, [user, status, error]);

  const handleLogout = () => {
    mutate(null);
  };

  return {
    handleLogout,
    isPending,
  };
};
