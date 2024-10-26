import React, { useEffect } from 'react';
import { CheckUserStatus } from '@global/utils/checkUserStatus';
import { useStore } from '@nanostores/react';
import { $user } from '@global/stores/users';
import { UiGuardProps } from '@global/interfaces/AppSecurityInterfaces';
import { Spinner } from '@global/utils/Spinner';

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

  if (isLoading) {
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
          {user.isLoggedIn
            ? 'No tienes permisos para acceder a esta página'
            : 'Inicia sesión para continuar'}
        </div>
      )}
    </>
  );
};
