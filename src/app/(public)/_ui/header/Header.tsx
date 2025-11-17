import { appName } from '@global/config/constants';
import Link from 'next/link';
import { ResponsiveNavBar } from '@ui/header/components/ResponsiveNavBar';
import { NotificationBell } from '@ui/header/components/NotificationBell';
import Image from 'next/image';
import { ThemeToggle } from '@global/components/ThemeToggle';

export const Header = () => {
  return (
    <header className="fixed z-40 flex h-[5rem] w-screen items-center justify-between border-b border-brand-purple-100/50 bg-white/80 px-5 shadow-lg backdrop-blur-md transition-all dark:border-brand-purple-800/50 dark:bg-gray-900/80 sm:px-20">
      <Link
        className="group flex items-center justify-center gap-2 transition-transform hover:scale-105"
        href={'/'}
      >
        <div className="rounded-xl p-1.5 transition-all group-hover:shadow-md">
          <Image
            width={100}
            height={100}
            src="/logo_zamr.webp"
            alt={appName}
            className="h-20 w-auto object-contain"
          />
        </div>
      </Link>
      <div className="flex items-center gap-3">
        <ThemeToggle />
        <NotificationBell />
        <ResponsiveNavBar />
      </div>
    </header>
  );
};
