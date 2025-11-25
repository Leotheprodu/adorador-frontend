import { BackwardIcon } from '@global/icons/BackwardIcon';
import { ListHeaderProps } from '@global/interfaces/listComponentsInterfaces';

export const ListHeader = ({
    title,
    subtitle,
    onBack,
    actionButton,
    gradientFrom,
    gradientTo,
}: ListHeaderProps) => {
    return (
        <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
                <button
                    onClick={onBack}
                    className="group flex items-center justify-center gap-2 rounded-xl bg-white/80 p-3 shadow-sm transition-all duration-200 hover:scale-105 hover:shadow-md active:scale-95 dark:border dark:border-purple-800 dark:bg-gray-900/80"
                    style={{
                        ['--hover-bg' as string]: `${gradientFrom}`,
                    }}
                >
                    <BackwardIcon />
                    <small className="hidden text-xs font-medium sm:group-hover:block">
                        Volver al grupo
                    </small>
                </button>
                <div>
                    <h1
                        className={`bg-gradient-to-r ${gradientFrom} ${gradientTo} bg-clip-text text-2xl font-bold text-transparent sm:text-3xl`}
                    >
                        {title}
                    </h1>
                    <p className="mt-1 text-sm text-slate-500 dark:text-slate-200">
                        {subtitle}
                    </p>
                </div>
            </div>
            <div className="hidden sm:block">{actionButton}</div>
        </div>
    );
};
