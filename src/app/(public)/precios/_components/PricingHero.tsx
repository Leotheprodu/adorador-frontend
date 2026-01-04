import { CheckIcon, MusicNoteIcon } from '@global/icons';
import {
  marketingMessages,
  zamrNameExplanation,
} from '../_content/pricingContent';

export const PricingHero = () => {
  const { hero } = marketingMessages;

  return (
    <section className="relative overflow-hidden bg-gradient-hero px-4 py-16 transition-colors duration-300 dark:bg-gradient-dark-hero sm:px-6 lg:px-8 lg:py-20">
      <div className="relative mx-auto max-w-4xl">
        <div className="text-center">
          {/* Badge */}
          <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-success-100 px-4 py-2 text-sm font-semibold text-success-700 transition-colors duration-300 dark:bg-success-900 dark:text-success-200">
            <span className="text-lg">{hero.badge}</span>
          </div>

          {/* Main Title */}
          <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900 transition-colors duration-300 dark:text-gray-100 sm:text-5xl md:text-6xl">
            {hero.title}
          </h1>

          {/* Subtitle */}
          <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600 transition-colors duration-300 dark:text-brand-purple-200 sm:text-xl">
            {hero.subtitle}
          </p>

          {/* Social Proof */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm text-gray-600 transition-colors duration-300 dark:text-brand-purple-200 sm:gap-6">
            <div className="flex items-center gap-2">
              <span className="text-xl text-success-600 dark:text-success-400">
                <CheckIcon className="h-6 w-6 text-success-600 dark:text-success-400" />
              </span>
              <span>15 días gratis</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl text-success-600 dark:text-success-400">
                <CheckIcon className="h-6 w-6 text-success-600 dark:text-success-400" />
              </span>
              <span>Sin tarjeta de crédito</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xl text-success-600 dark:text-success-400">
                <CheckIcon className="h-6 w-6 text-success-600 dark:text-success-400" />
              </span>
              <span>Úsalo en eventos reales</span>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative elements */}
      <div className="absolute -left-4 top-20 h-64 w-64 animate-pulse rounded-full bg-brand-purple-300 opacity-20 blur-3xl transition-colors duration-300 dark:bg-brand-purple-950"></div>
      <div className="absolute -right-4 bottom-20 h-64 w-64 animate-pulse rounded-full bg-brand-blue-300 opacity-20 blur-3xl transition-colors duration-300 dark:bg-brand-blue-900"></div>
    </section>
  );
};
