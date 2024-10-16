import React, { useEffect, useState } from "react";
import { CheckUserStatus } from "./checkUserStatus";
import { useStore } from "@nanostores/react";
import { Spinner } from "./Spinner";
import { $user } from "@stores/users";

export const UIGuard = ({
  children,
  isLoggedIn = false,
  roles = [],
  negativeRoles = [],
  isLoading = false,
}: {
  children: React.ReactNode;
  isLoggedIn: boolean;
  roles: number[];
  negativeRoles?: number[];
  isLoading?: boolean;
}) => {
  const user = useStore($user);
  const [pageLoading, setPageLoading] = useState(true);
  useEffect(() => {
    setPageLoading(isLoading);
  }, [isLoading]);

  return (
    <>
      <Spinner isLoading={pageLoading} />

      <>
        {CheckUserStatus({ isLoggedIn, roles, negativeRoles }) ? (
          children
        ) : (
          <div>
            {user.isLoggedIn ? "No tiene Permisos" : "Debe iniciar sesión"}
          </div>
        )}
      </>
    </>
  );
};
