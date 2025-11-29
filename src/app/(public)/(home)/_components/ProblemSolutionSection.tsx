import {
    ClockIcon,
    ComputerDesktopIcon,
    FolderMusicIcon,
    GuitarIcon,
    BrainIcon,
    PhoneIcon,
    DocumentEditIcon,
    UsersIcon,
    WrenchIcon,
    FaceSmileIcon,
} from '@global/icons';

export const ProblemSolutionSection = () => {
    const transformations = [
        {
            problem: 'Gastar horas preparando presentaciones manuales',
            solution: 'Modo proyector con fondos animados profesionales',
            problemIcon: <ClockIcon />,
            solutionIcon: <ComputerDesktopIcon />,
        },
        {
            problem: 'Semanas para implementar nuevas canciones',
            solution: 'Leer acordes en vivo mientras tocas',
            problemIcon: <FolderMusicIcon />,
            solutionIcon: <GuitarIcon />,
        },
        {
            problem: 'Memorizar 100% de las canciones para tocarlas',
            solution: 'Acordes para músicos, letras para congregación',
            problemIcon: <BrainIcon />,
            solutionIcon: <PhoneIcon />,
        },
        {
            problem: 'Preparar todo desde cero cada vez',
            solution: 'Biblioteca colaborativa de canciones',
            problemIcon: <DocumentEditIcon />,
            solutionIcon: <UsersIcon />,
        },
        {
            problem: 'Tecnología complicada y difícil de usar',
            solution: 'Tan fácil que hasta adultos mayores lo usan',
            problemIcon: <WrenchIcon />,
            solutionIcon: <FaceSmileIcon />,
        },
    ];

    return (
        <section className="bg-white px-4 py-16 transition-colors duration-300 dark:bg-brand-purple-950 sm:px-6 lg:px-8 lg:py-24">
            <div className="mx-auto max-w-7xl">
                {/* Section Header */}
                <div className="mb-16 text-center">
                    <h2 className="mb-4 text-3xl font-bold text-gray-900 transition-colors duration-300 dark:text-gray-100 sm:text-4xl md:text-5xl">
                        Resolvemos los{' '}
                        <span className="text-gradient-simple">problemas reales</span> de
                        músicos y líderes
                    </h2>
                    <p className="mx-auto max-w-2xl text-lg text-gray-600 transition-colors duration-300 dark:text-brand-purple-200">
                        Zamr transforma cada frustración en una solución elegante
                    </p>
                </div>

                {/* Transformation Cards */}
                <div className="grid gap-6 md:grid-cols-2 lg:gap-8">
                    {transformations.map((item, index) => (
                        <div
                            key={index}
                            className="group relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition-all duration-300 hover:shadow-lg dark:border-brand-purple-800 dark:bg-brand-purple-900"
                        >
                            {/* Card Content */}
                            <div className="grid grid-cols-1 divide-y divide-gray-200 dark:divide-brand-purple-800 md:grid-cols-2 md:divide-x md:divide-y-0">
                                {/* Problem Side */}
                                <div className="p-6">
                                    <div className="mb-3 flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-lg text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                                            {item.problemIcon}
                                        </div>
                                        <span className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400">
                                            El Problema
                                        </span>
                                    </div>
                                    <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                                        {item.problem}
                                    </p>
                                </div>

                                {/* Solution Side */}
                                <div className="bg-gradient-to-br from-brand-purple-50 to-white p-6 dark:from-brand-purple-900/30 dark:to-brand-purple-900/10">
                                    <div className="mb-3 flex items-center gap-3">
                                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-purple-500 text-lg text-white shadow-sm">
                                            {item.solutionIcon}
                                        </div>
                                        <span className="text-xs font-bold uppercase tracking-wider text-brand-purple-600 dark:text-brand-purple-300">
                                            La Solución
                                        </span>
                                    </div>
                                    <p className="text-sm font-semibold leading-relaxed text-gray-900 dark:text-gray-100">
                                        {item.solution}
                                    </p>
                                </div>
                            </div>

                            {/* Hover Effect Border */}
                            <div className="absolute inset-0 rounded-2xl ring-2 ring-brand-purple-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                        </div>
                    ))}
                </div>

                {/* Zamr Name Explanation */}
                <div className="mt-16 rounded-2xl border-2 border-brand-purple-300 bg-gradient-to-br from-brand-purple-50 to-white p-8 text-center transition-colors duration-300 dark:border-brand-purple-700 dark:from-brand-purple-900 dark:to-brand-purple-950 md:p-12">
                    <div className="mx-auto max-w-3xl">
                        <h3 className="mb-4 text-2xl font-bold text-gray-900 dark:text-gray-100 sm:text-3xl">
                            ¿Por qué <span className="text-gradient-primary">Zamr</span>?
                        </h3>
                        <p className="mb-2 text-lg text-gray-700 dark:text-gray-300">
                            Del hebreo <span className="font-bold">Zamar</span> (זָמַר)
                        </p>
                        <p className="mb-4 text-xl font-semibold text-brand-purple-700 dark:text-brand-purple-300">
                            &quot;Alabar a Dios con instrumentos y voces&quot;
                        </p>
                        <p className="text-gray-600 dark:text-gray-400">
                            Exactamente lo que hacen los usuarios de nuestra aplicación:
                            adorar con excelencia usando tecnología moderna.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};
