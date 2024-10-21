'use client';
import { Button, Link } from '@nextui-org/react';
import { IsLoggedInHandle } from '@auth/login/_components/IsLoggedInHandle';
import { InputEmailLoginForm } from '@auth/login/_components/InputEmailLoginForm';
import { InputPasswordLoginForm } from '@auth/login/_components/InputPasswordLoginForm';
import { useLoginForm } from '@auth/login/_hooks/useLoginForm';
import { findHrefFromLinks } from '@global/utils/findHrefFromLinks';

export const LoginForm = () => {
  const {
    isVisible,
    handleOnChange,
    handleOnClear,
    toggleVisibility,
    handleLogin,
    isInvalidPass,
    email,
    password,
    user,
    isPending,
  } = useLoginForm({ email: '', password: '' });

  if (user.isLoggedIn) {
    return <IsLoggedInHandle user={user} />;
  }

  return (
    <div>
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
              isVisible,
              toggleVisibility,
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
          ¿No tienes cuenta?{' '}
          <Link
            href={findHrefFromLinks('Crear cuenta')}
            className="text-primary hover:underline"
          >
            Créala ¡Es gratis!
          </Link>
        </p>
      </div>
    </div>
  );
};
