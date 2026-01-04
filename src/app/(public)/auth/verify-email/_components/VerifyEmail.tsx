'use client';
import { useEffect, useRef } from 'react';
import { Button, Link } from '@heroui/react';
import { verifyWhatsAppTokenService } from '@auth/verify-email/_services/verifyService';
import toast from 'react-hot-toast';
import { findHrefFromLinks } from '@/global/utils/findHrefFromLinks';
import { useSearchParams } from 'next/navigation';
import { AuthCard } from '../../_components/ui/AuthCard';
import { AuthHeader } from '../../_components/ui/AuthHeader';

export const VerifyWhatsApp = () => {
  const searchParams = useSearchParams();
  const hasMutated = useRef(false);

  const token = searchParams.get('token');
  const { status, mutate } = verifyWhatsAppTokenService();
  useEffect(() => {
    // comprobamos si el token existe y si el estado es idle y si no ha mutado
    if (token && status === 'idle' && !hasMutated.current) {
      hasMutated.current = true;
      mutate({ token });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (status === 'success') {
      toast.success('Número de WhatsApp verificado correctamente');
    } else if (status === 'error') {
      toast.error('Token inválido o expirado');
    }
  }, [status]);

  let content;
  if (status === 'pending' || status === 'idle') {
    content = (
      <div className="space-y-4 text-center">
        <div className="mx-auto h-12 w-12 animate-spin rounded-full border-4 border-brand-purple-200 border-t-brand-purple-600"></div>
        <p className="text-slate-600 dark:text-slate-400">
          Verificando tu número de WhatsApp...
        </p>
      </div>
    );
  } else if (status === 'success') {
    content = (
      <div className="space-y-6 text-center">
        <div className="rounded-xl bg-green-50 p-4 text-green-700 dark:bg-green-900/20 dark:text-green-300">
          ¡Número de WhatsApp verificado correctamente! Ya puedes iniciar
          sesión.
        </div>
        <Button
          as={Link}
          href={findHrefFromLinks('Login')}
          className="w-full bg-brand-purple-600 py-6 font-semibold text-white shadow-lg hover:bg-brand-purple-700"
        >
          Iniciar Sesión
        </Button>
      </div>
    );
  } else {
    content = (
      <div className="space-y-6 text-center">
        <div className="rounded-xl bg-red-50 p-4 text-red-600 dark:bg-red-900/20 dark:text-red-300">
          Token inválido o expirado. Por favor, solicita un nuevo código de
          verificación.
        </div>
        <Button
          as={Link}
          href={findHrefFromLinks('Login')}
          variant="bordered"
          className="w-full font-semibold"
        >
          Volver al inicio
        </Button>
      </div>
    );
  }

  return (
    <AuthCard>
      <AuthHeader
        title="Verificación"
        subtitle="Confirmando tu cuenta de WhatsApp"
      />
      <div className="px-8 py-8">{content}</div>
    </AuthCard>
  );
};
