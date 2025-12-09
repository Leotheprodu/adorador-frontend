import React, { useEffect } from 'react';
import { CheckUserStatus } from '@global/utils/checkUserStatus';
import { useStore } from '@nanostores/react';
import { $user } from '@global/stores/users';
import { UiGuardProps } from '@global/interfaces/AppSecurityInterfaces';
import { Spinner } from '@global/utils/Spinner';
import { AccessDeniedView } from '@global/components/AccessDeniedView';
import { LoginRequiredView } from '@global/components/LoginRequiredView';

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
  const [mounted, setMounted] = React.useState(false);
  
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
    setMounted(true);
  }, []);

  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isLoading]);

  // Don't show loading state during SSR to avoid hydration mismatch
  if (!mounted) {
    return null;
  }

  if (isLoading && checkUserStatus) {
    return (
      <div className="fixed inset-0 z-[1000] h-full w-full bg-background">
        <Spinner />
      </div>
    );
  }

  if (checkUserStatus) {
    return <>{children}</>;
  }

  return user.isLoggedIn ? <AccessDeniedView /> : <LoginRequiredView />;
};
