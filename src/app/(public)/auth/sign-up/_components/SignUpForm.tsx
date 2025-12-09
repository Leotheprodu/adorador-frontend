'use client';
import { Button } from "@heroui/react";
import { useSignUpForm } from '@auth/sign-up/_hooks/useSignUpForm';
import { InputUsernameSignUpForm } from '@auth/sign-up/_components/InputUsernameSignUpForm';
import { InputEmailSignUpForm } from '@auth/sign-up/_components/InputEmailSignUpForm';
import { InputPasswordLoginForm } from '@auth/login/_components/InputPasswordLoginForm';
import { InputPhoneSignUpForm } from './InputPhoneSignUpForm';
import { InputBirthdateSignUpForm } from './InputBirthdateSignUpForm';
import { WhatsAppVerificationComponent } from './WhatsAppVerificationComponent';
import { IsLoggedInHandle } from '@auth/login/_components/IsLoggedInHandle';
import { $user } from '@stores/users';
import { useStore } from '@nanostores/react';
import { AuthCard } from '../../_components/ui/AuthCard';
import { AuthHeader } from '../../_components/ui/AuthHeader';
import { AuthFooter } from '../../_components/ui/AuthFooter';

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

      <AuthCard>
        <AuthHeader
          title="¡Únete Ahora!"
          subtitle="Crea tu cuenta gratis y disfruta de todas las herramientas"
          emoji="✨"
        />

        {/* Formulario */}
        <div className="px-8 py-8">
          <form onSubmit={handleSignUp} className="space-y-6">
            <div className="space-y-4">
              <InputUsernameSignUpForm
                handle={{ handleOnChange, username, noFormValue }}
              />
              <InputEmailSignUpForm
                handle={{
                  handleOnClear,
                  email,
                  handleOnChange,
                  noFormValue,
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

          <AuthFooter mode="signup" />
        </div>
      </AuthCard>
    </div>
  );
};
