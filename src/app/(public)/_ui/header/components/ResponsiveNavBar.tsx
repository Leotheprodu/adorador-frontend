"use client";
import { useEffect, useState } from "react";
import { MenuButtonIcon } from "@/global/icons/MenuButtonIcon";
import { LoginNavButton } from "./LoginNavButton";
import { usePathname } from "next/navigation";
import { NavbarLinks } from "./NavbarLinks";
import { links } from "@/global/config/links";

export const ResponsiveNavBar = () => {
  const pathName = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    setIsOpen(false);
  }, [pathName]);

  return (
    <>
      {isOpen && (
        <div className="md:hidden fixed inset-0 h-screen w-screen bg-white bg-opacity-70 backdrop-blur-sm z-40"></div>
      )}
      <button
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Abrir menú"
        className="fixed active:scale-85 right-5 flex items-center justify-center md:hidden z-50"
      >
        <MenuButtonIcon />
      </button>
      <nav className={`${isOpen ? "flex" : "hidden md:flex"} z-50`}>
        <ul className="flex flex-col md:flex-row rounded-tl-xl fixed top-[5rem] md:top-auto right-0 h-screen md:h-full w-1/2 md:w-full p-5 md:p-0 bg-secundario md:bg-transparent md:visible md:relative gap-4 z-50">
          <NavbarLinks pathName={pathName} links={links} />
          <LoginNavButton pathName={pathName} />
        </ul>
      </nav>
    </>
  );
};
