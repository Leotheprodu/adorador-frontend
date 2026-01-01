import { User, Button, Tooltip, Link } from '@heroui/react';
import { AdminPayment } from '../../_interfaces/adminPaymentInterface';
import { PaymentStatusBadge } from './PaymentStatusBadge';
import {
  CheckIcon,
  XMarkIcon,
  EyeIcon,
  CalendarIcon,
  CreditCardIcon,
} from '@global/icons';

interface PaymentMobileCardProps {
  payment: AdminPayment;
  onApprove: (payment: AdminPayment) => void;
  onReject: (payment: AdminPayment) => void;
}

export const PaymentMobileCard = ({
  payment,
  onApprove,
  onReject,
}: PaymentMobileCardProps) => {
  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:border-brand-purple-200 dark:border-slate-800 dark:bg-black/40">
      {/* Header: User and Status */}
      <div className="flex items-start justify-between">
        {payment.paidByUser ? (
          <User
            name={payment.paidByUser.name}
            description={payment.paidByUser.email}
            classNames={{
              name: 'text-sm font-bold text-slate-900 dark:text-slate-100',
              description: 'text-[11px] text-slate-500',
            }}
            avatarProps={{
              radius: 'lg',
              src: undefined,
              name: payment.paidByUser.name.charAt(0).toUpperCase(),
              className:
                'bg-brand-purple-100 text-brand-purple-700 dark:bg-brand-purple-900/30 dark:text-brand-purple-400 font-bold h-10 w-10',
            }}
          />
        ) : (
          <span className="text-sm italic text-slate-400">Sin usuario</span>
        )}
        <PaymentStatusBadge status={payment.status} />
      </div>

      {/* Content: Plan and Amount */}
      <div className="grid grid-cols-2 gap-4 border-y border-slate-100 py-4 dark:border-slate-800/50">
        <div className="space-y-1">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Plan / Banda
          </p>
          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
            {payment.plan.name}
          </p>
          <p className="text-[11px] font-medium text-slate-500">
            {payment.subscription.band.name}
          </p>
        </div>
        <div className="space-y-1 text-right">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Monto
          </p>
          <p className="text-lg font-black text-brand-blue-600 dark:text-brand-blue-400">
            {payment.currency} {payment.amount}
          </p>
        </div>
      </div>

      {/* Info: Method and Date */}
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
        <div className="flex items-center gap-2">
          <CreditCardIcon className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-xs font-medium capitalize text-slate-600 dark:text-slate-400">
            {payment.method.replace('_', ' ').toLowerCase()}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <CalendarIcon className="h-3.5 w-3.5 text-slate-400" />
          <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
            {new Date(payment.createdAt).toLocaleDateString()}
          </span>
        </div>
        {payment.referenceNumber && (
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold uppercase text-slate-400">
              Ref:
            </span>
            <span className="font-mono text-xs text-slate-500">
              {payment.referenceNumber}
            </span>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 pt-2">
        {payment.proofImageUrl && (
          <Button
            as={Link}
            href={payment.proofImageUrl}
            target="_blank"
            rel="noopener noreferrer"
            variant="flat"
            size="sm"
            className="flex-1 bg-slate-100 font-bold text-slate-700 dark:bg-slate-800 dark:text-slate-300"
            startContent={<EyeIcon className="h-4 w-4" />}
          >
            Comprobante
          </Button>
        )}
        <div className="flex gap-2">
          <Tooltip content="Aprobar" color="success">
            <Button
              isIconOnly
              size="md"
              variant="flat"
              color="success"
              className="bg-success-50 text-success-600 dark:bg-success-900/20 dark:text-success-400"
              onPress={() => onApprove(payment)}
            >
              <CheckIcon className="h-5 w-5" strokeWidth={2.5} />
            </Button>
          </Tooltip>
          <Tooltip content="Rechazar" color="danger">
            <Button
              isIconOnly
              size="md"
              variant="flat"
              color="danger"
              className="bg-danger-50 text-danger-600 dark:bg-danger-900/20 dark:text-danger-400"
              onPress={() => onReject(payment)}
            >
              <XMarkIcon className="h-5 w-5" strokeWidth={2.5} />
            </Button>
          </Tooltip>
        </div>
      </div>
    </div>
  );
};
