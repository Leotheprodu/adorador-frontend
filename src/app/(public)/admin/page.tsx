import { CreditCardIcon } from '@global/icons/CreditCardIcon';
import { Metadata } from 'next';

import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Admin - Panel de Administración',
  description: 'Panel de administración - Zamr',
};

export default function AdminPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white">
          Panel de Administración
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Bienvenido al panel de administración de Zamr
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Card de Pagos */}
        <Link
          href="/admin/pagos"
          className="group rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-black"
        >
          <div className="flex items-center gap-4">
            <div className="rounded-lg bg-brand-purple-100 p-3 dark:bg-brand-purple-900/30">
              <CreditCardIcon className="h-6 w-6 text-brand-purple-600 dark:text-brand-purple-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900 group-hover:text-brand-purple-600 dark:text-white dark:group-hover:text-brand-purple-400">
                Gestión de Pagos
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Aprobar y rechazar pagos
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
