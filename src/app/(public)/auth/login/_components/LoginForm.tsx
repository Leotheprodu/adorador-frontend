'use client';
import { Button } from '@heroui/react';
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
                className="w-full bg-brand-purple-600 py-6 text-base font-semibold text-white shadow-lg transition-transform duration-200 hover:scale-[1.02] hover:bg-brand-purple-700 active:scale-95 dark:bg-brand-purple-600 dark:hover:bg-brand-purple-500"
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
