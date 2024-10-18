export interface LinksProps {
  name: string;
  href: string;
  isLoggedIn: boolean;
  roles: number[];
  negativeRoles?: number[];
}
