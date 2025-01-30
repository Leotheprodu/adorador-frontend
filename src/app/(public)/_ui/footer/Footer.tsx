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
        <WaveFooterSVG className="absolute bottom-[98%] z-10 w-full text-negro" />
        <ul className="hidden flex-col items-center gap-2 p-2 md:flex">
          <h2 className="text-bold mb-3 text-lg uppercase text-slate-500">
            {' '}
            Enlaces
          </h2>
          <NavbarLinks backgroundColor="oscuro" links={links} />
        </ul>
        <div className="flex flex-col gap-4 border-slate-800 p-2 text-sm text-slate-400 md:col-span-2 md:col-start-2 md:border-x-1 md:px-10 lg:px-16">
          <p>
            <span className="font-bold">Salmos 95:1-2</span>; &quot;Venid,
            aclamemos alegremente a Jehová; cantemos con júbilo a la roca de
            nuestra salvación. Lleguemos ante su presencia con alabanza;
            aclamémosle con cánticos.&quot;
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
