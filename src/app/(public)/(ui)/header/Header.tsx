import { appName } from "@/global/config/constants";
import Link from "next/link";
import { ResponsiveNavBar } from "./ResponsiveNavBar";

export const Header = () => {
  return (
    <div className="fixed h-[5rem] md:bg-opacity-40 md:backdrop-blur-md w-screen bg-blanco flex justify-between items-center sm:px-20 px-5">
      <Link href={"/"}>
        <h1 className="uppercase font-agdasima font-bold text-3xl">
          {appName}
        </h1>
      </Link>
      <ResponsiveNavBar />
    </div>
  );
};
