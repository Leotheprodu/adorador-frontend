import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    useDisclosure,
} from "@heroui/react";
import { AdminPayment } from '../../_interfaces/adminPaymentInterface';
import { useApprovePayment, useRejectPayment } from '../../_hooks/useAdminPayments';
import { ApprovePaymentModal } from './ApprovePaymentModal';
import { RejectPaymentModal } from './RejectPaymentModal';
import { PaymentRowCell } from './PaymentRowCell';
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

    const [selectedPayment, setSelectedPayment] = useState<AdminPayment | null>(null);
    const { isOpen: isApproveOpen, onOpen: onApproveOpen, onOpenChange: onApproveOpenChange } = useDisclosure();
    const { isOpen: isRejectOpen, onOpen: onRejectOpen, onOpenChange: onRejectOpenChange } = useDisclosure();

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
        <>
            <Table aria-label="Tabla de pagos pendientes" selectionMode="none">
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
                    loadingContent={<div>Cargando pagos...</div>}
                    emptyContent={'No hay pagos pendientes'}
                >
                    {(item) => (
                        <TableRow key={item.id}>
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
        </>
    );
};


