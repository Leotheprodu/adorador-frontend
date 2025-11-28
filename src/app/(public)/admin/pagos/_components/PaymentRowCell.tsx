import {
    User,
    Button,
    Tooltip,
    Link,
} from '@nextui-org/react';
import { AdminPayment } from '../../_interfaces/adminPaymentInterface';
import { PaymentStatusBadge } from './PaymentStatusBadge';
import { CheckIcon, XMarkIcon, EyeIcon } from '@global/icons';

interface PaymentRowCellProps {
    payment: AdminPayment;
    columnKey: React.Key;
    onApprove: (payment: AdminPayment) => void;
    onReject: (payment: AdminPayment) => void;
}

export const PaymentRowCell = ({
    payment,
    columnKey,
    onApprove,
    onReject,
}: PaymentRowCellProps) => {
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
