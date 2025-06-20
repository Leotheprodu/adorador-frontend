'use client';
import { useEffect, useRef } from 'react';
import { Button, Link } from '@nextui-org/react';
import { verifyEmailService } from '@auth/verify-email/_services/verifyService';
import toast from 'react-hot-toast';
import { findHrefFromLinks } from '@/global/utils/findHrefFromLinks';
import { useSearchParams } from 'next/navigation';

export const VerifyEmail = () => {
  const searchParams = useSearchParams();
  const hasMutated = useRef(false);

  const token = searchParams.get('token');
  const { status, mutate } = verifyEmailService({
    token: typeof token === 'string' ? token : '',
  });
  useEffect(() => {
    // comprobamos si el token existe y si el estado es idle y si no ha mutado
    if (token && status === 'idle' && !hasMutated.current) {
      hasMutated.current = true;
      mutate(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (status === 'success') {
      toast.success('Correo verificado correctamente');
    } else if (status === 'error') {
      toast.error('Token inválido');
    }
  }, [status]);

  return (
    <div className="flex flex-col items-center justify-center gap-10">
      <p>
        {status === 'pending'
          ? 'Verificando...'
          : status === 'success'
            ? 'Correo verificado correctamente, ya puedes iniciar sesión'
            : status === 'error'
              ? 'Token inválido'
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
