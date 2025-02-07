'use client';
import { Button, Link } from '@nextui-org/react';
import { IsLoggedInHandle } from '@auth/login/_components/IsLoggedInHandle';
import { InputEmailLoginForm } from '@auth/login/_components/InputEmailLoginForm';
import { InputPasswordLoginForm } from '@auth/login/_components/InputPasswordLoginForm';
import { useLoginForm } from '@auth/login/_hooks/useLoginForm';
import { findHrefFromLinks } from '@global/utils/findHrefFromLinks';
import { $user } from '@stores/users';
import { useStore } from '@nanostores/react';

export const LoginForm = () => {
  const {
    handleOnChange,
    handleOnClear,
    handleLogin,
    isInvalidPass,
    email,
    password,
    isPending,
  } = useLoginForm({ email: '', password: '' });
  const user = useStore($user);
  return (
    <>
      {user.isLoggedIn && <IsLoggedInHandle user={user} />}
      {!user.isLoggedIn && (
        <div className="min-h-screen">
          <h1 className="text-center text-3xl font-semibold text-primary">
            Iniciar sesión
          </h1>
          <p className="mb-4 text-center text-primario">
            Inicia sesión para acceder a las herramientas
          </p>
          <form onSubmit={handleLogin} className="flex flex-col gap-6">
            <div className="flex flex-col gap-2">
              <InputEmailLoginForm
                handle={{ handleOnClear, email, handleOnChange }}
              />
              <InputPasswordLoginForm
                handle={{
                  handleOnChange,
                  isInvalidPass,
                  password,
                }}
              />
            </div>

            <Button
              isLoading={isPending}
              type="submit"
              className="mx-auto my-0 w-1/2 uppercase"
              color="primary"
            >
              Iniciar sesión
            </Button>
          </form>
          <div className="mt-4">
            <p className="text-center text-sm text-gray-400">
              <Link
                href="/auth/password-recovery"
                className="text-primary hover:underline"
              >
                ¿Olvidaste la contraseña?
              </Link>
            </p>
          </div>
          <div className="mt-4">
            <p className="text-center text-sm text-gray-400">
              <Link
                href={findHrefFromLinks('Crear cuenta')}
                className="text-primary hover:underline"
              >
                ¿No tienes cuenta?
              </Link>
            </p>
          </div>
        </div>
      )}
    </>
  );
};
