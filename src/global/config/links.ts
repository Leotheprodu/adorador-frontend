import { LinksProps } from '../interfaces/AppSecurityInterfaces';
/* import { userRoles } from './constants'; */
export const links: LinksProps[] = [
  {
    name: 'Crear cuenta',
    href: '/auth/sign-up',
    isLoggedIn: false,
  },
  {
    name: 'Login',
    href: '/auth/login',
  },
];
