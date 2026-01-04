'use client';

import { InputPasswordLoginForm } from '@auth/login/_components/InputPasswordLoginForm';
import { Button } from '@heroui/react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { resetPasswordService } from '../_services/resetPasswordService';
import { AuthCard } from '../../_components/ui/AuthCard';
import { AuthHeader } from '../../_components/ui/AuthHeader';
import { AuthFooter } from '../../_components/ui/AuthFooter';

export const ResetPasswordForm = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState(false);

  const { status, mutate, isPending } = resetPasswordService();
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.password || !formData.confirmPassword) {
      toast.error('Debes ingresar los campos con tu nueva contraseña');
      setError(true);
      return;
    }
    if (formData.password !== formData.confirmPassword) {
      toast.error('Las contraseñas no coinciden');
      setError(true);
      return;
    }
    mutate({
      token: typeof token === 'string' ? token : '',
      password: formData.password,
    });
  };

  if (status === 'success') {
    return (
      <AuthCard>
        <AuthHeader
          title="Contraseña Restablecida"
          subtitle="Tu contraseña ha sido actualizada correctamente"
        />
        <div className="space-y-6 px-8 py-8 text-center">
          <div className="rounded-xl bg-green-50 p-4 text-green-700 dark:bg-green-900/20 dark:text-green-300">
            ¡Todo listo! Ya puedes iniciar sesión con tu nueva contraseña.
          </div>
          <Button
            as={Link}
            href="/auth/login"
            className="w-full bg-brand-purple-600 font-semibold text-white"
          >
            Iniciar Sesión
          </Button>
        </div>
      </AuthCard>
    );
  }
  return (
    <AuthCard>
      <AuthHeader
        title="Restablecer Contraseña"
        subtitle="Ingresa tu nueva contraseña segura"
      />
      <div className="px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <InputPasswordLoginForm
              handle={{
                handleOnChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                  setError(false);
                  setFormData({ ...formData, password: e.target.value });
                },
                isInvalidPass: error,
                password: formData.password,
                confirmPassword: false,
                placeHolder: 'Nueva contraseña',
              }}
            />
            <InputPasswordLoginForm
              handle={{
                handleOnChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                  setError(false);
                  setFormData({ ...formData, confirmPassword: e.target.value });
                },
                isInvalidPass: error,
                password: formData.confirmPassword,
                confirmPassword: true,
                placeHolder: 'Confirmar nueva contraseña',
              }}
            />
          </div>
          <Button
            isLoading={isPending}
            type="submit"
            className="w-full bg-brand-purple-600 py-6 text-base font-semibold text-white shadow-lg transition-transform duration-200 hover:scale-[1.02] hover:bg-brand-purple-700 active:scale-95 dark:bg-brand-purple-600 dark:hover:bg-brand-purple-500"
          >
            Actualizar Contraseña
          </Button>
        </form>
        <AuthFooter mode="login" />
      </div>
    </AuthCard>
  );
};
