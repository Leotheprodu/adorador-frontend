import { Metadata } from 'next';
import { AdminPaymentsMain } from './_components/AdminPaymentsMain';

export const metadata: Metadata = {
  title: 'Admin - Administración de Pagos',
  description: 'Administración de Pagos - Zamr',
};

export default function AdminPaymentsPage() {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 space-y-8 duration-700">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white lg:text-4xl">
          Aprobación de Pagos
        </h1>
        <p className="text-slate-600 dark:text-slate-400">
          Gestiona las suscripciones pendientes y verifica los comprobantes.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-slate-800 dark:bg-black">
        <AdminPaymentsMain />
      </div>
    </div>
  );
}
