import { render, screen, fireEvent } from '@testing-library/react';
import { PendingPaymentsTable } from '../PendingPaymentsTable';
import { PaymentStatus, PaymentMethod } from '../../../_interfaces/adminPaymentInterface';
import * as useAdminPaymentsHooks from '../../../_hooks/useAdminPayments';

// Mock hooks
jest.mock('../../../_hooks/useAdminPayments');

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
        // Mock window.confirm and window.prompt
        window.confirm = jest.fn(() => true);
        window.prompt = jest.fn(() => 'Reason');
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
            createdAt: '2023-01-01T00:00:00Z',
            updatedAt: '2023-01-01T00:00:00Z',
            band: { id: 1, name: 'Band 1' },
            user: { id: 1, name: 'User 1', email: 'user1@example.com' },
            plan: { id: 1, name: 'Plan 1' },
        },
    ];

    it('should render payments correctly', () => {
        render(<PendingPaymentsTable payments={mockPayments} isLoading={false} />);

        expect(screen.getByText('User 1')).toBeInTheDocument();
        expect(screen.getByText('Plan 1')).toBeInTheDocument();
        expect(screen.getByText('USD 100')).toBeInTheDocument();
        expect(screen.getByText('SINPE MOVIL')).toBeInTheDocument();
        expect(screen.getByText('123456')).toBeInTheDocument();
        expect(screen.getByText('Pendiente')).toBeInTheDocument();
    });

    it('should call handleApprove when approve button is clicked', () => {
        render(<PendingPaymentsTable payments={mockPayments} isLoading={false} />);

        const approveButton = screen.getAllByRole('button')[0]; // First button should be approve based on order
        // Better selector: find button inside the actions cell or by icon if possible, but icon is SVG.
        // We can use aria-label if we added it, or tooltip content if accessible.
        // The Tooltip wraps the button.

        // Let's assume the first button in the row is approve (CheckIcon)
        fireEvent.click(approveButton);

        expect(window.confirm).toHaveBeenCalled();
        expect(mockHandleApprove).toHaveBeenCalled();
    });

    it('should call handleReject when reject button is clicked', () => {
        render(<PendingPaymentsTable payments={mockPayments} isLoading={false} />);

        const rejectButton = screen.getAllByRole('button')[1]; // Second button
        fireEvent.click(rejectButton);

        expect(window.prompt).toHaveBeenCalled();
        expect(mockHandleReject).toHaveBeenCalledWith('Reason');
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
