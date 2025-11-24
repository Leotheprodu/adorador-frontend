import { ReactNode } from 'react';

interface AuthCardProps {
    children: ReactNode;
}

export const AuthCard = ({ children }: AuthCardProps) => {
    return (
        <div className="w-full max-w-md">
            {/* Card principal con glassmorphism y soporte dark */}
            <div className="overflow-hidden rounded-3xl bg-white/80 shadow-2xl ring-1 ring-slate-200/50 backdrop-blur-sm transition-colors duration-300 dark:bg-brand-purple-900/90 dark:ring-brand-purple-800">
                {children}
            </div>
        </div>
    );
};
