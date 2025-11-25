interface AuthHeaderProps {
    title: string;
    subtitle: string;
    emoji?: string;
}

export const AuthHeader = ({ title, subtitle, emoji = '🎵' }: AuthHeaderProps) => {
    return (
        <div className="relative overflow-hidden bg-gradient-to-br from-brand-purple-600 via-brand-pink-500 to-brand-blue-600 px-8 py-12 text-center transition-colors duration-300 dark:from-brand-purple-950 dark:via-brand-purple-900 dark:to-brand-blue-900">
            {/* Patrón decorativo */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute left-0 top-0 h-40 w-40 rounded-full bg-white blur-3xl dark:bg-brand-purple-900"></div>
                <div className="absolute bottom-0 right-0 h-40 w-40 rounded-full bg-white blur-3xl dark:bg-brand-purple-900"></div>
            </div>

            <div className="relative z-10">
                <div className="mb-4 text-5xl">{emoji}</div>
                <h1 className="text-3xl font-bold text-white dark:text-white sm:text-4xl">
                    {title}
                </h1>
                <p className="mt-2 text-sm text-white/90 dark:text-brand-purple-200 sm:text-base">
                    {subtitle}
                </p>
            </div>
        </div>
    );
};
