import { Button, Link } from '@nextui-org/react';
import { useSignUpForm } from '../../hooks/useSignUpForm';
import { InputEmailLoginForm } from '../login/InputEmailLoginForm';
import { InputPasswordLoginForm } from '../login/InputPasswordLoginForm';
import { InputUsernameSignUpForm } from './InputUsernameSignUpForm';

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
        <h1 className="text-3xl text-center font-semibold mb-6">
          Registro Exitoso
        </h1>
        <p className="text-center mb-4 text-slate-400">
          Revisa tu correo electrónico{' '}
          <span className="text-secundario">{user.email}</span> para confirmar
          tu cuenta
        </p>
      </div>
    );
  }
  return (
    <div>
      <h1 className="text-3xl text-center font-semibold">
        Registro de Usuario
      </h1>
      <p className="text-center  text-slate-400 mb-4">
        Crea una cuenta para disfrutar de nuestros servicios
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
          className="uppercase w-1/2 my-0 mx-auto"
          color="primary"
        >
          Crear
        </Button>
      </form>
      <div className="mt-4">
        <p className="text-center text-sm text-gray-400">
          ¿Ya tienes una cuenta?{' '}
          <Link href={'/login'} className="text-primary hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};
