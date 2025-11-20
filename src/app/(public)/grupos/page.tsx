import { Metadata } from 'next';
import { BandsShowCase } from './_components/BandsShowCase';
import { GruposCTASection } from './_components/GruposCTASection';

export const metadata: Metadata = {
  title: 'Grupos de Alabanza - Zamr',
  description:
    'Explora los grupos de alabanza que usan Zamr para gestionar sus eventos y canciones.',
};

export default function GruposPage() {
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-16 dark:bg-gray-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900 dark:text-gray-100 sm:text-5xl md:text-6xl">
            Grupos de <span className="text-gradient-simple">Alabanza </span>
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 sm:text-xl">
            Encuentra todos los grupos de alabanza en los que formas parte
          </p>
        </div>

        {/* Bands Showcase */}
        <div className="flex justify-center">
          <BandsShowCase />
        </div>

        {/* CTA Section - Condicional según estado de login */}
        <GruposCTASection />
      </div>
    </div>
  );
}
