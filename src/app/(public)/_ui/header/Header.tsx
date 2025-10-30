import { appName } from '@global/config/constants';
import Link from 'next/link';
import { ResponsiveNavBar } from '@ui/header/components/ResponsiveNavBar';
import Image from 'next/image';

export const Header = () => {
  return (
    <header className="fixed z-40 flex h-[5rem] w-screen items-center justify-between bg-blanco px-5 shadow-sm sm:px-20 md:bg-opacity-40 md:backdrop-blur-md">
      <Link className="flex items-center justify-center gap-2" href={'/'}>
        <Image
          width={100}
          height={100}
          src="/logo_adorador.avif"
          alt={appName}
          className="h-10 w-auto object-contain"
        />
        <h1 className="font-agdasima text-3xl font-bold uppercase text-secundario">
          {appName}
        </h1>
      </Link>
      <ResponsiveNavBar />
    </header>
  );
};
