import { useStore } from '@nanostores/react';
import { $user } from '@global/stores/users';
import { AppSecurityProps } from '@global/interfaces/AppSecurityInterfaces';
import { $event } from '@stores/event';
import { userRoles } from '@global/config/constants';
import { useEffect, useState } from 'react';

export const CheckUserStatus = ({
  isLoggedIn,
  roles,
  negativeRoles,
  checkChurchId,
  churchRoles,
  negativeChurchRoles,
  checkAdminEvent,
  checkBandId,
}: AppSecurityProps): boolean => {
  const user = useStore($user);
  const event = useStore($event);

  const [pass, setPass] = useState(true);

  // Helper functions for each logical check
  const isAdmin = () =>
    user?.isLoggedIn && user?.roles.includes(userRoles.admin.id);

  const isLoggedInCheck = () => {
    if (isLoggedIn === undefined) return true; // If isLoggedIn is not defined, assume true
    return user?.isLoggedIn === isLoggedIn || user?.isLoggedIn === true;
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
    if (checkAdminEvent && user?.isLoggedIn && user?.membersofBands) {
      return user.membersofBands.some(
        (band) => band.band.id === event?.bandId && band.isEventManager,
      );
    }
    return true;
  };

  useEffect(() => {
    if (isAdmin()) {
      setPass(true);
      console.log('User is an admin, access granted');
      return;
    }
    if (!isLoggedInCheck()) {
      setPass(false);
      console.log('User is not logged in or logged in status does not match');
      return;
    }
    if (negativeRoles && hasNegativeRolesCheck()) {
      setPass(false);
      console.log('User has negative roles');
      return;
    }
    if (!hasMembershipCheck()) {
      setPass(false);
      console.log('User does not have the required church membership');
      return;
    }
    if (!hasBandMembershipCheck()) {
      setPass(false);
      console.log('User does not have the required band membership');
      return;
    }
    if (negativeChurchRoles && hasNegativeChurchRolesCheck()) {
      setPass(false);
      console.log('User has negative church roles');
      return;
    }
    if (roles && !hasRequiredRoleCheck()) {
      setPass(false);
      console.log('User does not have the required roles');
      return;
    }
    if (churchRoles && !hasChurchRoleCheck()) {
      setPass(false);
      console.log('User does not have the required church roles');
      return;
    }
    if (!userHasAdminEventPermission()) {
      setPass(false);
      console.log('User does not have admin event permission');
      return;
    }
    setPass(true);

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    user,
    event,
    isLoggedIn,
    roles,
    negativeRoles,
    checkChurchId,
    churchRoles,
    negativeChurchRoles,
    checkAdminEvent,
    checkBandId,
  ]);
  return pass;
};
