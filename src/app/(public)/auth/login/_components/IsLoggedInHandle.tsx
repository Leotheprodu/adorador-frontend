import { Button } from '@nextui-org/react';
import { useIsLoggedInHandle } from '@auth/login/_hooks/useIsLoggedInHandle';
import { LoggedUser } from '@auth/login/_interfaces/LoginInterface';
import Link from 'next/link';

export const IsLoggedInHandle = ({ user }: { user: LoggedUser }) => {
  const { handleLogout, isPending } = useIsLoggedInHandle({ user });
  return (
    <div className="flex min-h-[20rem] flex-col items-center gap-4">
      <h1 className="text-2xl">Hola {user.name}</h1>
      {user.status !== 'active' && (
        <p className="p-5 text-slate-400">
          Tu cuenta no está activa, por lo tanto no vas a poder usar la
          aplicación, para activar tu cuenta si eres nuevo, simplemente debes
          revisar tu bandeja de correo electrónico de{' '}
          <span className="text-secundario">{user.email}</span> y buscar el
          correo para confirmarlo. Si ya lo hiciste contacta con nosotros para
          ayudarte específicamente con tu problema
        </p>
      )}

      <div className="flex items-center justify-center gap-4">
        <p>Haz Iniciado sesión</p>
        <Button as={Link} href="/" className="uppercase" color="success">
          Ir a Inicio
        </Button>
      </div>
      <div className="flex items-center justify-center gap-4">
        <p>¿Quieres cerrar sesión?</p>
        <Button
          isLoading={isPending}
          onClick={handleLogout}
          className="uppercase"
          color="danger"
        >
          Cerrar sesión
        </Button>
      </div>
    </div>
  );
};
