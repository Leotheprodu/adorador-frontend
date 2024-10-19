import { PaypalDonationButton } from "./components/PaypalDonationButton";
import { MoreDonationButton } from "./components/MoreDonationButton";
import { links } from "@/global/config/links";
import { FooterLinks } from "./components/FooterLinks";
import { WaveFooterSVG } from "./components/svg/WaveFooterSVG";
import ScrollToTopButton from "./components/ScrollToTopButton";
import { appName } from "@/global/config/constants";

export const Footer = () => {
  return (
    <footer className="bg-negro text-blanco h-full flex flex-col">
      <div className="relative grid grid-cols-[1fr] md:grid-cols-[1fr_1fr_1fr_1fr] p-4 bg-negro text-blanco">
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
        <div className="flex flex-col md:col-start-4 md:col-span-1 p-2 justify-center items-center gap-5">
          <h2 className="text-bold uppercase  mb-3 text-lg text-slate-500">
            {" "}
            Donaciones
          </h2>
          <PaypalDonationButton />
          <MoreDonationButton />
        </div>
      </div>
      <div className="flex justify-center items-center p-2 text-xs text-center text-slate-400 bg-slate-900">
        <p>
          © {new Date().getFullYear()}{" "}
          <span className="uppercase font-agdasima font-bold">{appName}</span>{" "}
          <span className="mx-1">|</span> Hecho por{" "}
          <a
            href="https://leoserranodev.vercel.app/es/"
            target="_blank"
            rel="noopener noreferrer"
            className="border-b-1 hover:border-b-2 border-slate-400 hover:text-slate-100 transition-all duration-200"
          >
            Leonardo Serrano
          </a>{" "}
          con ❤️ para la comunidad cristiana.
        </p>
      </div>
    </footer>
  );
};
