import { Card, CardBody } from '@heroui/card';
import { Chip } from '@heroui/chip';
import { upcomingFeatures } from '../_content/pricingContent';

export const UpcomingFeaturesSection = () => {
  return (
    <section className="bg-white px-4 py-16 transition-colors duration-300 dark:bg-gray-950 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        {/* Section Header */}
        <div className="mb-12 text-center">
          <Chip color="secondary" variant="flat" className="mb-4">
            Roadmap
          </Chip>
          <h2 className="mb-4 text-3xl font-bold text-gray-900 transition-colors duration-300 dark:text-gray-100 sm:text-4xl">
            Próximamente en Zamr
          </h2>
          <p className="mx-auto max-w-2xl text-lg text-gray-600 transition-colors duration-300 dark:text-brand-purple-200">
            Estamos trabajando constantemente para mejorar tu experiencia
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {upcomingFeatures.map((feature, index) => (
            <Card
              key={index}
              className="border border-gray-200 transition-all duration-300 hover:border-brand-purple-300 hover:shadow-lg dark:border-brand-purple-800 dark:bg-brand-purple-900"
            >
              <CardBody className="p-6">
                {/* Status */}
                <div className="mb-4">
                  <Chip
                    size="sm"
                    variant="flat"
                    color="warning"
                    className="text-xs"
                  >
                    {feature.status}
                  </Chip>
                </div>

                {/* Title */}
                <h3 className="mb-2 text-lg font-bold text-gray-900 dark:text-gray-100">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {feature.description}
                </p>
              </CardBody>
            </Card>
          ))}
        </div>

        {/* Footer Note */}
        <div className="mt-12 text-center">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            ¿Tienes una sugerencia? Contáctanos y cuéntanos qué te gustaría ver
            en Zamr
          </p>
        </div>
      </div>
    </section>
  );
};
