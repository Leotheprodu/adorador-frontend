'use client';

import { useAdminPayments } from '../_hooks/useAdminPayments';
import { PendingPaymentsTable } from './_components/PendingPaymentsTable';

export default function AdminPaymentsPage() {
    const { pendingPayments, isLoading } = useAdminPayments();

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Aprobación de Pagos
                </h1>
            </div>

            <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-black">
                <PendingPaymentsTable
                    payments={pendingPayments || []}
                    isLoading={isLoading}
                />
            </div>
        </div>
    );
}
