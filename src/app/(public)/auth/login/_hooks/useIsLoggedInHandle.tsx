import { useEffect } from 'react';
import { logoutService } from '@auth/login/_services/loginService';
import { LoggedUser } from '@auth/login/_interfaces/LoginInterface';
import { $user } from '@stores/users';
import { setLocalStorage } from '@global/utils/handleLocalStorage';
import { clearTokens } from '@global/utils/jwtUtils';
import toast from 'react-hot-toast';

export const useIsLoggedInHandle = ({ user }: { user: LoggedUser }) => {
  const { error, status, mutate, isPending } = logoutService();
  const errorCode = (error: string) => {
    return parseInt(error.split('-')[0]);
  };

  useEffect(() => {
    if (status === 'success') {
      // Limpiar tokens JWT
      clearTokens();

      // Resetear estado del usuario
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
      toast.success(`Hasta pronto, que Dios te acompañe ${user.name}`);
    } else if (status === 'error') {
      if (errorCode(error.message) === 403) {
        toast.error(`${user.name}, ya has cerrado sesión`);

        // Limpiar tokens y estado aunque haya error
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
