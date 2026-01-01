'use client';
import { createPortal } from 'react-dom';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { MenuButtonIcon } from '@global/icons/MenuButtonIcon';
import { NavbarLinks } from '@ui/header/components/NavbarLinks';
import { links, mainNavLinks, userMenuLinks } from '@global/config/links';
import { useStore } from '@nanostores/react';
import { $resolvedTheme } from '@stores/theme';
import { DesktopDropdown } from './DesktopDropdown';
import { appNameLogo } from '@global/config/constants';

export const ResponsiveNavBar = () => {
  const pathName = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const theme = useStore($resolvedTheme);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    setIsOpen(false);
  }, [pathName]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
  }, [isOpen]);

  return (
    <>
      {hydrated &&
        createPortal(
          <>
            {/* Mobile Menu Overlay */}
            <div
              onClick={() => setIsOpen(false)}
              className={`fixed inset-0 z-[60] bg-black/30 backdrop-blur-lg transition-all duration-300 md:hidden ${
                isOpen
                  ? 'pointer-events-auto visible opacity-100'
                  : 'pointer-events-none invisible opacity-0'
              }`}
            />

            {/* Mobile Navigation Sidebar */}
            <div
              className={`cubic-bezier(0.16, 1, 0.3, 1) fixed right-0 top-0 z-[70] h-[100dvh] w-[80%] max-w-[300px] transform bg-white/95 shadow-2xl backdrop-blur-2xl transition-transform duration-500 dark:bg-gray-950/95 md:hidden ${
                isOpen ? 'translate-x-0' : 'translate-x-full'
              }`}
            >
              <div className="flex h-full flex-col">
                <div className="flex items-center justify-between p-6 pb-2">
                  <span className="font-majormonodisplay text-2xl font-bold tracking-tighter text-brand-purple-600 dark:text-brand-purple-400">
                    {appNameLogo}
                  </span>
                  <button
                    onClick={() => setIsOpen(false)}
                    type="button"
                    className="rounded-full bg-violet-100/50 p-2 text-brand-purple-600 transition-colors hover:bg-violet-100 dark:bg-gray-800/50 dark:text-brand-purple-300 dark:hover:bg-gray-800"
                    aria-label="Cerrar menú"
                  >
                    <MenuButtonIcon className="h-6 w-6 rotate-180 scale-110" />
                  </button>
                </div>
                <div className="flex-1 overflow-y-auto px-6 py-2">
                  <ul className="flex flex-col space-y-2">
                    <NavbarLinks links={links} backgroundColor={theme} />
                  </ul>
                </div>
                <div className="border-t border-gray-200/50 p-6 dark:border-gray-800/50">
                  <p className="text-center text-xs text-gray-400">
                    © {new Date().getFullYear()} Zamr
                  </p>
                </div>
              </div>
            </div>
          </>,
          document.body,
        )}

      {/* Mobile Toggle Button (Header) */}
      {hydrated && (
        <div className="md:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            type="button"
            aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
            className={`relative z-50 flex items-center justify-center rounded-full p-2.5 transition-all duration-300 active:scale-95 ${
              isOpen
                ? 'bg-white text-brand-purple-600 shadow-lg dark:bg-brand-purple-900 dark:text-white'
                : 'bg-violet-100/50 text-brand-purple-600 backdrop-blur-sm hover:bg-violet-100 dark:bg-gray-800/50 dark:text-brand-purple-300 dark:hover:bg-gray-800'
            }`}
          >
            <MenuButtonIcon
              className={`h-6 w-6 transition-transform duration-500 ease-out ${
                isOpen ? 'rotate-180 scale-110' : 'rotate-0 scale-100'
              }`}
            />
          </button>
        </div>
      )}

      {/* Desktop Navigation */}
      <nav className="hidden items-center gap-4 md:flex">
        {/* Main Links */}
        <ul className="flex items-center gap-1">
          {hydrated && (
            <NavbarLinks links={mainNavLinks} backgroundColor={theme} />
          )}
        </ul>

        {/* User Dropdown */}
        <DesktopDropdown links={userMenuLinks} />
      </nav>
    </>
  );
};
