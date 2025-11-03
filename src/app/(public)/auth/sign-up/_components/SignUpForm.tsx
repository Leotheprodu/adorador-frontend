'use client';
import { Button, Link } from '@nextui-org/react';
import { useSignUpForm } from '@auth/sign-up/_hooks/useSignUpForm';
import { InputUsernameSignUpForm } from '@auth/sign-up/_components/InputUsernameSignUpForm';
import { InputEmailOptionalForm } from '@auth/sign-up/_components/InputEmailOptionalForm';
import { InputPasswordLoginForm } from '@auth/login/_components/InputPasswordLoginForm';
import { findHrefFromLinks } from '@global/utils/findHrefFromLinks';
import { InputPhoneSignUpForm } from './InputPhoneSignUpForm';
import { InputBirthdateSignUpForm } from './InputBirthdateSignUpForm';
import { WhatsAppVerificationComponent } from './WhatsAppVerificationComponent';

export const SignUpForm = () => {
  const {
    handleOnChange,
    handleOnClear,
    handleSignUp,
    isInvalidPass,
    phone,
    password,
    password2,
    email,
    birthdate,
    isPending,
    username,
    noFormValue,
    data,
    status,
    dataPhone,
  } = useSignUpForm({
    phone: '',
    password: '',
    username: '',
    password2: '',
    email: '',
    birthdate: '',
  });

  if (status === 'success' && data) {
    return (
      <WhatsAppVerificationComponent
        verificationToken={data.verificationToken}
        whatsappMessage={data.whatsappMessage}
        userPhone={dataPhone || phone}
      />
    );
  }
  return (
    <div className="max-w-sm">
      {isPending && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-white bg-opacity-75">
          <div className="text-center">
            <div className="mx-auto h-12 w-12 animate-spin rounded-full border-b-2 border-primary"></div>
            <p className="mt-4 text-gray-600">Creando tu cuenta...</p>
          </div>
        </div>
      )}
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
          <InputEmailOptionalForm
            handle={{
              handleOnClear,
              email,
              handleOnChange,
              noFormValue: { ...noFormValue, email: false }, // Email ya no es requerido
            }}
          />
          <InputPhoneSignUpForm
            handle={{ handleOnChange, phone, noFormValue }}
          />
          <InputBirthdateSignUpForm handle={{ handleOnChange, birthdate }} />
          <InputPasswordLoginForm
            handle={{
              handleOnChange,
              isInvalidPass,
              password,
            }}
          />
          <InputPasswordLoginForm
            handle={{
              confirmPassword: true,
              handleOnChange,
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
