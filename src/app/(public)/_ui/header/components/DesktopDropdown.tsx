'use client';

import React, { useRef, useState, useEffect } from 'react';
import Link from 'next/link';
import { useStore } from '@nanostores/react';
import { $user } from '@global/stores/users';
import { $event } from '@stores/event';
import { checkUserStatusPure } from '@global/utils/checkUserStatus';
import { LinksProps } from '@global/interfaces/AppSecurityInterfaces';

export const DesktopDropdown = ({ links }: { links: LinksProps[] }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const user = useStore($user);
  const event = useStore($event);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const visibleLinks = React.useMemo(() => {
    if (!mounted) return [];
    return links.filter((link) =>
      checkUserStatusPure(user, event, {
        isLoggedIn: link.isLoggedIn,
        roles: link.roles,
        negativeRoles: link.negativeRoles,
        churchRoles: link.churchRoles,
        checkChurchId: link.checkChurchId,
        negativeChurchRoles: link.negativeChurchRoles,
      }),
    );
  }, [links, mounted, user, event]);

  if (!mounted) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-full border border-brand-purple-200 bg-white p-2 text-brand-purple-600 shadow-sm transition-all hover:bg-violet-50 hover:shadow-md active:scale-95 dark:border-brand-purple-800 dark:bg-gray-900 dark:text-brand-purple-300 dark:hover:bg-brand-purple-900/50"
      >
        <span className="sr-only">Menu Usuario</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      </button>

      {/* Dropdown */}
      <div
        className={`absolute right-0 top-full mt-2 w-56 transform rounded-xl border border-brand-purple-100 bg-white/95 p-2 shadow-xl backdrop-blur-xl transition-all duration-200 dark:border-brand-purple-800 dark:bg-gray-900/95 ${
          isOpen
            ? 'visible translate-y-0 opacity-100'
            : 'invisible -translate-y-2 opacity-0'
        }`}
      >
        <ul className="flex flex-col gap-1">
          {user.isLoggedIn && (
            <div className="px-3 py-2 text-xs font-semibold uppercase text-gray-400 dark:text-gray-500">
              Mi Cuenta
            </div>
          )}
          {visibleLinks.map((link) => (
            <li key={link.name}>
              <Link
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="flex items-center rounded-lg px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-violet-50 hover:text-brand-purple-700 dark:text-gray-200 dark:hover:bg-brand-purple-800/50 dark:hover:text-brand-purple-300"
              >
                {link.name === 'Login'
                  ? user.isLoggedIn
                    ? 'Cerrar sesión'
                    : 'Iniciar sesión'
                  : link.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
