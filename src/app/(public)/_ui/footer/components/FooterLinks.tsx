'use client';
import { LinksProps } from '@global/interfaces/AppSecurityInterfaces';
import { NavbarLinks } from '../../header/components/NavbarLinks';

export const FooterLinks = ({ links }: { links: LinksProps[] }) => {
  return (
    <>
      <NavbarLinks backgroundColor="oscuro" links={links} />
    </>
  );
};
