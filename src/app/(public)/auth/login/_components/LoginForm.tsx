'use client';
import { Button } from '@nextui-org/react';
import { $user } from '@stores/users';
import { useStore } from '@nanostores/react';
import { InputPhoneLoginForm } from './InputPhoneLoginForm';
import { IsLoggedInHandle } from './IsLoggedInHandle';
import { InputPasswordLoginForm } from './InputPasswordLoginForm';
import { useLoginForm } from '../_hooks/useLoginForm';
import { AuthCard } from '../../_components/ui/AuthCard';
import { AuthHeader } from '../../_components/ui/AuthHeader';
import { AuthFooter } from '../../_components/ui/AuthFooter';

export const LoginForm = () => {
  const {
    handleOnChange,
    handleOnClear,
    handleLogin,
    isInvalidPass,
    phone,
    password,
    isPending,
  } = useLoginForm({ phone: '', password: '' });
  const user = useStore($user);
  return (
    <>
      {user.isLoggedIn && <IsLoggedInHandle user={user} />}
      {!user.isLoggedIn && (
        <AuthCard>
          <AuthHeader
            title="Bienvenido"
            subtitle="Inicia sesión para acceder a tus herramientas"
            emoji="🎵"
          />

          {/* Formulario */}
          <div className="px-8 py-8">
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-4">
                <InputPhoneLoginForm
                  handle={{ handleOnClear, phone, handleOnChange }}
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
                className="w-full border-2 border-transparent bg-gradient-to-r from-brand-purple-600 to-brand-blue-600 py-6 text-base font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl active:scale-95 dark:border-brand-pink-400 dark:from-brand-pink-600 dark:to-brand-blue-500"
              >
                Iniciar Sesión
              </Button>
            </form>

            <AuthFooter mode="login" />
          </div>
        </AuthCard>
      )}
    </>
  );
};
