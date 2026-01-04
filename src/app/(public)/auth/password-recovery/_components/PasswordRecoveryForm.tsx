'use client';
import { Button, Input } from '@heroui/react';
import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { PasswordRecoveryService } from '../_services/PasswordRecoveryService';
import { WhatsAppResetComponent } from './WhatsAppResetComponent';
import { AuthCard } from '../../_components/ui/AuthCard';
import { AuthHeader } from '../../_components/ui/AuthHeader';
import { AuthFooter } from '../../_components/ui/AuthFooter';

export const PasswordRecoveryForm = () => {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState(false);
  const phoneInput = useRef<HTMLInputElement>(null);
  const { status, mutate, isPending, data } = PasswordRecoveryService();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(false);

    if (!phone) {
      toast.error('Debes ingresar un número de teléfono');
      setError(true);
      if (phoneInput.current) phoneInput.current.focus();
      return;
    }

    // Validar formato de teléfono internacional
    if (!phone.startsWith('+')) {
      toast.error(
        'El número debe incluir el + y código de país (ej: +50677778888)',
      );
      setError(true);
      if (phoneInput.current) phoneInput.current.focus();
      return;
    }

    if (!/^\+[1-9]\d{7,14}$/.test(phone)) {
      toast.error('Formato de número inválido. Ejemplo: +50677778888');
      setError(true);
      if (phoneInput.current) phoneInput.current.focus();
      return;
    }

    mutate({ phone });
  };

  if (status === 'success' && data) {
    return (
      <WhatsAppResetComponent
        resetToken={data.resetToken}
        phone={data.phone}
        whatsappMessage={data.whatsappMessage}
      />
    );
  }

  // Handle error state inside the card now or separate?
  // Let's keep the form logic but styled nicely.

  return (
    <AuthCard>
      <AuthHeader
        title="Recuperar Contraseña"
        subtitle="Ingresa tu número para recibir instrucciones"
      />

      <div className="px-8 py-8">
        {status === 'error' ? (
          <div className="space-y-6 text-center">
            <div className="rounded-xl bg-red-50 p-4 text-red-600 dark:bg-red-900/20 dark:text-red-300">
              Ha ocurrido un error, por favor intenta de nuevo o contacta con
              soporte.
            </div>
            <Button
              href="/auth/login"
              as="a"
              className="w-full bg-brand-purple-600 font-semibold text-white"
            >
              Volver al inicio
            </Button>
          </div>
        ) : (
          <>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Input
                  ref={phoneInput}
                  value={phone}
                  autoComplete="tel"
                  onChange={(e) => {
                    setPhone(e.target.value);
                    setError(false);
                  }}
                  variant="bordered"
                  label="Número de WhatsApp"
                  placeholder="+50677778888"
                  isInvalid={error}
                  errorMessage={error && 'Formato inválido'}
                  className="text-gray-900 dark:text-brand-purple-200"
                  type="tel"
                  description="Incluye el + y código de país"
                  autoFocus
                />
              </div>

              <Button
                isLoading={isPending}
                type="submit"
                className="w-full bg-brand-purple-600 py-6 text-base font-semibold text-white shadow-lg transition-transform duration-200 hover:scale-[1.02] hover:bg-brand-purple-700 active:scale-95 dark:bg-brand-purple-600 dark:hover:bg-brand-purple-500"
              >
                Enviar Instrucciones
              </Button>
            </form>
            <AuthFooter mode="recovery" />
          </>
        )}
      </div>
    </AuthCard>
  );
};
