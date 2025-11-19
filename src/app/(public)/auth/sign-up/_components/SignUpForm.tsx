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

      {/* Card principal con glassmorphism y soporte dark */}
      <div className="overflow-hidden rounded-3xl bg-white/80 shadow-2xl ring-1 ring-slate-200/50 backdrop-blur-sm transition-colors duration-300 dark:bg-brand-purple-900/90 dark:ring-brand-purple-800">
        {/* Header con gradiente y soporte dark */}
        <div className="relative overflow-hidden bg-gradient-to-br from-brand-purple-600 via-brand-pink-500 to-brand-blue-600 px-8 py-12 text-center transition-colors duration-300 dark:from-brand-purple-950 dark:via-brand-purple-900 dark:to-brand-blue-900">
          {/* Patrón decorativo */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute left-0 top-0 h-40 w-40 rounded-full bg-white blur-3xl dark:bg-brand-purple-900"></div>
            <div className="absolute bottom-0 right-0 h-40 w-40 rounded-full bg-white blur-3xl dark:bg-brand-purple-900"></div>
          </div>

          <div className="relative z-10">
            <div className="mb-4 text-5xl">✨</div>
            <h1 className="text-3xl font-bold text-white dark:text-white sm:text-4xl">
              ¡Únete Ahora!
            </h1>
            <p className="mt-2 text-sm text-white/90 dark:text-brand-purple-200 sm:text-base">
              Crea tu cuenta gratis y disfruta de todas las herramientas
            </p>
          </div>
        </div>

        {/* Formulario */}
        <div className="px-8 py-8">
          <form onSubmit={handleSignUp} className="space-y-6">
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
              className="w-full border-2 border-transparent bg-gradient-to-r from-brand-purple-600 to-brand-blue-600 py-6 text-base font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl active:scale-95 dark:border-brand-pink-400 dark:from-brand-pink-600 dark:to-brand-blue-500"
            >
              Crear Cuenta Gratis
            </Button>
          </form>

          {/* Link a login */}
          <div className="mt-6 space-y-3">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-200"></div>
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-slate-500 dark:bg-brand-purple-900 dark:text-brand-purple-200">
                  o
                </span>
              </div>
            </div>

            <div className="text-center">
              <p className="text-sm text-slate-600 dark:text-brand-pink-200">
                ¿Ya tienes una cuenta?{' '}
                <Link
                  href={findHrefFromLinks('Login')}
                  className="font-semibold text-brand-purple-600 transition-colors hover:text-brand-purple-700 hover:underline dark:text-white dark:hover:text-brand-pink-200"
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
        <p className="text-xs text-slate-500 dark:text-brand-purple-300">
          Al crear una cuenta, aceptas nuestros{' '}
          <span className="font-medium text-slate-700 dark:text-white">
            Términos de Servicio
          </span>{' '}
          y{' '}
          <span className="font-medium text-slate-700 dark:text-white">
            Política de Privacidad
          </span>
        </p>
      </div>
    </div>
  );
};
