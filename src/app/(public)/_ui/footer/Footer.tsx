import { PaypalDonationButton } from "./components/PaypalDonationButton";
import { MoreDonationButton } from "./components/MoreDonationButton";

export const Footer = () => {
  return (
    <footer className="h-full bg-negro text-blanco grid grid-cols-[1fr_1fr] md:grid-cols-[1fr_1fr_1fr_1fr] p-4 pt-10">
      <div className="col-start-2 col-span-2 flex flex-col gap-4 text-sm text-slate-400 p-2">
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
      <div className="flex flex-col col-start-4 col-span-1 p-2 justify-center items-center gap-5">
        <PaypalDonationButton />
        <MoreDonationButton />
      </div>
    </footer>
  );
};
