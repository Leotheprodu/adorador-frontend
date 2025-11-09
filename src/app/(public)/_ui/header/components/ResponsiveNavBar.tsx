'use client';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { MenuButtonIcon } from '@global/icons/MenuButtonIcon';
import { NavbarLinks } from '@ui/header/components/NavbarLinks';
import { links } from '@global/config/links';

export const ResponsiveNavBar = () => {
  const pathName = usePathname();
  const [isOpen, setIsOpen] = useState(false);
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
          className="fixed inset-0 z-40 h-screen w-screen bg-brand-purple-950/30 backdrop-blur-sm transition-all duration-300 md:hidden"
        ></div>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label={isOpen ? 'Cerrar menú' : 'Abrir menú'}
        className={`relative z-50 flex items-center justify-center rounded-lg p-2 transition-all duration-300 active:scale-95 md:hidden ${
          isOpen
            ? 'bg-gradient-primary text-white shadow-lg'
            : 'bg-gradient-icon text-brand-purple-600 hover:bg-gradient-light hover:shadow-md'
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
          className={`fixed right-0 top-[5rem] z-50 flex h-screen w-64 flex-col gap-2 border-l border-brand-purple-200 bg-gradient-light p-6 shadow-2xl backdrop-blur-md transition-all duration-300 md:visible md:relative md:top-auto md:h-full md:w-full md:flex-row md:border-0 md:bg-transparent md:p-0 md:shadow-none ${
            isOpen
              ? 'translate-x-0 opacity-100'
              : 'translate-x-full opacity-0 md:translate-x-0 md:opacity-100'
          }`}
        >
          <NavbarLinks links={links} backgroundColor="claro" />
        </ul>
      </nav>
    </>
  );
};
