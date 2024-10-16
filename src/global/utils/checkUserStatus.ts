import { useStore } from "@nanostores/react";
import { $user } from "@/global/stores/users";

export const CheckUserStatus = ({
  isLoggedIn = false,
  roles = [],
  negativeRoles = [],
}: {
  isLoggedIn: boolean;
  roles: number[];
  negativeRoles?: number[];
}): boolean => {
  const user = useStore($user);

  if (!user.isLoggedIn && !isLoggedIn) {
    return true;
  }
  if (!user.isLoggedIn && isLoggedIn) {
    return false;
  }
  // Verificar si el usuario tiene alguno de los negativeRoles
  const hasNegativeRoles = negativeRoles?.some((negativeRole) =>
    user.roles.includes(negativeRole)
  );

  // Si el usuario tiene algún rol negativo, devolver false
  if (negativeRoles && hasNegativeRoles) {
    return false;
  }

  // Verificar si el usuario cumple con los requisitos positivos
  return (
    !isLoggedIn ||
    (isLoggedIn && user.isLoggedIn && roles.length === 0) ||
    roles.some((role) => user.roles.includes(role))
  );
};
