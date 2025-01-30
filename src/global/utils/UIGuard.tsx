import React, { useEffect } from 'react';
import { CheckUserStatus } from '@global/utils/checkUserStatus';
import { useStore } from '@nanostores/react';
import { $user } from '@global/stores/users';
import { UiGuardProps } from '@global/interfaces/AppSecurityInterfaces';
import { Spinner } from '@global/utils/Spinner';
import { Button } from '@nextui-org/react';
import Link from 'next/link';

export const UIGuard = ({
  children,
  isLoggedIn,
  roles,
  negativeRoles,
  isLoading,
  checkChurchId,
  churchRoles,
  negativeChurchRoles,
}: UiGuardProps) => {
  const user = useStore($user);
  const checkUserStatus = CheckUserStatus({
    isLoggedIn,
    roles,
    negativeRoles,
    checkChurchId,
    churchRoles,
    negativeChurchRoles,
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
        <div>
          {user.isLoggedIn ? (
            <div className="flex flex-col items-center gap-2">
              <p>Lo sentimos, no tienes permisos para acceder a esta página</p>
              <Button color="primary" href="/" as={Link}>
                Ir a Inicio
              </Button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <p>Debes iniciar sesión, para poder ver esta página</p>
              <Button as={Link} color="primary" href="/auth/login">
                Iniciar sesión
              </Button>
            </div>
          )}
        </div>
      )}
    </>
  );
};
