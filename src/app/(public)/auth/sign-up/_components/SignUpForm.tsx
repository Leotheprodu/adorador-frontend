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
import { IsLoggedInHandle } from '@auth/login/_components/IsLoggedInHandle';
import { $user } from '@stores/users';
import { useStore } from '@nanostores/react';

export const SignUpForm = () => {
  const user = useStore($user);
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

  // Si el usuario ya está logueado, mostrar el componente IsLoggedInHandle
  if (user.isLoggedIn) {
    return <IsLoggedInHandle user={user} />;
  }

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
    <div className="w-full max-w-md">
      {/* Loading overlay mejorado */}
      {isPending && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-brand-purple-900/90 to-brand-pink-900/90 backdrop-blur-sm">
          <div className="text-center">
            <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-white/20 border-t-white"></div>
            <p className="text-lg font-semibold text-white">
              Creando tu cuenta...
            </p>
            <p className="mt-2 text-sm text-white/80">
              Esto solo tomará un momento
            </p>
          </div>
        </div>
      )}

      {/* Card principal con glassmorphism */}
      <div className="overflow-hidden rounded-3xl bg-white/80 shadow-2xl ring-1 ring-slate-200/50 backdrop-blur-sm">
        {/* Header con gradiente */}
        <div className="relative overflow-hidden bg-gradient-to-br from-brand-purple-600 via-brand-pink-500 to-brand-purple-700 px-8 py-10 text-center">
          {/* Patrón decorativo */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute left-0 top-0 h-40 w-40 rounded-full bg-white blur-3xl"></div>
            <div className="absolute bottom-0 right-0 h-40 w-40 rounded-full bg-white blur-3xl"></div>
          </div>

          <div className="relative z-10">
            <div className="mb-3 text-5xl">✨</div>
            <h1 className="text-3xl font-bold text-white sm:text-4xl">
              ¡Únete Ahora!
            </h1>
            <p className="mt-2 text-sm text-white/90 sm:text-base">
              Crea tu cuenta gratis y disfruta de todas las herramientas
            </p>
          </div>
        </div>

        {/* Formulario */}
        <div className="px-8 py-8">
          <form onSubmit={handleSignUp} className="space-y-5">
            <div className="space-y-4">
              <InputUsernameSignUpForm
                handle={{ handleOnChange, username, noFormValue }}
              />
              <InputEmailOptionalForm
                handle={{
                  handleOnClear,
                  email,
                  handleOnChange,
                  noFormValue: { ...noFormValue, email: false },
                }}
              />
              <InputPhoneSignUpForm
                handle={{ handleOnChange, phone, noFormValue }}
              />
              <InputBirthdateSignUpForm
                handle={{ handleOnChange, birthdate }}
              />
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
              className="w-full bg-gradient-to-r from-brand-purple-600 via-brand-pink-500 to-brand-purple-600 py-6 text-base font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl active:scale-95"
            >
              Crear Cuenta Gratis
            </Button>
          </form>

          {/* Link a login */}
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-500">o</span>
              </div>
            </div>

            <div className="mt-4 text-center">
              <p className="text-sm text-slate-600">
                ¿Ya tienes una cuenta?{' '}
                <Link
                  href={findHrefFromLinks('Login')}
                  className="font-semibold text-brand-purple-600 transition-colors hover:text-brand-purple-700 hover:underline"
                >
                  Inicia sesión
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Info adicional */}
      <div className="mt-6 text-center">
        <p className="text-xs text-slate-500">
          Al crear una cuenta, aceptas nuestros{' '}
          <span className="font-medium text-slate-700">
            Términos de Servicio
          </span>{' '}
          y{' '}
          <span className="font-medium text-slate-700">
            Política de Privacidad
          </span>
        </p>
      </div>
    </div>
  );
};
