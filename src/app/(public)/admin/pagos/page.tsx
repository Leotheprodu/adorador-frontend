
import { Metadata } from 'next';
import { AdminPaymentsMain } from './_components/AdminPaymentsMain';



export const metadata: Metadata = {
  title: 'Admin - Administración de Pagos',
  description: 'Administración de Pagos - Zamr',
};

export default function AdminPaymentsPage() {


    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Aprobación de Pagos
                </h1>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-black">
               <AdminPaymentsMain /> 
            </div>
        </div>
    );
}
