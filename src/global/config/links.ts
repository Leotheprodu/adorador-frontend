import { LinksProps } from '../interfaces/AppSecurityInterfaces';
import { userRoles } from './constants';
export const links: LinksProps[] = [
  {
    name: 'Contacto',
    href: '/contacto',
    isLoggedIn: false,
    roles: [],
    negativeRoles: [userRoles.Admin.id],
  },
];
