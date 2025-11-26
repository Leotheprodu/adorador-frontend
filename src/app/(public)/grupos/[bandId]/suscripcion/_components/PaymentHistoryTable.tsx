import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Chip,
    Tooltip,
    Link,
} from '@nextui-org/react';
import { PaymentHistory, PaymentStatus } from '../_interfaces/payment.interface';
import { EyeIcon } from '@global/icons';

interface PaymentHistoryTableProps {
    payments: PaymentHistory[];
    isLoading: boolean;
}

export const PaymentHistoryTable = ({
    payments,
    isLoading,
}: PaymentHistoryTableProps) => {
    const columns = [
        { name: 'PLAN', uid: 'plan' },
        { name: 'MONTO', uid: 'amount' },
        { name: 'MÉTODO', uid: 'method' },
        { name: 'ESTADO', uid: 'status' },
        { name: 'FECHA', uid: 'date' },
        { name: 'COMPROBANTE', uid: 'proof' },
        { name: 'DETALLES', uid: 'details' },
    ];

    const renderCell = (payment: PaymentHistory, columnKey: React.Key) => {
        switch (columnKey) {
            case 'plan':
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-sm capitalize">
                            {payment.subscription?.plan?.name || 'Plan desconocido'}
                        </p>
                    </div>
                );
            case 'amount':
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-sm capitalize">
                            {payment.amount} {payment.currency}
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
            case 'status':
                return (
                    <Chip
                        className="capitalize"
                        color={
                            payment.status === PaymentStatus.APPROVED
                                ? 'success'
                                : payment.status === PaymentStatus.REJECTED
                                    ? 'danger'
                                    : 'warning'
                        }
                        size="sm"
                        variant="flat"
                    >
                        {payment.status === PaymentStatus.APPROVED
                            ? 'Aprobado'
                            : payment.status === PaymentStatus.REJECTED
                                ? 'Rechazado'
                                : 'Pendiente'}
                    </Chip>
                );
            case 'date':
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-sm capitalize">
                            {new Date(payment.createdAt).toLocaleDateString()}
                        </p>
                        <p className="text-bold text-xs text-default-400 capitalize">
                            {new Date(payment.createdAt).toLocaleTimeString()}
                        </p>
                    </div>
                );
            case 'proof':
                return payment.proofImageUrl ? (
                    <Tooltip content="Ver comprobante">
                        <Link
                            isExternal
                            href={payment.proofImageUrl}
                            className="text-lg text-default-400 cursor-pointer active:opacity-50"
                        >
                            <EyeIcon />
                        </Link>
                    </Tooltip>
                ) : (
                    <span className="text-default-400 text-sm">N/A</span>
                );
            case 'details':
                return (
                    <div className="flex flex-col text-xs">
                        {payment.status === PaymentStatus.REJECTED && payment.rejectionReason && (
                            <p className="text-danger">
                                <span className="font-semibold">Razón:</span> {payment.rejectionReason}
                            </p>
                        )}
                        {payment.status === PaymentStatus.APPROVED && payment.approvedAt && (
                            <p className="text-success">
                                Aprobado el {new Date(payment.approvedAt).toLocaleDateString()}
                            </p>
                        )}
                        {payment.paidByUser && (
                            <p className="text-default-500">
                                Por: {payment.paidByUser.name}
                            </p>
                        )}
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="w-full flex flex-col gap-4">
            <h3 className="text-xl font-semibold">Historial de Pagos</h3>
            <Table aria-label="Tabla de historial de pagos">
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
                    loadingContent={<div>Cargando historial...</div>}
                    emptyContent={'No hay pagos registrados'}
                >
                    {(item) => (
                        <TableRow key={item.id}>
                            {(columnKey) => (
                                <TableCell>{renderCell(item, columnKey)}</TableCell>
                            )}
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
};
