// Helper para verificar capacidades del usuario en eventos
import { useStore } from '@nanostores/react';
import { $user } from '@stores/users';

export const useEventCapabilities = (eventBandId?: number) => {
  const user = useStore($user);

  const isAuthenticated = !!user && user.id > 0;

  const canManageEvent =
    isAuthenticated && eventBandId
      ? user.membersofBands?.some(
          (membership) =>
            membership.band.id === eventBandId && membership.isEventManager,
        )
      : false;

  const canViewEvent = true; // Siempre pueden ver (streaming público)

  return {
    isAuthenticated,
    canManageEvent,
    canViewEvent,
    user,
  };
};
