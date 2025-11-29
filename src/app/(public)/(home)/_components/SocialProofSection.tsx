import { appName } from '@global/config/constants';
import { testimonials } from '../../precios/_content/pricingContent';

export const SocialProofSection = () => {
  const stats = [
    {
      number: '500+',
      label: 'Canciones organizadas',
      description: 'en nuestra base de datos',
    },
    {
      number: '100+',
      label: 'Eventos realizados',
      description: 'con proyección en vivo',
    },
    {
      number: '24/7',
      label: 'Disponibilidad',
      description: 'acceso desde cualquier lugar',
    },
  ];

  return (
    <section className="bg-white px-4 py-16 transition-colors duration-300 dark:bg-brand-purple-950 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        {/* Stats */}
        <div className="mb-20 grid gap-8 text-center md:grid-cols-3">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="rounded-2xl bg-white p-8 transition-colors duration-300 dark:bg-brand-purple-900"
            >
              <div className="mb-2 text-5xl font-bold text-gradient-simple">
                {stat.number}
              </div>
              <div className="text-lg font-semibold text-gray-900 transition-colors duration-300 dark:text-brand-pink-200">
                {stat.label}
              </div>
              <div className="text-sm text-gray-600 transition-colors duration-300 dark:text-brand-purple-200">
                {stat.description}
              </div>
            </div>
          ))}
        </div>

        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 transition-colors duration-300 dark:text-gray-400 sm:text-4xl md:text-5xl">
            Grupos de alabanza que confían en{' '}
            <span className="text-gradient-simple">{appName}</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 transition-colors duration-300 dark:text-brand-purple-200">
            Descubre cómo otros grupos están mejorando su ministerio
          </p>
        </div>

        {/* Testimonials */}
        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="rounded-2xl border border-gray-200 bg-white p-8 shadow-lg transition-all duration-300 hover:shadow-xl dark:border-brand-purple-800 dark:bg-brand-purple-900"
            >
              {/* Quote */}
              <div className="mb-6 text-4xl text-brand-purple-300 dark:text-brand-purple-300">
                &ldquo;
              </div>
              <p className="mb-6 text-gray-700 transition-colors duration-300 dark:text-brand-purple-100">
                {testimonial.quote}
              </p>

              {/* Author */}
              <div className="border-t border-gray-200 pt-6 transition-colors duration-300 dark:border-brand-purple-800">
                <div className="font-semibold text-gray-900 transition-colors duration-300 dark:text-brand-pink-200">
                  {testimonial.author}
                </div>
                <div className="text-sm text-gray-600 transition-colors duration-300 dark:text-brand-purple-200">
                  {testimonial.role}
                </div>
                <div className="mt-4 rounded-lg bg-brand-purple-50 p-3 dark:bg-brand-purple-800/50">
                  <p className="text-center text-xs font-semibold text-brand-purple-700 dark:text-brand-purple-300">
                    💡 {testimonial.highlight}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
