import { GuitarIcon } from '@global/icons/GuitarIcon';
import { FullscreenIcon } from '@global/icons/FullScreenIcon';
import { ChurchIcon } from '@global/icons/ChurchIcon';

export const FeaturesSection = () => {
  const features = [
    {
      icon: <GuitarIcon className="h-8 w-8" />,
      title: 'Gestión de Repertorio',
      description:
        'Organiza tu biblioteca de canciones con acordes personalizados, tonalidades y arreglos específicos para cada evento.',
      benefits: [
        'Base de datos centralizada',
        'Acordes y letras siempre disponibles',
        'Historial de canciones por evento',
      ],
    },
    {
      icon: <FullscreenIcon className="h-8 w-8" />,
      title: 'Proyección en Tiempo Real',
      description:
        'Transmite letras al proyector mientras los músicos ven acordes en sus dispositivos. Sincronización perfecta para toda la congregación.',
      benefits: [
        'Letras profesionales para el público',
        'Acordes para músicos en simultáneo',
        'Control remoto desde cualquier dispositivo',
      ],
    },
    {
      icon: <ChurchIcon className="h-8 w-8" />,
      title: 'Coordinación de Equipo',
      description:
        'Mantén a todo tu grupo de alabanza conectado y organizado. Planifica eventos, comparte recursos y colabora eficientemente.',
      benefits: [
        'Gestión de miembros del grupo',
        'Planificación de eventos',
        'Comunicación centralizada',
      ],
    },
  ];

  return (
    <section className="bg-white px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="mb-16 text-center">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl md:text-5xl">
            Todo lo que necesitas para{' '}
            <span className="text-gradient-simple">adorar con excelencia</span>
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600">
            Herramientas profesionales diseñadas específicamente para grupos de
            alabanza modernos
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-8 md:grid-cols-3">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-gradient-subtle hover:border-brand-purple-300 group rounded-2xl border border-gray-200 p-8 transition-all hover:shadow-xl"
            >
              {/* Icon */}
              <div className="bg-gradient-icon text-brand-purple-600 mb-5 inline-flex rounded-xl p-4 transition-transform group-hover:scale-110">
                {feature.icon}
              </div>

              {/* Title */}
              <h3 className="mb-3 text-2xl font-bold text-gray-900">
                {feature.title}
              </h3>

              {/* Description */}
              <p className="mb-4 text-gray-600">{feature.description}</p>

              {/* Benefits List */}
              <ul className="space-y-2">
                {feature.benefits.map((benefit, idx) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <span className="text-brand-purple-500 mt-1">✓</span>
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
