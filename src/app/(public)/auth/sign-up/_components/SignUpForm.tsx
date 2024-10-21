'use client';
import { Button, Link } from '@nextui-org/react';
import { useSignUpForm } from '@auth/sign-up/_hooks/useSignUpForm';
import { InputUsernameSignUpForm } from '@auth/sign-up/_components/InputUsernameSignUpForm';
import { InputEmailLoginForm } from '@auth/login/_components/InputEmailLoginForm';
import { InputPasswordLoginForm } from '@auth/login/_components/InputPasswordLoginForm';
import { findHrefFromLinks } from '@global/utils/findHrefFromLinks';

export const SignUpForm = () => {
  const {
    isVisible,
    handleOnChange,
    handleOnClear,
    toggleVisibility,
    handleSignUp,
    isInvalidPass,
    email,
    password,
    password2,
    isPending,
    username,
    noFormValue,
    user,
    status,
  } = useSignUpForm({ email: '', password: '', username: '', password2: '' });

  if (status === 'success') {
    return (
      <div>
        <h1 className="mb-6 text-center text-3xl font-semibold">
          Registro Exitoso
        </h1>
        <p className="mb-4 text-center text-slate-400">
          Revisa tu correo electrónico{' '}
          <span className="text-secundario">{user.email}</span> para confirmar
          tu cuenta
        </p>
      </div>
    );
  }
  return (
    <div className="max-w-sm">
      <h1 className="mb-10 text-center text-3xl font-semibold text-primary">
        ¡Crea tu cuenta!
      </h1>
      <p className="mb-4 text-center text-slate-700">
        Al crear tu cuenta puedes disfrutar de nuestras herramientas. !Es
        gratis!
      </p>
      <form onSubmit={handleSignUp} className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <InputUsernameSignUpForm
            handle={{ handleOnChange, username, noFormValue }}
          />
          <InputEmailLoginForm
            handle={{ handleOnClear, email, handleOnChange, noFormValue }}
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
          <InputPasswordLoginForm
            handle={{
              confirmPassword: true,
              handleOnChange,
              isVisible,
              toggleVisibility,
              password: password2,
              isInvalidPass,
            }}
          />
        </div>
        <Button
          isLoading={isPending}
          type="submit"
          className="mx-auto my-0 w-1/2 uppercase"
          color="primary"
        >
          Crear
        </Button>
      </form>
      <div className="mt-4">
        <p className="text-center text-sm text-gray-400">
          ¿Ya tienes una cuenta?{' '}
          <Link
            href={findHrefFromLinks('Login')}
            className="text-primary hover:underline"
          >
            Iniciar sesión
          </Link>
        </p>
      </div>
    </div>
  );
};
