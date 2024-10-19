import { PaypalDonationButton } from './components/PaypalDonationButton';
import { MoreDonationButton } from './components/MoreDonationButton';
import { links } from '@/global/config/links';
import { FooterLinks } from './components/FooterLinks';
import { WaveFooterSVG } from './components/svg/WaveFooterSVG';
import ScrollToTopButton from './components/ScrollToTopButton';
import { appName } from '@/global/config/constants';

export const Footer = () => {
  return (
    <footer className="mt-40 flex h-full flex-col bg-negro text-blanco">
      <div className="relative grid grid-cols-[1fr] bg-negro p-4 text-blanco md:grid-cols-[1fr_1fr_1fr_1fr]">
        <ScrollToTopButton />
        <WaveFooterSVG className="absolute bottom-[98%] text-negro" />

        <ul className="hidden flex-col items-center gap-2 p-2 md:flex">
          <h2 className="text-bold mb-3 text-lg uppercase text-slate-500">
            {' '}
            Enlaces
          </h2>
          <FooterLinks links={links} />
        </ul>
        <div className="flex flex-col gap-4 border-slate-800 p-2 text-sm text-slate-400 md:col-span-2 md:col-start-2 md:border-x-1 md:px-10 lg:px-16">
          <p>
            Hola, soy Leo. ¡Qué bendición es poder crear herramientas para la
            comunidad cristiana! Si lo que hemos hecho ha sido de ayuda para ti
            y deseas apoyarnos con una donación, sería una gran bendición. Con
            tu contribución, podremos seguir manteniendo y mejorando este
            proyecto para continuar sirviendo a la comunidad.
          </p>
          <p>
            <span className="font-bold">2 Corintios 9:7</span>; &quot;Cada uno
            dé como propuso en su corazón: no con tristeza, ni por necesidad,
            porque Dios ama al dador alegre.&quot;
          </p>
        </div>
        <div className="flex flex-col items-center justify-center gap-5 p-2 md:col-span-1 md:col-start-4">
          <h2 className="text-bold mb-3 text-lg uppercase text-slate-500">
            {' '}
            Donaciones
          </h2>
          <PaypalDonationButton />
          <MoreDonationButton />
        </div>
      </div>
      <div className="flex items-center justify-center bg-slate-900 p-2 text-center text-xs text-slate-400">
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
      </div>
    </footer>
  );
};
