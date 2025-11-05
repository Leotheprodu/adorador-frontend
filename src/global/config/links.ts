import { LinksProps } from '../interfaces/AppSecurityInterfaces';
/* import { userRoles } from './constants'; */
export const links: LinksProps[] = [
  { name: 'Grupos', href: '/grupos' },
  { name: 'Discipulado', href: '/discipulado' },
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
