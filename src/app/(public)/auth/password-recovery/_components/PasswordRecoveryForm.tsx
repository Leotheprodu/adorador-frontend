'use client';
import { Button, Input } from '@nextui-org/react';
import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { PasswordRecoveryService } from '../_services/PasswordRecoveryService';
import Link from 'next/link';
import { WhatsAppResetComponent } from './WhatsAppResetComponent';

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
  if (status === 'error') {
    return (
      <div className="flex min-h-[20rem] flex-col items-center gap-4">
        <p>
          Ha ocurrido un error, por favor intenta de nuevo o contacta con
          soporte.
        </p>
        <Button as={Link} href="/" color="success">
          Ir a Inicio
        </Button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex min-h-[20rem] max-w-[20rem] flex-col items-center gap-2"
    >
      <p className="mb-4">
        Ingresa tu número de teléfono y te ayudaremos a restablecer tu
        contraseña por WhatsApp.
      </p>
      <Input
        ref={phoneInput}
        value={phone}
        autoComplete="tel"
        onChange={(e) => {
          setPhone(e.target.value);
          setError(false);
        }}
        className={`mb-4 ${error ? 'border border-danger' : ''}`}
        type="tel"
        placeholder="+50677778888"
        description="Incluye el + y código de país"
        autoFocus
      />
      <Button isLoading={isPending} type="submit" color="primary">
        Generar Token de Reset
      </Button>
    </form>
  );
};
