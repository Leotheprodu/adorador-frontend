import { $user } from "@/global/stores/users";
import { useStore } from "@nanostores/react";
import Link from "next/link";

export const LoginNavButton = ({ pathName }: { pathName: string }) => {
  const user = useStore($user);
  const href = "/auth/login";
  return (
    <li>
      <Link
        href={href}
        className={`text-primario md:text-secundario linkNav relative ${
          pathName.includes(href) &&
          "border-b-2 border-secundario dark:border-primario md:border-primario md:dark:border-secundario"
        }`}
      >
        {user.isLoggedIn ? "Logout" : "Login"}
        {!pathName.includes(href) && (
          <span className="absolute bottom-5 left-0 w-0 h-0 opacity-0 border-t-2 border-secundario dark:border-primario md:border-primario md:dark:border-secundario transition-all duration-100" />
        )}
      </Link>
    </li>
  );
};
