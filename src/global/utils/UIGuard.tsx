import React, { useEffect } from 'react';
import { CheckUserStatus } from '@global/utils/checkUserStatus';
import { useStore } from '@nanostores/react';
import { $user } from '@global/stores/users';
import { UiGuardProps } from '@global/interfaces/AppSecurityInterfaces';
import { Spinner } from '@global/utils/Spinner';
import { Button } from '@nextui-org/react';
import Link from 'next/link';
import { LockClosedIcon } from '@global/icons';

export const UIGuard = ({
  children,
  isLoggedIn,
  roles,
  negativeRoles,
  isLoading,
  checkChurchId,
  churchRoles,
  negativeChurchRoles,
  checkAdminEvent,
  checkBandId,
}: UiGuardProps) => {
  const user = useStore($user);
  const checkUserStatus = CheckUserStatus({
    isLoggedIn,
    roles,
    negativeRoles,
    checkChurchId,
    churchRoles,
    negativeChurchRoles,
    checkAdminEvent,
    checkBandId,
  });
  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isLoading]);

  if (isLoading && checkUserStatus) {
    return (
      <div
        style={{
          position: 'fixed',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          backgroundColor: 'white',
          zIndex: '1000',
        }}
      >
        <Spinner />
      </div>
    );
  }

  return (
    <>
      {checkUserStatus ? (
        children
      ) : (
        <div className="flex min-h-[60vh] items-center justify-center px-4 py-16">
          <div className="w-full max-w-md">
            {user.isLoggedIn ? (
              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                {/* Icono */}
                <div className="mb-6 flex justify-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brand-pink-100 to-brand-purple-100">
                    <LockClosedIcon className="h-10 w-10 text-brand-purple-600" />
                  </div>
                </div>

                {/* Título y mensaje */}
                <div className="mb-6 text-center">
                  <h2 className="mb-2 text-2xl font-bold text-slate-900">
                    Acceso Restringido
                  </h2>
                  <p className="text-slate-600">
                    Lo sentimos, no tienes los permisos necesarios para acceder
                    a esta página.
                  </p>
                </div>

                {/* Botón */}
                <Button
                  as={Link}
                  href="/"
                  className="w-full bg-gradient-to-r from-brand-purple-600 to-brand-pink-600 font-semibold text-white"
                  size="lg"
                >
                  Ir a Inicio
                </Button>
              </div>
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                {/* Icono */}
                <div className="mb-6 flex justify-center">
                  <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brand-purple-100 to-brand-blue-100">
                    <LockClosedIcon className="h-10 w-10 text-brand-purple-600" />
                  </div>
                </div>

                {/* Título y mensaje */}
                <div className="mb-6 text-center">
                  <h2 className="mb-2 text-2xl font-bold text-slate-900">
                    Inicia Sesión
                  </h2>
                  <p className="text-slate-600">
                    Para acceder a esta página necesitas iniciar sesión con tu
                    cuenta.
                  </p>
                </div>

                {/* Botones */}
                <div className="flex flex-col gap-3">
                  <Button
                    as={Link}
                    href="/auth/login"
                    className="w-full bg-gradient-to-r from-brand-purple-600 to-brand-pink-600 font-semibold text-white"
                    size="lg"
                  >
                    Iniciar Sesión
                  </Button>
                  <Button
                    as={Link}
                    href="/"
                    variant="bordered"
                    className="w-full border-slate-300 font-medium text-slate-700"
                    size="lg"
                  >
                    Volver a Inicio
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
};
