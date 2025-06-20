import { Metadata } from 'next';
import { NewPosts } from './_components/NewPosts';
import { BandsShowCase } from './_components/BandsShowCase';

export const metadata: Metadata = {
  title: 'Inicio',
};
export default function Home() {
  return (
    <div className="mx-2 flex h-full flex-col items-center p-8 pb-20 sm:p-20 md:mx-10 lg:mx-40">
      <section className="mb-8 flex w-full flex-col items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-4 text-center shadow-lg sm:mb-12 sm:p-8 md:p-10">
        <h1 className="mb-3 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 bg-clip-text text-3xl font-extrabold text-transparent sm:mb-4 sm:text-4xl md:text-5xl">
          Bienvenido a Adorador
        </h1>
        <p className="mb-4 max-w-xl text-base text-gray-700 sm:mb-6 sm:text-lg">
          Una web con recursos inspiradores para grupos de alabanza e iglesias.
        </p>
        <ul className="mx-auto mb-4 max-w-2xl list-disc space-y-3 p-2 text-left text-sm text-gray-800 sm:mb-6 sm:text-base">
          <li>
            <span className="font-semibold text-purple-700">
              Herramienta para tocar en vivo:
            </span>{' '}
            Visualiza acordes y letra en tiempo real, y transmite la letra al
            proyector para la congregación.
          </li>
          <li>
            <span className="font-semibold text-purple-700">
              Base de datos de canciones:
            </span>{' '}
            Guarda y organiza las canciones que utiliza tu grupo de alabanza,
            incluyendo los acordes personalizados de cada evento.
          </li>
          <li>
            <span className="font-semibold text-purple-700">
              Sección de discipulado:
            </span>{' '}
            Accede a recursos para el crecimiento espiritual y musical del
            cristiano adorador.
          </li>
        </ul>
      </section>
      <div className="flex w-full flex-col items-center lg:items-start">
        <NewPosts />
        <h1 className="my-12 text-3xl">Grupos de Alabanza:</h1>
        <BandsShowCase />
      </div>
    </div>
  );
}
