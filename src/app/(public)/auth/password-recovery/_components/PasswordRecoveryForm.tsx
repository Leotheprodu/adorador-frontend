'use client';
import { Button, Input } from '@nextui-org/react';
import { useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { PasswordRecoveryService } from '../_services/PasswordRecoveryService';
import Link from 'next/link';

export const PasswordRecoveryForm = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(false);
  const emailInput = useRef<HTMLInputElement>(null);
  const { status, mutate, isPending } = PasswordRecoveryService();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(false);
    if (!email) {
      toast.error('Debes ingresar un correo electrónico');
      setError(true);
      if (emailInput.current) emailInput.current.focus();
      return;
    }
    //revisa con regex si el email es valido
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      toast.error('Debes ingresar un correo electrónico válido');
      setError(true);
      if (emailInput.current) emailInput.current.focus();
      return;
    }
    mutate({ email });
  };
  if (status === 'success') {
    return (
      <div className="flex min-h-[20rem] flex-col items-center gap-4">
        <p>
          Hemos enviado un enlace a tu correo electrónico para restablecer tu
          contraseña.
        </p>
        <Button as={Link} href="/" color="success">
          Ir a Inicio
        </Button>
      </div>
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
        Ingresa tu correo electrónico y te enviaremos un enlace para restablecer
        tu contraseña.
      </p>
      <Input
        ref={emailInput}
        value={email}
        autoComplete="email"
        onChange={(e) => {
          setEmail(e.target.value);
          setError(false);
        }}
        className={`mb-4 ${error ? 'border border-danger' : ''}`}
        type="text"
        placeholder="correo electrónico"
        autoFocus
      />
      <Button isLoading={isPending} type="submit" color="primary">
        Enviar
      </Button>
    </form>
  );
};
