import { EmptyStateProps } from '@global/interfaces/listComponentsInterfaces';

export const EmptyState = ({
    icon,
    title,
    description,
    actionButton,
}: EmptyStateProps) => {
    return (
        <div className="flex flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-brand-purple-50/50 to-brand-blue-50/50 py-16 dark:bg-gradient-to-br dark:from-black/80 dark:to-purple-950/80">
            <div className="mb-4 text-6xl opacity-50">{icon}</div>
            <h3 className="mb-2 text-lg font-semibold text-slate-700 dark:text-slate-100">
                {title}
            </h3>
            <p className="mb-4 text-sm text-slate-500 dark:text-slate-300">
                {description}
            </p>
            {actionButton}
        </div>
    );
};
