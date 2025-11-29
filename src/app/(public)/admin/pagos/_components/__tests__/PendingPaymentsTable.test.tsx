import React from 'react';
import { render, screen } from '@testing-library/react';
import { PendingPaymentsTable } from '../PendingPaymentsTable';
import { PaymentStatus, PaymentMethod, AdminPayment } from '../../../_interfaces/adminPaymentInterface';
import * as useAdminPaymentsHooks from '../../../_hooks/useAdminPayments';

// Mock hooks
jest.mock('../../../_hooks/useAdminPayments');

// Mock NextUI
jest.mock('@nextui-org/react', () => ({
    Table: ({ children }: { children: React.ReactNode }) => <table>{children}</table>,
    TableHeader: ({ columns }: { columns: Array<{ uid: string; name: string }> }) => (
        <thead>
            <tr>
                {columns.map((col: { uid: string; name: string }) => (
                    <th key={col.uid}>{col.name}</th>
                ))}
            </tr>
        </thead>
    ),
    TableColumn: ({ children }: { children: React.ReactNode }) => <th>{children}</th>,
    TableBody: ({ children, items, isLoading, loadingContent, emptyContent }: { children: (item: AdminPayment) => React.ReactNode; items: AdminPayment[]; isLoading: boolean; loadingContent: React.ReactNode; emptyContent: React.ReactNode }) => {
        if (isLoading) return <tbody><tr><td>{loadingContent}</td></tr></tbody>;
        if (items.length === 0) return <tbody><tr><td>{emptyContent}</td></tr></tbody>;
        return (
            <tbody>
                {items.map((item: AdminPayment) => children(item))}
            </tbody>
        );
    },
    TableRow: ({ children }: { children: React.ReactNode }) => <tr>{children}</tr>,
    TableCell: ({ children }: { children: React.ReactNode }) => <td>{children}</td>,
    User: ({ name }: { name: string }) => <div>{name}</div>,
    Button: ({ children, onClick, onPress }: { children: React.ReactNode; onClick?: () => void; onPress?: () => void }) => <button onClick={onPress || onClick}>{children}</button>,
    Tooltip: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
    Link: ({ children }: { children: React.ReactNode }) => <a>{children}</a>,
    useDisclosure: () => {
        const [isOpen, setIsOpen] = React.useState(false);
        return {
            isOpen,
            onOpen: () => setIsOpen(true),
            onOpenChange: (open: boolean) => setIsOpen(open),
            onClose: () => setIsOpen(false),
        };
    },
}));

// Mock PaymentRowCell
jest.mock('../PaymentRowCell', () => ({
    PaymentRowCell: ({ payment, columnKey, onApprove, onReject }: { payment: AdminPayment; columnKey: React.Key; onApprove: (payment: AdminPayment) => void; onReject: (payment: AdminPayment) => void }) => {
        if (columnKey === 'user') return <div>{payment.paidByUser?.name}</div>;
        if (columnKey === 'plan') return <div>{payment.plan.name}</div>;
        if (columnKey === 'amount') return <div>{payment.currency} {payment.amount}</div>;
        if (columnKey === 'method') return <div>{payment.method.replace('_', ' ')}</div>;
        if (columnKey === 'reference') return <div>{payment.referenceNumber}</div>;
        if (columnKey === 'status') return <div>Pendiente</div>;
        if (columnKey === 'actions') return (
            <div>
                <button onClick={() => onApprove(payment)}>Approve</button>
                <button onClick={() => onReject(payment)}>Reject</button>
            </div>
        );
        return null;
    },
}));

// Mock Modals
jest.mock('../ApprovePaymentModal', () => ({
    ApprovePaymentModal: ({ isOpen, onConfirm }: { isOpen: boolean; onConfirm: () => void }) =>
        isOpen ? <button onClick={onConfirm}>Confirm Approve</button> : null,
}));

jest.mock('../RejectPaymentModal', () => ({
    RejectPaymentModal: ({ isOpen, onConfirm }: { isOpen: boolean; onConfirm: (reason: string) => void }) =>
        isOpen ? <button onClick={() => onConfirm('Reason')}>Confirm Reject</button> : null,
}));

const mockHandleApprove = jest.fn();
const mockHandleReject = jest.fn();

describe('PendingPaymentsTable', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        (useAdminPaymentsHooks.useApprovePayment as jest.Mock).mockReturnValue({
            handleApprove: mockHandleApprove,
            isApproving: false,
        });
        (useAdminPaymentsHooks.useRejectPayment as jest.Mock).mockReturnValue({
            handleReject: mockHandleReject,
            isRejecting: false,
        });
    });

    const mockPayments: AdminPayment[] = [
        {
            id: 1,
            amount: 100,
            currency: 'USD',
            status: PaymentStatus.PENDING,
            method: PaymentMethod.SINPE_MOVIL,
            referenceNumber: '123456',
            proofImageUrl: 'http://example.com/proof.jpg',
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2023-01-01T00:00:00Z',
            plan: { id: 1, name: 'Plan 1', price: 100 },
            subscription: { band: { name: 'Band 1' } },
            paidByUser: { name: 'User 1', email: 'user1@example.com' },
        },
    ];

    it('should render table structure', () => {
        render(<PendingPaymentsTable payments={mockPayments} isLoading={false} />);

        // Table should render
        expect(screen.getByRole('table')).toBeInTheDocument();
    });

    it('should show loading state', () => {
        render(<PendingPaymentsTable payments={[]} isLoading={true} />);
        expect(screen.getByText('Cargando pagos...')).toBeInTheDocument();
    });

    it('should show empty state', () => {
        render(<PendingPaymentsTable payments={[]} isLoading={false} />);
        expect(screen.getByText('No hay pagos pendientes')).toBeInTheDocument();
    });
});
