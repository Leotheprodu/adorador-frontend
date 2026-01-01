import { appNameLogo } from '@global/config/constants';
import Link from 'next/link';
import { ResponsiveNavBar } from '@ui/header/components/ResponsiveNavBar';
import { NotificationBell } from '@ui/header/components/NotificationBell';
import { ThemeToggle } from '@global/components/ThemeToggle';

export const Header = () => {
  return (
    <header className="fixed z-40 flex h-[5rem] w-screen items-center justify-between border-b border-brand-purple-100/50 bg-white/80 px-5 shadow-lg backdrop-blur-md transition-all dark:border-brand-purple-800/50 dark:bg-gray-900/80 sm:px-20">
      <Link
        className="group flex items-center justify-center gap-1 transition-transform hover:scale-105"
        href={'/'}
      >
        <div className="flex items-center transition-all">
          <span className="font-majormonodisplay text-4xl font-bold tracking-tighter text-brand-purple-600 dark:text-brand-purple-400">
            {appNameLogo}
          </span>
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
