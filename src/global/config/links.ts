import { LinksProps } from '../interfaces/AppSecurityInterfaces';
import { userRoles } from '@global/config/constants';

export const mainNavLinks: LinksProps[] = [
  { name: 'Grupos', href: '/grupos' },
  { name: 'Feed Social', href: '/feed', isLoggedIn: true },
  { name: 'Discipulado', href: '/discipulado' },
  { name: 'Precios', href: '/precios' },
];

export const userMenuLinks: LinksProps[] = [
  {
    name: 'Admin',
    href: '/admin',
    isLoggedIn: true,
    roles: [userRoles.admin.id],
  },
  {
    name: 'Canciones Guardadas',
    href: '/canciones-guardadas',
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
