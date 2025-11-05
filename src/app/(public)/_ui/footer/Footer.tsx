import { PaypalDonationButton } from '@ui/footer/components/PaypalDonationButton';
import { MoreDonationButton } from '@ui/footer/components/MoreDonationButton';
import { links } from '@global/config/links';
import { WaveFooterSVG } from '@ui/footer/components/svg/WaveFooterSVG';
import ScrollToTopButton from '@ui/footer/components/ScrollToTopButton';
import { NavbarLinks } from '../header/components/NavbarLinks';

export const Footer = () => {
  return (
    <footer className="via-brand-purple-950 relative mt-40 flex h-full flex-col overflow-hidden bg-gradient-to-br from-gray-900 to-gray-900">
      <section className="relative grid grid-cols-[1fr] px-6 py-12 text-white md:grid-cols-[1fr_1fr_1fr_1fr] md:px-8 lg:px-12">
        <ScrollToTopButton />
        <WaveFooterSVG className="absolute bottom-[98%] -z-10 w-full text-gray-900" />

        {/* Elementos decorativos con glow effect */}
        <div className="bg-brand-purple-600/20 pointer-events-none absolute -left-20 top-1/4 h-64 w-64 animate-pulse rounded-full blur-3xl"></div>
        <div className="bg-brand-blue-600/20 pointer-events-none absolute -right-20 bottom-1/4 h-64 w-64 animate-pulse rounded-full blur-3xl"></div>

        <ul className="hidden flex-col items-center gap-3 p-4 md:flex">
          <h2 className="text-gradient-simple mb-4 text-xl font-bold uppercase">
            Enlaces
          </h2>
          <NavbarLinks backgroundColor="oscuro" links={links} />
        </ul>
        <div className="border-brand-purple-800/30 flex flex-col gap-4 p-4 text-base text-gray-300 md:col-span-2 md:col-start-2 md:border-x-1 md:px-10 lg:px-16">
          <p className="leading-relaxed">
            <span className="text-gradient-primary font-bold">
              Salmos 95:1-2
            </span>
            ; &quot;Venid, aclamemos alegremente a Jehová; cantemos con júbilo a
            la roca de nuestra salvación. Lleguemos ante su presencia con
            alabanza; aclamémosle con cánticos.&quot;
          </p>
        </div>
        <div className="flex flex-col items-center justify-center gap-5 p-4 md:col-span-1 md:col-start-4">
          <h2 className="text-gradient-simple mb-4 text-xl font-bold uppercase">
            Donaciones
          </h2>
          <div className="flex flex-col gap-4">
            <PaypalDonationButton />
            <MoreDonationButton />
          </div>
        </div>
      </section>
    </footer>
  );
};
