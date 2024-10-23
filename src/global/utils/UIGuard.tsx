import React, { useEffect, useState } from 'react';
import { CheckUserStatus } from './checkUserStatus';
import { useStore } from '@nanostores/react';
import { Spinner } from './Spinner';
import { $user } from '@/global/stores/users';
import { UiGuardProps } from '../interfaces/AppSecurityInterfaces';

export const UIGuard = ({
  children,
  isLoggedIn,
  roles = [],
  negativeRoles = [],
  isLoading = false,
  checkChurchId,
  churchRoles = [],
  negativeChurchRoles = [],
}: UiGuardProps) => {
  const user = useStore($user);
  const [pageLoading, setPageLoading] = useState(true);
  useEffect(() => {
    setPageLoading(isLoading);
  }, [isLoading]);

  return (
    <>
      <Spinner isLoading={pageLoading} />

      <>
        {CheckUserStatus({
          isLoggedIn,
          roles,
          negativeRoles,
          checkChurchId,
          churchRoles,
          negativeChurchRoles,
        }) ? (
          children
        ) : (
          <div>
            {user.isLoggedIn ? 'No tiene Permisos' : 'Debe iniciar sesión'}
          </div>
        )}
      </>
    </>
  );
};
