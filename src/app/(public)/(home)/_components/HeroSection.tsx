import { PrimaryButton, SecondaryButton } from '@global/components/buttons';
import { MusicNoteIcon } from '@global/icons';

export const HeroSection = () => {
  return (
    <section className="relative overflow-hidden bg-gradient-hero px-4 py-20 transition-colors duration-300 dark:bg-gradient-dark-hero sm:px-6 lg:px-8 lg:py-28">
      <div className="relative mx-auto max-w-7xl">
        <div className="text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center rounded-full bg-brand-purple-100 px-4 py-2 text-sm font-medium text-brand-purple-700 transition-colors duration-300 dark:bg-brand-purple-900 dark:text-brand-purple-200">
            <MusicNoteIcon className="mr-2 h-5 w-5" />
            Gestión profesional para grupos de alabanza
          </div>

          {/* Main Headline */}
          <h1 className="mb-6 text-4xl font-bold tracking-tight text-gray-900 transition-colors duration-300 dark:text-gray-100 sm:text-5xl md:text-6xl lg:text-7xl">
            Lleva tus eventos de alabanza
            <span className="block pb-3 text-gradient-primary">
              al siguiente nivel
            </span>
          </h1>

          {/* Subheadline */}
          <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600 transition-colors duration-300 dark:text-brand-purple-200 sm:text-xl md:text-2xl">
            Gestiona canciones, coordina músicos y proyecta letras en tiempo
            real. Todo lo que tu grupo de alabanza necesita en una sola
            plataforma.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <PrimaryButton
              href="/auth/login"
              className="w-full dark:border-brand-purple-800 dark:bg-brand-purple-700 dark:hover:bg-brand-purple-800 sm:w-auto"
            >
              Empieza gratis ahora
            </PrimaryButton>
            <SecondaryButton
              href="/precios"
              className="w-full border-gray-300 bg-white text-gray-700 hover:border-gray-400 hover:bg-white hover:text-gray-700 hover:shadow-xl dark:border-brand-purple-800 dark:bg-brand-purple-900 dark:text-brand-purple-200 dark:hover:bg-brand-purple-800 dark:hover:text-white sm:w-auto"
            >
              Ver planes y precios
            </SecondaryButton>
          </div>

          {/* Social Proof */}
          <div className="mt-12 flex items-center justify-center gap-6 text-sm text-gray-600 transition-colors duration-300 dark:text-brand-purple-200">
            <div className="flex items-center gap-2">
              <span className="text-2xl">✓</span>
              <span>Gratis para empezar</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">✓</span>
              <span>Sin tarjeta de crédito</span>
            </div>
            <div className="hidden items-center gap-2 sm:flex">
              <span className="text-2xl">✓</span>
              <span>Configuración en minutos</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute -left-4 top-20 h-72 w-72 animate-pulse rounded-full bg-brand-purple-300 opacity-20 blur-3xl transition-colors duration-300 dark:bg-brand-purple-950"></div>
      <div className="absolute -right-4 bottom-20 h-72 w-72 animate-pulse rounded-full bg-brand-blue-300 opacity-20 blur-3xl transition-colors duration-300 dark:bg-brand-blue-900"></div>
    </section>
  );
};
