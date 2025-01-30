import { useStore } from '@nanostores/react';
import { $user } from '@global/stores/users';
import { AppSecurityProps } from '@global/interfaces/AppSecurityInterfaces';
import { $event } from '@stores/event';

export const CheckUserStatus = ({
  isLoggedIn,
  roles,
  negativeRoles,
  checkChurchId,
  churchRoles,
  negativeChurchRoles,
  checkAdminEvent,
}: AppSecurityProps): boolean => {
  const user = useStore($user);
  const event = useStore($event);

  // Verificar si el usuario está logueado y no tiene la propiedad isLoggedIn en false
  if (user !== null && isLoggedIn !== null && isLoggedIn !== undefined) {
    if (isLoggedIn === true && !user.isLoggedIn) {
      return false;
    }

    if (isLoggedIn === false && user.isLoggedIn) {
      return false;
    }
  }

  // Verificar si el usuario tiene alguno de los negativeRoles
  const hasNegativeRoles = negativeRoles?.some((negativeRole) =>
    user.roles.includes(negativeRole),
  );

  // Si el usuario tiene algún rol negativo, devolver false
  if (negativeRoles && hasNegativeRoles) {
    return false;
  }

  // verifica si el usuario tiene alguna membership con el id de la iglesia
  if (checkChurchId) {
    const hasMembership = user.memberships.some(
      (membership) => membership.church.id === checkChurchId,
    );
    if (!hasMembership) {
      return false;
    }
  }

  // Verificar si el usuario tiene alguno de los negativeChurchRoles en la iglesia
  const hasNegativeChurchRoles = negativeChurchRoles?.some((negativeRole) =>
    user.memberships
      .find((membership) => membership.church.id === checkChurchId)
      ?.roles.map((role) => role.churchRoleId)
      .includes(negativeRole),
  );

  // Si el usuario tiene algún rol negativo en la iglesia, devolver false
  if (negativeChurchRoles && hasNegativeChurchRoles) {
    return false;
  }

  const hasRequiredRole = roles?.some((role) => user.roles.includes(role));

  // Verificar si el usuario tiene alguno de los roles requeridos
  if (roles && !hasRequiredRole) {
    return false;
  }

  const hasChurchRole = churchRoles?.some((role) => {
    const membership = user.memberships.find(
      (membership) => membership.church.id === checkChurchId,
    );
    return membership?.roles.map((role) => role.churchRoleId).includes(role);
  });

  // Verificar si el usuario tiene alguno de los roles de iglesia requeridos
  if (churchRoles && !hasChurchRole) {
    return false;
  }

  // Verificar si el usuario tiene permisos de administrador en el evento
  if (checkAdminEvent && event && event?.eventManagerId !== user.id) {
    return false;
  }

  return true;
};
