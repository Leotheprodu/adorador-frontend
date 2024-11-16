import { PaypalDonationButton } from '@ui/footer/components/PaypalDonationButton';
import { MoreDonationButton } from '@ui/footer/components/MoreDonationButton';
import { links } from '@global/config/links';
import { WaveFooterSVG } from '@ui/footer/components/svg/WaveFooterSVG';
import ScrollToTopButton from '@ui/footer/components/ScrollToTopButton';
import { NavbarLinks } from '../header/components/NavbarLinks';

export const Footer = () => {
  return (
    <footer className="mt-40 flex h-full flex-col bg-negro text-blanco">
      <section className="relative grid grid-cols-[1fr] bg-negro p-4 text-blanco md:grid-cols-[1fr_1fr_1fr_1fr]">
        <ScrollToTopButton />
        <WaveFooterSVG className="absolute bottom-[98%] -z-10 w-full text-negro" />
        <ul className="hidden flex-col items-center gap-2 p-2 md:flex">
          <h2 className="text-bold mb-3 text-lg uppercase text-slate-500">
            {' '}
            Enlaces
          </h2>
          <NavbarLinks backgroundColor="oscuro" links={links} />
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
      </section>
    </footer>
  );
};
