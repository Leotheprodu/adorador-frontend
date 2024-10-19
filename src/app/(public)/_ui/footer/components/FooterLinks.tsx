'use client';
import { LinksProps } from '@/global/interfaces/AppSecurityInterfaces';
import { CheckUserStatus } from '@/global/utils/checkUserStatus';

import Link from 'next/link';

export const FooterLinks = ({ links }: { links: LinksProps[] }) => {
  return (
    <>
      {links.map(({ name, href, isLoggedIn, roles, negativeRoles }) =>
        CheckUserStatus({ isLoggedIn, roles, negativeRoles }) ? (
          <li key={name}>
            <Link href={href} className="linkNav relative text-primario">
              {name}

              <span className="absolute bottom-5 left-0 h-0 w-0 border-t-2 border-secundario opacity-0 transition-all duration-100 dark:border-primario" />
            </Link>
          </li>
        ) : null,
      )}
    </>
  );
};
