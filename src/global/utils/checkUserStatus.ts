import { useStore } from '@nanostores/react';
import { $user } from '@stores/users';
import { AppSecurityProps } from '@global/interfaces/AppSecurityInterfaces';
import { $event } from '@stores/event';
import { userRoles } from '@global/config/constants';

/**
 * Pure function version of CheckUserStatus that doesn't use hooks.
 * Use this when you need to check user status in loops, useMemo, or other places where hooks can't be called.
 */
export const checkUserStatusPure = (
  user: ReturnType<typeof $user.get>,
  event: ReturnType<typeof $event.get>,
  {
    isLoggedIn,
    roles,
    negativeRoles,
    checkChurchId,
    churchRoles,
    negativeChurchRoles,
    checkAdminEvent,
    checkBandId,
    checkBandAdmin,
  }: AppSecurityProps
): boolean => {
  // Helper functions for each logical check
  const isAdmin = () =>
    user?.isLoggedIn && user?.roles.includes(userRoles.admin.id);

  const isLoggedInCheck = () => {
    if (isLoggedIn === undefined) return true;
    return user?.isLoggedIn === isLoggedIn;
  };

  const hasNegativeRolesCheck = () =>
    negativeRoles?.some((negativeRole) => user.roles.includes(negativeRole));

  const hasMembershipCheck = () => {
    if (checkChurchId) {
      return user.memberships?.some(
        (membership) => membership.church.id === checkChurchId,
      );
    }
    return true;
  };

  const hasBandMembershipCheck = () => {
    if (checkBandId) {
      return user.membersofBands?.some((band) => band.band.id === checkBandId);
    }
    return true;
  };

  const isBandAdminCheck = () => {
    if (!checkBandAdmin) return true;
    if (user?.isLoggedIn && user?.membersofBands) {
      return user.membersofBands.some(
        (band) => band.band.id === checkBandId && band.isAdmin,
      );
    }
    return false;
  };

  const hasNegativeChurchRolesCheck = () =>
    negativeChurchRoles?.some((negativeRole) =>
      user.memberships
        .find((membership) => membership.church.id === checkChurchId)
        ?.roles.map((role) => role.churchRoleId)
        .includes(negativeRole),
    );

  const hasRequiredRoleCheck = () =>
    roles?.some((role) => user.roles.includes(role));

  const hasChurchRoleCheck = () => {
    if (!churchRoles) return true;
    return churchRoles.some((role) => {
      const membership = user.memberships.find(
        (membership) => membership.church.id === checkChurchId,
      );
      return (
        membership?.roles.map((role) => role.churchRoleId).includes(role) ||
        false
      );
    });
  };

  const userHasAdminEventPermission = () => {
    if (!checkAdminEvent) return true;
    if (user?.isLoggedIn && user?.membersofBands) {
      return user.membersofBands.some(
        (band) => band.band.id === event?.bandId && band.isEventManager,
      );
    }
    return false;
  };

  // Realizar todas las validaciones
  if (isAdmin()) return true;
  if (!isLoggedInCheck()) return false;
  if (negativeRoles && hasNegativeRolesCheck()) return false;
  if (!hasMembershipCheck()) return false;
  if (!hasBandMembershipCheck()) return false;
  if (checkBandAdmin && !isBandAdminCheck()) return false;
  if (negativeChurchRoles && hasNegativeChurchRolesCheck()) return false;
  if (roles && !hasRequiredRoleCheck()) return false;
  if (churchRoles && !hasChurchRoleCheck()) return false;
  if (checkAdminEvent && !userHasAdminEventPermission()) return false;

  return true;
};

/**
 * Hook version of CheckUserStatus.
 * Use this at the top level of React components.
 */
export const CheckUserStatus = (props: AppSecurityProps): boolean => {
  const user = useStore($user);
  const event = useStore($event);

  return checkUserStatusPure(user, event, props);
};
