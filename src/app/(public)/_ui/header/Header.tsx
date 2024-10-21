import { appName } from '@global/config/constants';
import Link from 'next/link';
import { ResponsiveNavBar } from '@ui/header/components/ResponsiveNavBar';

export const Header = () => {
  return (
    <header className="fixed z-40 flex h-[5rem] w-screen items-center justify-between bg-blanco px-5 sm:px-20 md:bg-opacity-40 md:backdrop-blur-md">
      <Link href={'/'}>
        <h1 className="font-agdasima text-3xl font-bold uppercase">
          {appName}
        </h1>
      </Link>
      <ResponsiveNavBar />
    </header>
  );
};
