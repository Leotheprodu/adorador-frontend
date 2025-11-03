'use client';
import { useEffect, useRef } from 'react';
import { Button, Link } from '@nextui-org/react';
import { verifyWhatsAppTokenService } from '@auth/verify-email/_services/verifyService';
import toast from 'react-hot-toast';
import { findHrefFromLinks } from '@/global/utils/findHrefFromLinks';
import { useSearchParams } from 'next/navigation';

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

  return (
    <div className="flex flex-col items-center justify-center gap-10">
      <p>
        {status === 'pending'
          ? 'Verificando tu número de WhatsApp...'
          : status === 'success'
            ? '¡Número de WhatsApp verificado correctamente! Ya puedes iniciar sesión'
            : status === 'error'
              ? 'Token inválido o expirado. Por favor, solicita un nuevo código de verificación'
              : 'Verificando...'}
      </p>
      <div>
        <Button
          as={Link}
          isDisabled={status === 'pending'}
          href={findHrefFromLinks('Login')}
        >
          Iniciar Sesión
        </Button>
      </div>
    </div>
  );
};
