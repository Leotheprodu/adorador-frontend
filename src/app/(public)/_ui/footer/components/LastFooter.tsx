import { appNameLogo } from '@global/config/constants';
import Link from 'next/link';

export const LastFooter = () => {
  return (
    <section className="flex items-center justify-center bg-slate-900 p-2 text-center text-xs text-slate-400 dark:bg-black dark:text-slate-500">
      <p>
        © {new Date().getFullYear()}{' '}
        <Link
          href="/"
          className="font-majormonodisplay font-bold text-brand-purple-600 transition-opacity hover:opacity-80 dark:text-brand-purple-400"
        >
          {appNameLogo}
        </Link>{' '}
        <span className="mx-1">|</span> Hecho por{' '}
        <a
          href="https://leoserranodev.vercel.app/es/"
          target="_blank"
          rel="noopener noreferrer"
          className="border-slate-400 transition-all duration-200 hover:border-b-1 hover:text-slate-100 dark:border-slate-500 dark:hover:text-slate-300"
        >
          Leonardo Serrano
        </a>{' '}
        con ❤️ para la comunidad cristiana.
      </p>
    </section>
  );
};
