'use client';
import React, { useState } from 'react';
import { resendVerificationService } from '@auth/sign-up/_services/signUpService';
import toast from 'react-hot-toast';

interface ResendVerificationProps {
  email?: string;
  onClose?: () => void;
}

export const ResendVerification = ({
  email: initialEmail,
  onClose,
}: ResendVerificationProps) => {
  const [email, setEmail] = useState(initialEmail || '');
  const { mutate, isPending } = resendVerificationService();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (
      !email ||
      !/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email)
    ) {
      toast.error('Por favor ingresa un correo electrónico válido');
      return;
    }

    mutate(
      { email },
      {
        onSuccess: (data) => {
          toast.success(data.message || 'Correo de verificación enviado');
          if (onClose) onClose();
        },
        onError: (error) => {
          const errorMessage = error.message;
          if (errorMessage.includes('404-Usuario no encontrado')) {
            toast.error('No encontramos una cuenta con ese correo electrónico');
          } else if (errorMessage.includes('400-Email ya está verificado')) {
            toast.success(
              'Tu correo ya está verificado. Puedes iniciar sesión.',
            );
          } else if (errorMessage.includes('503-No se pudo enviar')) {
            toast.error(
              'Servicio de correo temporalmente no disponible. Intenta en unos minutos.',
            );
          } else {
            toast.error('Error al enviar el correo. Intenta de nuevo.');
          }
        },
      },
    );
  };

  return (
    <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
      <div className="mb-4">
        <h2 className="mb-2 text-xl font-semibold text-gray-800">
          Reenviar Verificación de Email
        </h2>
        <p className="text-sm text-gray-600">
          ¿No recibiste el correo de verificación? Podemos enviártelo
          nuevamente.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="email"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Correo Electrónico
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="correo@ejemplo.com"
            disabled={isPending}
            required
          />
        </div>

        <div className="flex space-x-3">
          <button
            type="submit"
            disabled={isPending}
            className="flex-1 rounded-md bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isPending ? 'Enviando...' : 'Reenviar'}
          </button>

          {onClose && (
            <button
              type="button"
              onClick={onClose}
              disabled={isPending}
              className="px-4 py-2 text-gray-600 transition-colors hover:text-gray-800"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
