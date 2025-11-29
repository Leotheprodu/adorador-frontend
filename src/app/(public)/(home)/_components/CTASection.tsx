import { WhiteButton, SecondaryButton } from '@global/components/buttons';

export const CTASection = () => {
  return (
    <section className="bg-gradient-cta px-4 py-16 transition-colors duration-300 dark:bg-gradient-dark-hero sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-4xl text-center">
        {/* Main Headline */}
        <h2 className="mb-6 text-3xl font-bold text-white transition-colors duration-300 sm:text-4xl md:text-5xl lg:text-6xl">
          ¿Listo para transformar tu ministerio de alabanza?
        </h2>

        {/* Subheadline */}
        <p className="mb-8 text-lg text-brand-purple-100 transition-colors duration-300 dark:text-brand-purple-200 sm:text-xl md:text-2xl">
          Únete a grupos de alabanza que están llevando sus eventos al siguiente
          nivel con tecnología moderna y fácil de usar.
        </p>

        {/* CTA Button */}
        <div className="mb-8 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <WhiteButton href="/auth/login" className="w-full sm:w-auto">
            Crear mi cuenta gratis
          </WhiteButton>
          <SecondaryButton
            href="/precios"
            className="w-full border-white bg-transparent text-white hover:bg-white hover:text-brand-purple-600 sm:w-auto"
          >
            Ver planes y precios
          </SecondaryButton>
        </div>

        {/* Trust Indicators */}
        <div className="flex flex-col items-center justify-center gap-4 text-sm text-brand-purple-100 transition-colors duration-300 dark:text-brand-purple-200 sm:flex-row sm:gap-8">
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>Configuración en 5 minutos</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>Sin tarjeta de crédito</span>
          </div>
          <div className="flex items-center gap-2">
            <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span>Cancela cuando quieras</span>
          </div>
        </div>
      </div>
    </section>
  );
};
