import { PrimaryButton } from '@global/components/buttons';
import { appName } from '@global/config/constants';

export const HowItWorksSection = () => {
  const steps = [
    {
      number: '01',
      title: 'Crea tu grupo',
      description:
        'Registra tu grupo de alabanza e invita a los miembros de tu equipo en segundos.',
      color: 'from-brand-purple-500 to-brand-purple-600',
    },
    {
      number: '02',
      title: 'Organiza tu repertorio',
      description:
        'Agrega canciones con acordes y letras. Personaliza tonalidades para cada evento.',
      color: 'from-brand-pink-500 to-brand-pink-600',
    },
    {
      number: '03',
      title: 'Dirige en tiempo real',
      description:
        'Proyecta letras para la congregación mientras tu equipo ve acordes en sus dispositivos.',
      color: 'from-brand-blue-500 to-brand-blue-600',
    },
  ];

  return (
    <section className="bg-gradient-gray px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl md:text-5xl">
            Tan fácil como <span className="text-gradient-simple">1, 2, 3</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Comienza a usar ${appName} en minutos, sin complicaciones técnicas
          </p>
        </div>

        {/* Steps */}
        <div className="grid gap-8 md:grid-cols-3">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connector Line (hidden on mobile) */}
              {index < steps.length - 1 && (
                <div className="absolute left-1/2 top-12 hidden h-0.5 w-full bg-gradient-connector md:block"></div>
              )}

              {/* Card */}
              <div className="relative rounded-2xl bg-white p-8 shadow-lg transition-all hover:shadow-xl">
                {/* Number Badge */}
                <div
                  className={`mb-6 inline-flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br ${step.color} text-2xl font-bold text-white shadow-lg`}
                >
                  {step.number}
                </div>

                {/* Title */}
                <h3 className="mb-3 text-2xl font-bold text-gray-900">
                  {step.title}
                </h3>

                {/* Description */}
                <p className="text-gray-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="mt-12 text-center">
          <PrimaryButton
            href="/auth/login"
            endContent={<span className="text-2xl">→</span>}
          >
            Empezar ahora
          </PrimaryButton>
        </div>
      </div>
    </section>
  );
};
