import { appName } from '@global/config/constants';

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

  const testimonials = [
    {
      quote:
        'Zamr ha transformado completamente la manera en que organizamos nuestros eventos de alabanza. La proyección en tiempo real es increíble.',
      author: 'Carlos M.',
      role: 'Director de Alabanza',
      church: 'Iglesia Vida Nueva',
    },
    {
      quote:
        'Ya no perdemos tiempo buscando acordes o creando presentaciones. Todo está en un solo lugar y funciona perfectamente.',
      author: 'María G.',
      role: 'Líder de Alabanza',
      church: 'Centro Cristiano',
    },
    {
      quote:
        'La coordinación con el equipo es mucho más fácil ahora. Todos saben qué canciones tocaremos y en qué tonalidad.',
      author: 'David R.',
      role: 'Músico',
      church: 'Iglesia El Camino',
    },
  ];

  return (
    <section className="bg-white px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        {/* Stats */}
        <div className="mb-20 grid gap-8 text-center md:grid-cols-3">
          {stats.map((stat, index) => (
            <div key={index} className="rounded-2xl bg-gradient-light p-8">
              <div className="mb-2 text-5xl font-bold text-gradient-simple">
                {stat.number}
              </div>
              <div className="text-lg font-semibold text-gray-900">
                {stat.label}
              </div>
              <div className="text-sm text-gray-600">{stat.description}</div>
            </div>
          ))}
        </div>

        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl md:text-5xl">
            Grupos de alabanza que confían en{' '}
            <span className="text-gradient-simple">{appName}</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Descubre cómo otros grupos están mejorando su ministerio
          </p>
        </div>

        {/* Testimonials */}
        <div className="grid gap-8 md:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <div
              key={index}
              className="rounded-2xl border border-gray-200 bg-gradient-subtle p-8 shadow-lg transition-all hover:shadow-xl"
            >
              {/* Quote */}
              <div className="mb-6 text-4xl text-brand-purple-300">&ldquo;</div>
              <p className="mb-6 text-gray-700">{testimonial.quote}</p>

              {/* Author */}
              <div className="border-t border-gray-200 pt-6">
                <div className="font-semibold text-gray-900">
                  {testimonial.author}
                </div>
                <div className="text-sm text-gray-600">{testimonial.role}</div>
                <div className="text-sm text-brand-purple-600">
                  {testimonial.church}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
