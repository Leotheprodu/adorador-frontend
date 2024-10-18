"use client";
import { LinksProps } from "@/global/config/links";
import { CheckUserStatus } from "@/global/utils/checkUserStatus";

import Link from "next/link";

export const NavbarLinks = ({
  pathName,
  links,
}: {
  pathName: string;
  links: LinksProps[];
}) => {
  return (
    <>
      {links.map(({ name, href, isLoggedIn, roles, negativeRoles }) =>
        CheckUserStatus({ isLoggedIn, roles, negativeRoles }) ? (
          <li key={name}>
            <Link
              href={href}
              className={`text-primario md:text-secundario linkNav relative ${
                pathName.includes(href) &&
                "border-l-2 border-secundario dark:border-primario md:border-primario md:dark:border-secundario"
              }`}
            >
              {name}
              {!pathName.includes(href) && (
                <span className="absolute bottom-5 opacity-0 left-0 w-0 h-0 border-t-2 border-secundario dark:border-primario md:border-primario md:dark:border-secundario transition-all duration-100" />
              )}
            </Link>
          </li>
        ) : null
      )}
    </>
  );
};