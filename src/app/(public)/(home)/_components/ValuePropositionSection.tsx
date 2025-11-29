import {
    ClockIcon,
    RocketLaunchIcon,
    ComputerDesktopIcon,
    FaceSmileIcon,
    UsersIcon,
    PhoneIcon,
    PaintBrushIcon,
} from '@global/icons';

export const ValuePropositionSection = () => {
    const benefits = [
        {
            number: '5+',
            unit: 'horas',
            title: 'Ahorradas semanalmente',
            description:
                'Deja de perder tiempo en preparación manual. Zamr automatiza todo el proceso.',
            icon: <ClockIcon className="text-blue-500" />,
            color: 'from-blue-500 to-cyan-500',
        },
        {
            number: '3x',
            unit: 'más rápido',
            title: 'Implementación de canciones',
            description:
                'Agrega nuevas canciones al repertorio y tócalas en vivo el mismo día.',
            icon: <RocketLaunchIcon className="text-purple-500" />,
            color: 'from-purple-500 to-pink-500',
        },
        {
            number: '100%',
            unit: 'profesional',
            title: 'Modo proyector con fondos animados',
            description:
                'Letras hermosas para la congregación, acordes para los músicos. Todo sincronizado.',
            icon: <ComputerDesktopIcon className="text-emerald-500" />,
            color: 'from-green-500 to-emerald-500',
        },
        {
            number: '0',
            unit: 'complicaciones',
            title: 'Tan intuitivo que todos lo usan',
            description:
                'Desde jóvenes hasta adultos mayores. Si usas WhatsApp, puedes usar Zamr.',
            icon: <FaceSmileIcon className="text-orange-500" />,
            color: 'from-orange-500 to-red-500',
        },
    ];

    return (
        <section className="bg-gray-50 px-4 py-16 transition-colors duration-300 dark:bg-brand-purple-900 sm:px-6 lg:px-8 lg:py-24">
            <div className="mx-auto max-w-7xl">
                {/* Section Header */}
                <div className="mb-16 text-center">
                    <h2 className="mb-4 text-3xl font-bold text-gray-900 transition-colors duration-300 dark:text-gray-100 sm:text-4xl md:text-5xl">
                        Beneficios que{' '}
                        <span className="text-gradient-simple">transforman</span> tu
                        ministerio
                    </h2>
                    <p className="mx-auto max-w-2xl text-lg text-gray-600 transition-colors duration-300 dark:text-brand-purple-200">
                        Resultados medibles que verás desde el primer día
                    </p>
                </div>

                {/* Benefits Grid */}
                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                    {benefits.map((benefit, index) => (
                        <div
                            key={index}
                            className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white p-6 transition-all duration-300 hover:scale-105 hover:shadow-2xl dark:border-brand-purple-800 dark:bg-brand-purple-950"
                        >
                            {/* Gradient Background */}
                            <div
                                className={`absolute inset-0 bg-gradient-to-br ${benefit.color} opacity-0 transition-opacity duration-300 group-hover:opacity-10`}
                            ></div>

                            {/* Content */}
                            <div className="relative">
                                {/* Icon */}
                                <div className="mb-4 text-4xl">{benefit.icon}</div>

                                {/* Number */}
                                <div className="mb-2">
                                    <span className="text-4xl font-bold text-gray-900 dark:text-gray-100">
                                        {benefit.number}
                                    </span>
                                    <span className="ml-2 text-lg font-semibold text-gray-600 dark:text-gray-400">
                                        {benefit.unit}
                                    </span>
                                </div>

                                {/* Title */}
                                <h3 className="mb-3 text-lg font-bold text-gray-900 dark:text-gray-100">
                                    {benefit.title}
                                </h3>

                                {/* Description */}
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    {benefit.description}
                                </p>
                            </div>

                            {/* Decorative corner */}
                            <div
                                className={`absolute -right-8 -top-8 h-24 w-24 rounded-full bg-gradient-to-br ${benefit.color} opacity-20 blur-2xl transition-opacity duration-300 group-hover:opacity-30`}
                            ></div>
                        </div>
                    ))}
                </div>

                {/* Additional Features */}
                <div className="mt-16 grid gap-6 md:grid-cols-3">
                    <div className="rounded-xl border border-gray-200 bg-white p-6 text-center transition-all duration-300 hover:shadow-lg dark:border-brand-purple-800 dark:bg-brand-purple-950">
                        <div className="mb-3 flex justify-center text-3xl text-indigo-500">
                            <UsersIcon />
                        </div>
                        <h4 className="mb-2 font-bold text-gray-900 dark:text-gray-100">
                            Colaboración Real
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            Comparte canciones, bendice a otros, y ahorra tiempo preparando
                            juntos
                        </p>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-white p-6 text-center transition-all duration-300 hover:shadow-lg dark:border-brand-purple-800 dark:bg-brand-purple-950">
                        <div className="mb-3 flex justify-center text-3xl text-blue-500">
                            <PhoneIcon />
                        </div>
                        <h4 className="mb-2 font-bold text-gray-900 dark:text-gray-100">
                            Sincronización Perfecta
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            Acordes para músicos en sus dispositivos, letras para la
                            congregación en el proyector
                        </p>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-white p-6 text-center transition-all duration-300 hover:shadow-lg dark:border-brand-purple-800 dark:bg-brand-purple-950">
                        <div className="mb-3 flex justify-center text-3xl text-pink-500">
                            <PaintBrushIcon />
                        </div>
                        <h4 className="mb-2 font-bold text-gray-900 dark:text-gray-100">
                            Fondos Animados
                        </h4>
                        <p className="text-sm text-gray-600 dark:text-gray-300">
                            Hermosos fondos en video para mantener a la congregación enfocada
                            en la adoración
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};
