import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    User,
    Button,
    Tooltip,
    Link,
    useDisclosure,
} from '@nextui-org/react';
import { AdminPayment } from '../../_interfaces/adminPaymentInterface';
import { PaymentStatusBadge } from './PaymentStatusBadge';
import { CheckIcon, XMarkIcon, EyeIcon } from '@global/icons';
import { useApprovePayment, useRejectPayment } from '../../_hooks/useAdminPayments';
import { ApprovePaymentModal } from './ApprovePaymentModal';
import { RejectPaymentModal } from './RejectPaymentModal';
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

const PaymentRowCell = ({
    payment,
    columnKey,
    onApprove,
    onReject,
}: {
    payment: AdminPayment;
    columnKey: React.Key;
    onApprove: (payment: AdminPayment) => void;
    onReject: (payment: AdminPayment) => void;
}) => {
    switch (columnKey) {
        case 'user':
            return payment.paidByUser ? (
                <User
                    name={payment.paidByUser.name}
                    description={payment.paidByUser.email}
                    avatarProps={{
                        radius: 'lg',
                        src: undefined,
                        name: payment.paidByUser.name.charAt(0).toUpperCase(),
                    }}
                />
            ) : (
                <span className="text-default-400">Sin usuario</span>
            );
        case 'plan':
            return (
                <div className="flex flex-col">
                    <p className="text-bold text-sm capitalize">{payment.plan.name}</p>
                    <p className="text-bold text-tiny capitalize text-default-400">
                        {payment.subscription.band.name}
                    </p>
                </div>
            );
        case 'amount':
            return (
                <div className="flex flex-col">
                    <p className="text-bold text-sm capitalize">
                        {payment.currency} {payment.amount}
                    </p>
                </div>
            );
        case 'method':
            return (
                <div className="flex flex-col">
                    <p className="text-bold text-sm capitalize">
                        {payment.method.replace('_', ' ')}
                    </p>
                </div>
            );
        case 'reference':
            return (
                <div className="flex flex-col">
                    <p className="text-bold text-sm">{payment.referenceNumber || '-'}</p>
                </div>
            );
        case 'proof':
            return payment.proofImageUrl ? (
                <Tooltip content="Ver comprobante">
                    <Link
                        href={payment.proofImageUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-lg text-default-400 active:opacity-50"
                    >
                        <EyeIcon />
                    </Link>
                </Tooltip>
            ) : (
                <span className="text-default-400">-</span>
            );
        case 'status':
            return <PaymentStatusBadge status={payment.status} />;
        case 'date':
            return (
                <div className="flex flex-col">
                    <p className="text-bold text-sm">
                        {new Date(payment.createdAt).toLocaleDateString()}
                    </p>
                    <p className="text-tiny text-default-400">
                        {new Date(payment.createdAt).toLocaleTimeString()}
                    </p>
                </div>
            );
        case 'actions':
            return (
                <div className="relative flex items-center justify-center gap-2">
                    <Tooltip content="Aprobar pago" color="success">
                        <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            color="success"
                            onPress={() => onApprove(payment)}
                        >
                            <CheckIcon className="text-lg" />
                        </Button>
                    </Tooltip>
                    <Tooltip content="Rechazar pago" color="danger">
                        <Button
                            isIconOnly
                            size="sm"
                            variant="light"
                            color="danger"
                            onPress={() => onReject(payment)}
                        >
                            <XMarkIcon className="text-lg" />
                        </Button>
                    </Tooltip>
                </div>
            );
        default:
            return null;
    }
};
