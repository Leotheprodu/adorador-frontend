import { userRoles } from "./constants";

export interface LinksProps {
  name: string;
  href: string;
  isLoggedIn: boolean;
  roles: number[];
  negativeRoles?: number[];
}

export const links: LinksProps[] = [
  {
    name: "Contacto",
    href: "/contacto",
    isLoggedIn: false,
    roles: [],
    negativeRoles: [userRoles.Admin.id],
  },
];
