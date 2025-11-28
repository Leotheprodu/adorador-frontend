import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { PendingPaymentsTable } from '../PendingPaymentsTable';
import { PaymentStatus, PaymentMethod } from '../../../_interfaces/adminPaymentInterface';
import * as useAdminPaymentsHooks from '../../../_hooks/useAdminPayments';

// Mock hooks
jest.mock('../../../_hooks/useAdminPayments');

// Mock NextUI
jest.mock('@nextui-org/react', () => ({
    Table: ({ children }: any) => <table>{children}</table>,
    TableHeader: ({ children, columns }: any) => (
        <thead>
            <tr>
                {columns.map((col: any) => (
                    <th key={col.uid}>{col.name}</th>
                ))}
            </tr>
        </thead>
    ),
    TableColumn: ({ children }: any) => <th>{children}</th>,
    TableBody: ({ children, items, isLoading, loadingContent, emptyContent }: any) => {
        if (isLoading) return <tbody><tr><td>{loadingContent}</td></tr></tbody>;
        if (items.length === 0) return <tbody><tr><td>{emptyContent}</td></tr></tbody>;
        return (
            <tbody>
                {items.map((item: any) => children(item))}
            </tbody>
        );
    },
    TableRow: ({ children }: any) => <tr>{children}</tr>,
    TableCell: ({ children }: any) => <td>{children}</td>,
    User: ({ name }: any) => <div>{name}</div>,
    Button: ({ children, onClick, onPress }: any) => <button onClick={onPress || onClick}>{children}</button>,
    Tooltip: ({ children }: any) => <div>{children}</div>,
    Link: ({ children }: any) => <a>{children}</a>,
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
    PaymentRowCell: ({ payment, columnKey, onApprove, onReject }: any) => {
        if (columnKey === 'user') return <div>{payment.user.name}</div>;
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
    ApprovePaymentModal: ({ isOpen, onConfirm }: any) =>
        isOpen ? <button onClick={onConfirm}>Confirm Approve</button> : null,
}));

jest.mock('../RejectPaymentModal', () => ({
    RejectPaymentModal: ({ isOpen, onConfirm }: any) =>
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

    const mockPayments = [
        {
            id: 1,
            amount: 100,
            currency: 'USD',
            status: PaymentStatus.PENDING,
            method: PaymentMethod.SINPE_MOVIL,
            referenceNumber: '123456',
            proofUrl: 'http://example.com/proof.jpg',
            proofImageUrl: 'http://example.com/proof.jpg',
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2023-01-01T00:00:00Z',
            band: { id: 1, name: 'Band 1' },
            user: { id: 1, name: 'User 1', email: 'user1@example.com' },
            plan: { id: 1, name: 'Plan 1', price: 100 },
            subscription: { band: { name: 'Band 1' } },
            paidByUser: { id: 1, name: 'User 1', email: 'user1@example.com' },
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
