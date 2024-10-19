import React from 'react';

export interface AppSecurityProps {
  isLoggedIn: boolean;
  roles: number[];
  negativeRoles?: number[];
  isLoading?: boolean;
  checkChurch?: boolean;
  churchRoles?: number[];
  negativeChurchRoles?: number[];
}

export interface UiGuardProps extends AppSecurityProps {
  children: React.ReactNode;
}

export interface LinksProps extends AppSecurityProps {
  name: string;
  href: string;
}
