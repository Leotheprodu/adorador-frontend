import { ReactNode } from 'react';

interface AuthCardProps {
  children: ReactNode;
}

export const AuthCard = ({ children }: AuthCardProps) => {
  return (
    <div className="w-full max-w-md">
      {/* Card principal con glassmorphism y soporte dark */}
      <div className="overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-slate-200/50 transition-colors duration-300 dark:bg-slate-900 dark:ring-slate-800">
        {children}
      </div>
    </div>
  );
};
