import { Metadata } from 'next';
import { ChurchesShowCase } from '@home/_components/ChurchesShowCase';
import { NewPosts } from './_components/NewPosts';

export const metadata: Metadata = {
  title: 'Inicio',
};
export default function Home() {
  return (
    <div className="mx-40 flex h-full flex-col p-8 pb-20 sm:p-20">
      <section className="mb-12 flex flex-col items-center justify-center rounded-xl bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 p-10 text-center shadow-lg">
        <h1 className="mb-4 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600 bg-clip-text text-5xl font-extrabold text-transparent">
          Bienvenido a Adorador
        </h1>
        <p className="mb-6 max-w-2xl text-lg text-gray-700">
          Una web con recursos inspiradores para grupos de alabanza e iglesias.
        </p>
        <ul className="mx-auto mb-6 max-w-2xl list-disc space-y-4 text-left text-base text-gray-800">
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
        {/* <a
          href="#recursos"
          className="rounded-full bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-3 text-lg font-semibold text-white shadow-md transition hover:scale-105 hover:from-pink-500 hover:to-purple-500"
        >
          Explora Recursos
        </a> */}
      </section>
      <NewPosts />
      <h1 className="my-12 text-3xl">Grupos de Alabanza:</h1>
      <ChurchesShowCase />
    </div>
  );
}
