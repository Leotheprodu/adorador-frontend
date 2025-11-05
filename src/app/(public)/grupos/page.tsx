import { Metadata } from 'next';
import { BandsShowCase } from './_components/BandsShowCase';
import { GruposCTASection } from './_components/GruposCTASection';

export const metadata: Metadata = {
  title: 'Grupos de Alabanza - Adorador',
  description:
    'Explora los grupos de alabanza que usan Adorador para gestionar sus eventos y canciones.',
};

export default function GruposPage() {
  return (
    <div className="bg-gradient-gray min-h-screen px-4 py-16 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        {/* Header */}
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-bold text-gray-900 sm:text-5xl md:text-6xl">
            Grupos de <span className="text-gradient-simple">Alabanza</span>
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
