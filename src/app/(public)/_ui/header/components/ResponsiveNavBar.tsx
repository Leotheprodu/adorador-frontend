'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { MenuButtonIcon } from '@global/icons/MenuButtonIcon';
import { NavbarLinks } from '@ui/header/components/NavbarLinks';
import { links } from '@global/config/links';
import { useStore } from '@nanostores/react';
import { $resolvedTheme } from '@stores/theme';

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
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 h-screen w-screen bg-brand-purple-950/30 backdrop-blur-sm transition-all duration-300 dark:bg-purple-950/75 md:hidden"
        ></div>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
        className={`relative z-50 flex items-center justify-center rounded-lg p-2 transition-all duration-300 active:scale-95 md:hidden ${
          isOpen
            ? 'bg-gradient-primary text-white shadow-lg dark:bg-brand-purple-700'
            : 'bg-violet-100 text-brand-purple-600 hover:bg-violet-50 hover:shadow-md dark:bg-brand-purple-900 dark:text-brand-purple-300 dark:hover:bg-brand-purple-800'
        }`}
      >
        <MenuButtonIcon
          className={`transition-transform duration-300 ${
            isOpen ? 'rotate-90' : 'rotate-0'
          }`}
        />
      </button>
      <nav className={`${isOpen ? 'flex' : 'hidden md:flex'} z-50`}>
        <ul
          className={`fixed right-0 top-[5rem] z-50 flex h-screen w-64 flex-col gap-2 border-l border-brand-purple-200 bg-violet-50 p-6 shadow-2xl transition-all duration-300 dark:bg-violet-950 md:visible md:relative md:top-auto md:h-full md:w-full md:flex-row md:border-0 md:p-0 md:shadow-none md:dark:bg-transparent ${
            isOpen
              ? 'translate-x-0 opacity-100'
              : 'translate-x-full opacity-0 md:translate-x-0 md:opacity-100'
          }`}
        >
          {hydrated && <NavbarLinks links={links} backgroundColor={theme} />}
        </ul>
      </nav>
    </>
  );
};
