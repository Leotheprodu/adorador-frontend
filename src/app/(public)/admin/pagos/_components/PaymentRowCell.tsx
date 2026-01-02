import { User, Button, Tooltip, Link } from '@heroui/react';
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
          classNames={{
            name: 'text-sm font-semibold text-slate-900 dark:text-slate-100',
            description: 'text-xs text-slate-500',
          }}
          avatarProps={{
            radius: 'lg',
            src: undefined,
            name: payment.paidByUser.name.charAt(0).toUpperCase(),
            className:
              'bg-brand-purple-100 text-brand-purple-700 dark:bg-brand-purple-900/30 dark:text-brand-purple-400 font-bold',
          }}
        />
      ) : (
        <span className="italic text-default-400">Sin usuario</span>
      );
    case 'plan':
      return (
        <div className="flex flex-col gap-0.5">
          <p className="text-sm font-bold capitalize text-slate-800 dark:text-slate-200">
            {payment.plan.name}
          </p>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-400">
            {payment.subscription.band.name}
          </p>
        </div>
      );
    case 'amount':
      return (
        <div className="flex flex-col">
          <p className="text-sm font-bold text-brand-blue-600 dark:text-brand-blue-400">
            {payment.currency} {payment.amount}
          </p>
        </div>
      );
    case 'method':
      return (
        <div className="flex flex-col">
          <p className="text-sm font-medium capitalize text-slate-700 dark:text-slate-300">
            {payment.method.replace('_', ' ')}
          </p>
        </div>
      );
    case 'reference':
      return (
        <div className="flex flex-col">
          <p className="font-mono text-sm text-slate-500">
            {payment.referenceNumber || '-'}
          </p>
        </div>
      );
    case 'proof':
      return payment.proofImageUrl ? (
        <Tooltip content="Ver comprobante" showArrow>
          <Link
            href={payment.proofImageUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-100 text-slate-600 transition-colors hover:bg-brand-purple-100 hover:text-brand-purple-600 dark:bg-slate-800 dark:text-slate-400 dark:hover:bg-brand-purple-900/30 dark:hover:text-brand-purple-400"
          >
            <EyeIcon className="h-4 w-4" />
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
          <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {new Date(payment.createdAt).toLocaleDateString()}
          </p>
          <p className="text-[10px] font-medium text-slate-400">
            {new Date(payment.createdAt).toLocaleTimeString()}
          </p>
        </div>
      );
    case 'actions':
      return (
        <div className="relative flex items-center justify-center gap-1.5">
          <Tooltip content="Aprobar pago" color="success" showArrow>
            <Button
              isIconOnly
              size="sm"
              variant="flat"
              color="success"
              className="bg-success-50 text-success-600 hover:bg-success-100 dark:bg-success-900/20 dark:text-success-400"
              onPress={() => onApprove(payment)}
            >
              <CheckIcon className="h-4 w-4" strokeWidth={2.5} />
            </Button>
          </Tooltip>
          <Tooltip content="Rechazar pago" color="danger" showArrow>
            <Button
              isIconOnly
              size="sm"
              variant="flat"
              color="danger"
              className="bg-danger-50 text-danger-600 hover:bg-danger-100 dark:bg-danger-900/20 dark:text-danger-400"
              onPress={() => onReject(payment)}
            >
              <XMarkIcon className="h-4 w-4" strokeWidth={2.5} />
            </Button>
          </Tooltip>
        </div>
      );
    default:
      return null;
  }
};
