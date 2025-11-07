import React from 'react';

export interface AppSecurityProps {
  isLoggedIn?: boolean;
  roles?: number[];
  negativeRoles?: number[];
  checkChurchId?: number;
  churchRoles?: number[];
  negativeChurchRoles?: number[];
  checkAdminEvent?: boolean;
  checkBandId?: number;
  checkBandAdmin?: boolean;
}

export interface UiGuardProps extends AppSecurityProps {
  children: React.ReactNode;
  isLoading?: boolean;
}

export interface LinksProps extends AppSecurityProps {
  name: string;
  href: string;
}
