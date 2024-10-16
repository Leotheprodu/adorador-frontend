import { appName } from "@/global/config/constants";
import Link from "next/link";

export const Header = () => {
  return (
    <div className="h-full w-full flex justify-between items-center sm:px-20 px-5">
      <Link href={"/"}>
        <h1 className="uppercase font-agdasima font-bold text-3xl">
          {appName}
        </h1>
      </Link>

      <nav>
        <ul className="flex space-x-5">
          <li>
            <Link href={"/auth/login"}>
              <p className="text-lg">Login</p>
            </Link>
          </li>
          <li>
            <Link href={"/auth/register"}>
              <p className="text-lg">Register</p>
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};
