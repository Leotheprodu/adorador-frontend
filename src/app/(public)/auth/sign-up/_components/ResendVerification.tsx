'use client';
import React, { useState } from 'react';
import { resendVerificationService } from '@auth/sign-up/_services/signUpService';
import toast from 'react-hot-toast';

interface ResendVerificationProps {
  phone?: string;
  onClose?: () => void;
}

export const ResendVerification = ({
  phone: initialPhone,
  onClose,
}: ResendVerificationProps) => {
  const [phone, setPhone] = useState(initialPhone || '');
  const { mutate, isPending } = resendVerificationService();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!phone.startsWith('+')) {
      toast.error('El número debe incluir el + y código de país (ej: +50677778888)');
      return;
    }

    if (!/^\+[1-9]\d{7,14}$/.test(phone)) {
      toast.error('Formato de número inválido. Ejemplo: +50677778888');
      return;
    }

    mutate(
      { phone },
      {
        onSuccess: (data) => {
          toast.success(data.message || 'Código de verificación enviado por WhatsApp');
          if (onClose) onClose();
        },
        onError: (error) => {
          const errorMessage = error.message;
          if (errorMessage.includes('404-Usuario no encontrado')) {
            toast.error('No encontramos una cuenta con ese número de teléfono');
          } else if (errorMessage.includes('400-Phone ya está verificado')) {
            toast.success(
              'Tu número ya está verificado. Puedes iniciar sesión.',
            );
          } else if (errorMessage.includes('503-No se pudo enviar')) {
            toast.error(
              'Servicio de WhatsApp temporalmente no disponible. Intenta en unos minutos.',
            );
          } else {
            toast.error('Error al enviar el código. Intenta de nuevo.');
          }
        },
      },
    );
  };

  return (
    <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-lg">
      <div className="mb-4">
        <h2 className="mb-2 text-xl font-semibold text-gray-800">
          Reenviar Verificación por WhatsApp
        </h2>
        <p className="text-sm text-gray-600">
          ¿No recibiste el código de verificación? Podemos enviártelo
          nuevamente por WhatsApp.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="phone"
            className="mb-1 block text-sm font-medium text-gray-700"
          >
            Número de Teléfono
          </label>
          <input
            type="tel"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="+50677778888"
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
