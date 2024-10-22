'use client';
import Link from 'next/link';
import { LinksProps } from '@global/interfaces/AppSecurityInterfaces';
import { CheckUserStatus } from '@global/utils/checkUserStatus';
import { useStore } from '@nanostores/react';
import { $user } from '@global/stores/users';
import { usePathname } from 'next/navigation';

export const NavbarLinks = ({
  links,
  backgroundColor = 'claro',
}: {
  links: LinksProps[];
  backgroundColor?: 'oscuro' | 'claro';
}) => {
  const pathName = usePathname();
  const user = useStore($user);
  const colorsSettings = {
    oscuro:
      'text-primario md:text-secundario dark:text-secundario md:dark:text-primario border-primario md:border-secundario dark:border-secundario md:dark:border-primario',
    claro:
      'text-secundario md:text-primario dark:text-primario md:dark:text-secundario border-secundario md:border-primario dark:border-primario md:dark:border-secundario',
  };
  return (
    <>
      {links.map(({ name, href, isLoggedIn, roles, negativeRoles }) =>
        CheckUserStatus({ isLoggedIn, roles, negativeRoles }) ? (
          <li key={name}>
            <Link
              href={href}
              className={`linkNav relative ${colorsSettings[backgroundColor]} ${
                pathName.includes(href) && 'border-b-2'
              }`}
            >
              {name === 'Login'
                ? user.isLoggedIn
                  ? 'Cerrar sesión'
                  : 'Iniciar sesión'
                : name}
              {!pathName.includes(href) && (
                <span
                  className={`absolute bottom-5 left-0 h-0 w-0 border-t-2 opacity-0 transition-all duration-100 ${colorsSettings[backgroundColor]}`}
                />
              )}
            </Link>
          </li>
        ) : null,
      )}
    </>
  );
};
