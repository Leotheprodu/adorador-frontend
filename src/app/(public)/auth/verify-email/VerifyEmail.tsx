import { $user } from '@/stores/users';
import { verifyEmailService } from '../../services/authService';
import { useStore } from '@nanostores/react';
import { setLocalStorage } from '@/modules/chore/utils/handleLocalStorage';
import { ghostToast } from '@/modules/chore/components/ghostToast';
import { useEffect } from 'react';
import { Button, Link } from '@nextui-org/react';

export const VerifyEmail = ({ token }: { token: string }) => {
  const user = useStore($user);
  const { status, mutate } = verifyEmailService({ token });
  useEffect(() => {
    if (token) {
      mutate(null);
    }
  }, [token]);

  useEffect(() => {
    if (status === 'success') {
      $user.set({ ...user, status: 'active' });
      setLocalStorage('user', { ...user, status: 'active' });
      ghostToast({ message: `Correo verificado correctamente` });
    } else if (status === 'error') {
      ghostToast({ message: 'Ha ocurrido un error', type: 'error' });
    }
  }, [status]);

  return (
    <div className="flex flex-col items-center justify-center gap-10">
      <p>
        {status === 'pending'
          ? 'Verificando...'
          : status === 'success'
          ? 'Correo verificado correctamente'
          : status === 'error'
          ? 'Token inválido'
          : 'Verificando...'}
      </p>
      <div>
        <Button as={Link} isDisabled={status === 'pending'} href="/">
          Ir a Inicio
        </Button>
      </div>
    </div>
  );
};
