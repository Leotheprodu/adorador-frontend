import { Chip } from '@nextui-org/react';
import { PaymentStatus } from '../../_interfaces/adminPaymentInterface';

interface PaymentStatusBadgeProps {
    status: PaymentStatus;
}

export const PaymentStatusBadge = ({ status }: PaymentStatusBadgeProps) => {
    const getStatusColor = (status: PaymentStatus) => {
        switch (status) {
            case PaymentStatus.APPROVED:
                return 'success';
            case PaymentStatus.REJECTED:
                return 'danger';
            case PaymentStatus.PENDING:
                return 'warning';
            default:
                return 'default';
        }
    };

    const getStatusLabel = (status: PaymentStatus) => {
        switch (status) {
            case PaymentStatus.APPROVED:
                return 'Aprobado';
            case PaymentStatus.REJECTED:
                return 'Rechazado';
            case PaymentStatus.PENDING:
                return 'Pendiente';
            default:
                return status;
        }
    };

    return (
        <Chip
            color={getStatusColor(status)}
            variant="flat"
            size="sm"
            className="capitalize"
        >
            {getStatusLabel(status)}
        </Chip>
    );
};
