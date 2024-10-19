'use client';
import { useEffect, useState } from 'react';
import { MenuButtonIcon } from '@/global/icons/MenuButtonIcon';
import { LoginNavButton } from './LoginNavButton';
import { usePathname } from 'next/navigation';
import { NavbarLinks } from './NavbarLinks';
import { links } from '@/global/config/links';

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
        <div className="fixed inset-0 z-40 h-screen w-screen bg-white bg-opacity-70 backdrop-blur-sm md:hidden"></div>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Abrir menú"
        className="fixed right-5 z-50 flex items-center justify-center active:scale-85 md:hidden"
      >
        <MenuButtonIcon />
      </button>
      <nav className={`${isOpen ? 'flex' : 'hidden md:flex'} z-50`}>
        <ul className="fixed right-0 top-[5rem] z-50 flex h-screen w-1/2 flex-col gap-4 rounded-tl-xl bg-secundario p-5 md:visible md:relative md:top-auto md:h-full md:w-full md:flex-row md:bg-transparent md:p-0">
          <NavbarLinks pathName={pathName} links={links} />
          <LoginNavButton pathName={pathName} />
        </ul>
      </nav>
    </>
  );
};
