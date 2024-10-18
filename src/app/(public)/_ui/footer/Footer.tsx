import { PaypalDonationButton } from "./components/PaypalDonationButton";
import { MoreDonationButton } from "./components/MoreDonationButton";
import { links } from "@/global/config/links";
import { FooterLinks } from "./components/FooterLinks";
import { WaveFooterSVG } from "./svg/WaveFooterSVG";
import ScrollToTopButton from "./components/ScrollToTopButton";

export const Footer = () => {
  return (
    <footer className="relative bg-negro text-blanco grid grid-cols-[1fr] md:grid-cols-[1fr_1fr_1fr_1fr] p-4 pt-10">
      <ScrollToTopButton />
      <WaveFooterSVG className="text-negro absolute bottom-[98%]" />

      <ul className="hidden md:flex flex-col items-center p-2 gap-2">
        <h2 className="text-bold uppercase  mb-3 text-lg text-slate-500">
          {" "}
          Enlaces
        </h2>
        <FooterLinks links={links} />
      </ul>
      <div className="md:col-start-2 md:col-span-2 flex flex-col gap-4 text-sm text-slate-400 md:border-x-1 border-slate-800 p-2 md:px-10 lg:px-16">
        <p>
          Hola, soy Leo. ¡Qué bendición es poder crear herramientas para la
          comunidad cristiana! Si lo que hemos hecho ha sido de ayuda para ti y
          deseas apoyarnos con una donación, sería una gran bendición. Con tu
          contribución, podremos seguir manteniendo y mejorando este proyecto
          para continuar sirviendo a la comunidad.
        </p>
        <p>
          Dice en <span className="font-bold">Proverbios 11:25</span>; &quot;El
          alma generosa será prosperada; y el que saciare, él también será
          saciado.&quot;
        </p>
      </div>
      <div className="flex flex-col md:col-start-4 md:col-span-1 p-2 justify-center items-center gap-5">
        <h2 className="text-bold uppercase  mb-3 text-lg text-slate-500">
          {" "}
          Donaciones
        </h2>
        <PaypalDonationButton />
        <MoreDonationButton />
      </div>
    </footer>
  );
};
