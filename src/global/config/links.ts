import { LinksProps } from '../interfaces/AppSecurityInterfaces';
/* import { userRoles } from './constants'; */

export const mainNavLinks: LinksProps[] = [
  { name: 'Grupos', href: '/grupos' },
  { name: 'Feed Social', href: '/feed', isLoggedIn: true },
  { name: 'Discipulado', href: '/discipulado' },
  { name: 'Precios', href: '/precios' },
];

export const userMenuLinks: LinksProps[] = [
  {
    name: 'Canciones Guardadas',
    href: '/saved-songs',
    isLoggedIn: true,
  },
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

export const links: LinksProps[] = [...mainNavLinks, ...userMenuLinks];
