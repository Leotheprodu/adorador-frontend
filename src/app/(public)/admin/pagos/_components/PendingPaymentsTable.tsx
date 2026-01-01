import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  useDisclosure,
} from '@heroui/react';
import { AdminPayment } from '../../_interfaces/adminPaymentInterface';
import {
  useApprovePayment,
  useRejectPayment,
} from '../../_hooks/useAdminPayments';
import { ApprovePaymentModal } from './ApprovePaymentModal';
import { RejectPaymentModal } from './RejectPaymentModal';
import { PaymentRowCell } from './PaymentRowCell';
import { PaymentMobileCard } from './PaymentMobileCard';
import { useState } from 'react';

interface PendingPaymentsTableProps {
  payments: AdminPayment[];
  isLoading: boolean;
}

export const PendingPaymentsTable = ({
  payments,
  isLoading,
}: PendingPaymentsTableProps) => {
  const columns = [
    { name: 'USUARIO', uid: 'user' },
    { name: 'PLAN', uid: 'plan' },
    { name: 'MONTO', uid: 'amount' },
    { name: 'MÉTODO', uid: 'method' },
    { name: 'REFERENCIA', uid: 'reference' },
    { name: 'COMPROBANTE', uid: 'proof' },
    { name: 'ESTADO', uid: 'status' },
    { name: 'FECHA', uid: 'date' },
    { name: 'ACCIONES', uid: 'actions' },
  ];

  const [selectedPayment, setSelectedPayment] = useState<AdminPayment | null>(
    null,
  );
  const {
    isOpen: isApproveOpen,
    onOpen: onApproveOpen,
    onOpenChange: onApproveOpenChange,
  } = useDisclosure();
  const {
    isOpen: isRejectOpen,
    onOpen: onRejectOpen,
    onOpenChange: onRejectOpenChange,
  } = useDisclosure();

  const { handleApprove, isApproving } = useApprovePayment();
  const { handleReject, isRejecting } = useRejectPayment();

  const onApproveClick = (payment: AdminPayment) => {
    setSelectedPayment(payment);
    onApproveOpen();
  };

  const onRejectClick = (payment: AdminPayment) => {
    setSelectedPayment(payment);
    onRejectOpen();
  };

  const onConfirmApprove = () => {
    if (selectedPayment) {
      handleApprove(selectedPayment.id);
    }
  };

  const onConfirmReject = (reason: string) => {
    if (selectedPayment) {
      handleReject(selectedPayment.id, reason);
    }
  };

  return (
    <div className="w-full">
      {/* Mobile View: Cards */}
      <div className="flex flex-col gap-4 p-4 lg:hidden">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-10">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-brand-purple-600 border-t-transparent" />
            <p className="text-sm font-medium text-slate-500">
              Cargando pagos...
            </p>
          </div>
        ) : payments && payments.length > 0 ? (
          payments.map((payment) => (
            <PaymentMobileCard
              key={payment.id}
              payment={payment}
              onApprove={onApproveClick}
              onReject={onRejectClick}
            />
          ))
        ) : (
          <div className="rounded-2xl border-2 border-dashed border-slate-200 py-12 text-center dark:border-slate-800">
            <p className="text-slate-500">No hay pagos pendientes</p>
          </div>
        )}
      </div>

      {/* Desktop View: Table */}
      <div className="hidden overflow-x-auto lg:block">
        <Table
          aria-label="Tabla de pagos pendientes"
          selectionMode="none"
          removeWrapper
          classNames={{
            base: 'w-full',
            table: 'min-w-full',
            th: 'bg-slate-50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 font-semibold py-4 px-4 text-xs tracking-wider',
            td: 'py-4 px-4 border-b border-slate-100 dark:border-slate-800/50 hover:bg-slate-50/50 dark:hover:bg-slate-900/10 transition-colors',
          }}
        >
          <TableHeader columns={columns}>
            {(column) => (
              <TableColumn
                key={column.uid}
                align={column.uid === 'actions' ? 'center' : 'start'}
              >
                {column.name}
              </TableColumn>
            )}
          </TableHeader>
          <TableBody
            items={payments || []}
            isLoading={isLoading}
            loadingContent={
              <div className="flex flex-col items-center gap-2">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-purple-600 border-t-transparent" />
                <span className="text-sm text-slate-500">
                  Cargando pagos...
                </span>
              </div>
            }
            emptyContent={'No hay pagos pendientes'}
          >
            {(item) => (
              <TableRow key={item.id} className="transition-colors">
                {(columnKey) => (
                  <TableCell>
                    <PaymentRowCell
                      payment={item}
                      columnKey={columnKey}
                      onApprove={onApproveClick}
                      onReject={onRejectClick}
                    />
                  </TableCell>
                )}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <ApprovePaymentModal
        isOpen={isApproveOpen}
        onOpenChange={onApproveOpenChange}
        payment={selectedPayment}
        onConfirm={onConfirmApprove}
        isLoading={isApproving}
      />

      <RejectPaymentModal
        isOpen={isRejectOpen}
        onOpenChange={onRejectOpenChange}
        payment={selectedPayment}
        onConfirm={onConfirmReject}
        isLoading={isRejecting}
      />
    </div>
  );
};
