import { appName } from '@global/config/constants';

export const LastFooter = () => {
  return (
    <section className="flex items-center justify-center bg-slate-900 p-2 text-center text-xs text-slate-400">
      <p>
        © {new Date().getFullYear()}{' '}
        <span className="font-agdasima font-bold uppercase">{appName}</span>{' '}
        <span className="mx-1">|</span> Hecho por{' '}
        <a
          href="https://leoserranodev.vercel.app/es/"
          target="_blank"
          rel="noopener noreferrer"
          className="border-slate-400 transition-all duration-200 hover:border-b-1 hover:text-slate-100"
        >
          Leonardo Serrano
        </a>{' '}
        con ❤️ para la comunidad cristiana.
      </p>
    </section>
  );
};
