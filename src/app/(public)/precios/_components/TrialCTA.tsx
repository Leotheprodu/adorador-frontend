import { Button } from '@nextui-org/button';
import { Card, CardBody } from '@nextui-org/card';
import Link from 'next/link';
import { marketingMessages, testimonials } from '../_content/pricingContent';

export const TrialCTA = () => {
    const { trialCTA } = marketingMessages;

    return (
        <section className="bg-gradient-hero px-4 py-16 transition-colors duration-300 dark:bg-gradient-dark-hero sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl">
                {/* Main CTA */}
                <div className="mb-12 text-center">
                    <h2 className="mb-4 text-3xl font-bold text-gray-900 transition-colors duration-300 dark:text-gray-100 sm:text-4xl md:text-5xl">
                        {trialCTA.title}
                    </h2>
                    <p className="mb-2 text-xl font-semibold text-brand-purple-700 dark:text-brand-purple-300">
                        {trialCTA.subtitle}
                    </p>
                    <p className="mx-auto mb-8 max-w-2xl text-lg text-gray-600 dark:text-brand-purple-200">
                        {trialCTA.description}
                    </p>

                    <Button
                        as={Link}
                        href="/auth/sign-up"
                        color="primary"
                        size="lg"
                        className="px-8 py-6 text-lg font-bold shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                    >
                        {trialCTA.buttonText}
                    </Button>

                    <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                        Sin tarjeta de crédito • Cancela cuando quieras
                    </p>
                </div>

                {/* Testimonials Grid */}
                <div className="grid gap-6 md:grid-cols-3">
                    {testimonials.map((testimonial, index) => (
                        <Card
                            key={index}
                            className="border border-brand-purple-200 bg-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl dark:border-brand-purple-800 dark:bg-brand-purple-900"
                        >
                            <CardBody className="flex flex-col justify-between p-6">
                                <div>
                                    {/* Quote Icon */}
                                    <div className="mb-2 text-3xl text-brand-purple-400">
                                        "
                                    </div>

                                    {/* Quote */}
                                    <blockquote className="mb-4 text-base italic text-gray-700 dark:text-gray-300">
                                        {testimonial.quote}
                                    </blockquote>
                                </div>

                                <div>
                                    {/* Author */}
                                    <div className="mb-4 border-l-4 border-brand-purple-500 pl-3">
                                        <p className="font-semibold text-gray-900 dark:text-gray-100">
                                            {testimonial.author}
                                        </p>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">
                                            {testimonial.role}
                                        </p>
                                    </div>

                                    {/* Highlight */}
                                    <div className="rounded-lg bg-brand-purple-50 p-3 dark:bg-brand-purple-800/50">
                                        <p className="text-center text-xs font-semibold text-brand-purple-700 dark:text-brand-purple-300">
                                            💡 {testimonial.highlight}
                                        </p>
                                    </div>
                                </div>
                            </CardBody>
                        </Card>
                    ))}
                </div>
            </div>
        </section>
    );
};
