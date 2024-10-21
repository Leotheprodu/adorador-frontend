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
  {
    name: 'Crear cuenta',
    href: '/auth/sign-up',
    isLoggedIn: false,
    roles: [],
    negativeRoles: [userRoles.User.id],
  },
  {
    name: 'Login',
    href: '/auth/login',
    isLoggedIn: false,
    roles: [],
  },
];
