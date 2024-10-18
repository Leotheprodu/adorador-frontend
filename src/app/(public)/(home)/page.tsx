import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Inicio",
};
export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center p-8 pb-20 sm:p-20">
      Hola Adorador
    </div>
  );
}
