'use client';
import Link from 'next/link';
import { LinksProps } from '@global/interfaces/AppSecurityInterfaces';
import { CheckUserStatus } from '@global/utils/checkUserStatus';
import { useStore } from '@nanostores/react';
import { $user } from '@global/stores/users';
import { usePathname } from 'next/navigation';

export const NavbarLinks = ({
  links,
  backgroundColor = 'light',
}: {
  links: LinksProps[];
  backgroundColor?: 'dark' | 'light';
}) => {
  const pathName = usePathname();
  const user = useStore($user);
  const colorsSettings = {
    dark: {
      text: 'text-white dark:text-gray-200',
      activeText: 'text-brand-pink-300 dark:text-brand-pink-400',
      activeBg: 'bg-brand-purple-600/20 dark:bg-brand-purple-700/30',
      activeBorder: 'border-brand-pink-400 dark:border-brand-pink-500',
      hover: 'hover:bg-brand-purple-700/30 dark:hover:bg-brand-purple-600/40',
    },
    light: {
      text: 'text-gray-700 dark:text-gray-300',
      activeText: 'text-brand-purple-600 dark:text-brand-purple-400',
      activeBg: 'bg-gradient-icon dark:bg-brand-purple-800/30',
      activeBorder: 'border-brand-purple-500 dark:border-brand-purple-400',
      hover: 'hover:bg-gradient-light dark:hover:bg-brand-purple-800/40',
    },
  };

  // Fallback: si backgroundColor no es válido, usar 'light'
  const settings = colorsSettings[backgroundColor] || colorsSettings['light'];

  return (
    <>
      {links.map(
        ({
          name,
          href,
          isLoggedIn,
          roles,
          negativeRoles,
          churchRoles,
          checkChurchId,
          negativeChurchRoles,
        }) =>
          CheckUserStatus({
            isLoggedIn,
            roles,
            negativeRoles,
            churchRoles,
            checkChurchId,
            negativeChurchRoles,
          }) ? (
            <li key={name}>
              <Link
                href={href}
                className={`linkNav group relative flex items-center gap-2 rounded-lg px-4 py-2 font-medium transition-all duration-300 ${
                  settings.text
                } ${settings.hover} ${
                  pathName.includes(href)
                    ? `${settings.activeText} ${settings.activeBg} shadow-sm`
                    : ''
                }`}
              >
                <span className="relative">
                  {name === 'Login'
                    ? user.isLoggedIn
                      ? 'Cerrar sesión'
                      : 'Iniciar sesión'
                    : name}
                  {pathName.includes(href) && (
                    <span
                      className={`absolute -bottom-1 left-0 h-0.5 w-full rounded-full ${settings.activeBorder} bg-gradient-primary`}
                    />
                  )}
                  {!pathName.includes(href) && (
                    <span
                      className={`absolute -bottom-1 left-0 h-0.5 w-0 rounded-full bg-gradient-primary opacity-0 transition-all duration-300 group-hover:w-full group-hover:opacity-100`}
                    />
                  )}
                </span>
              </Link>
            </li>
          ) : null,
      )}
    </>
  );
};
