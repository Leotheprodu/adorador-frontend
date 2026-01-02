import { CreditCardIcon } from '@global/icons/CreditCardIcon';
import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Admin - Panel de Administración',
  description: 'Panel de administración - Zamr',
};

export default function AdminPage() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-8 duration-700">
      <div className="flex flex-col gap-2">
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
          Panel de Administración
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400">
          Bienvenido al panel centralizado de gestión para Zamr.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {/* Card de Pagos */}
        <Link
          href="/admin/pagos"
          className="group relative overflow-hidden rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-brand-purple-300 hover:shadow-xl dark:border-slate-800 dark:bg-black dark:hover:border-brand-purple-800"
        >
          <div className="absolute -right-4 -top-4 h-24 w-24 rounded-full bg-brand-purple-50/50 transition-transform duration-500 group-hover:scale-150 dark:bg-brand-purple-900/10" />

          <div className="relative flex items-center gap-5">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-purple-100 text-brand-purple-600 transition-colors duration-300 group-hover:bg-brand-purple-600 group-hover:text-white dark:bg-brand-purple-900/30 dark:text-brand-purple-400">
              <CreditCardIcon className="h-7 w-7" />
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-slate-900 transition-colors group-hover:text-brand-purple-600 dark:text-white dark:group-hover:text-brand-purple-400">
                Gestión de Pagos
              </h3>
              <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-400">
                Monitorea, aprueba o rechaza los pagos de suscripciones.
              </p>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-brand-purple-600 dark:text-brand-purple-400">
            <span>Ir a pagos</span>
            <svg
              className="h-4 w-4 transition-transform group-hover:translate-x-1"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </Link>

        {/* Placeholder para futuras secciones */}
        <div className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 p-6 text-center dark:border-slate-800">
          <p className="text-sm font-medium text-slate-400">
            Módulos adicionales en desarrollo
          </p>
        </div>
      </div>
    </div>
  );
}
