'use client';

import { UIGuard } from "@global/utils/UIGuard";
import { useAdminPayments } from "../../_hooks/useAdminPayments";
import { PendingPaymentsTable } from "./PendingPaymentsTable";
import { userRoles } from "@global/config/constants";

export const AdminPaymentsMain = () => {
        const { pendingPayments, isLoading } = useAdminPayments();
  return (
    <UIGuard roles={[userRoles.admin.id]} >
     <PendingPaymentsTable
        payments={pendingPayments || []}
        isLoading={isLoading}
    />
    </UIGuard>
  )
}
