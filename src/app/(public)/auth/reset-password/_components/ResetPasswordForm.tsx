'use client';

import { InputPasswordLoginForm } from '@auth/login/_components/InputPasswordLoginForm';
import { Button } from '@nextui-org/react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { resetPasswordService } from '../_services/resetPasswordService';

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
      <div className="flex min-h-[20rem] flex-col items-center gap-4">
        <p>Contraseña restablecida correctamente</p>
        <Button as={Link} href="/" color="success">
          Ir a Inicio
        </Button>
      </div>
    );
  }
  return (
    <div className="w-full sm:w-96">
      <h1 className="text-center text-2xl font-bold">Restablecer contraseña</h1>
      <p className="mt-2 text-center text-gray-500">
        Ingresa tu nueva contraseña
      </p>
      <form onSubmit={handleSubmit} className="mt-8 flex flex-col items-center">
        <div className="mb-4 w-full">
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
        </div>
        <div className="mb-4 w-full">
          <InputPasswordLoginForm
            handle={{
              handleOnChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                setError(false);
                setFormData({ ...formData, confirmPassword: e.target.value });
              },
              isInvalidPass: error,
              password: formData.confirmPassword,
              confirmPassword: true,
              placeHolder: 'Confirmar la nueva contraseña',
            }}
          />
        </div>
        <Button isLoading={isPending} type="submit" color="primary">
          Restablecer contraseña
        </Button>
      </form>
    </div>
  );
};
