import { renderHook, act, waitFor } from '@testing-library/react';
import { useApprovePayment, useRejectPayment } from '../useAdminPayments';
import { approvePaymentMutation, rejectPaymentMutation } from '../../_services/adminPaymentService';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import toast from 'react-hot-toast';

// Mock services
jest.mock('../../_services/adminPaymentService');
jest.mock('react-hot-toast');

const mockApprovePaymentMutation = approvePaymentMutation as jest.Mock;
const mockRejectPaymentMutation = rejectPaymentMutation as jest.Mock;

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false },
        },
    });
    // eslint-disable-next-line react/display-name
    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
};

describe('useAdminPayments Hooks', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('useApprovePayment', () => {
        it('should call approve mutation and show success toast', async () => {
            const mutateMock = jest.fn((variables, { onSuccess }) => {
                onSuccess();
            });
            mockApprovePaymentMutation.mockReturnValue({
                mutate: mutateMock,
                isPending: false,
                isSuccess: true,
                isError: false,
            });

            const { result } = renderHook(() => useApprovePayment(1), {
                wrapper: createWrapper(),
            });

            act(() => {
                result.current.handleApprove();
            });

            expect(mutateMock).toHaveBeenCalled();
            expect(toast.success).toHaveBeenCalledWith('Pago aprobado correctamente');
        });

        it('should show error toast on failure', async () => {
            const mutateMock = jest.fn((variables, { onError }) => {
                onError();
            });
            mockApprovePaymentMutation.mockReturnValue({
                mutate: mutateMock,
                isPending: false,
                isSuccess: false,
                isError: true,
            });

            const { result } = renderHook(() => useApprovePayment(1), {
                wrapper: createWrapper(),
            });

            act(() => {
                result.current.handleApprove();
            });

            expect(toast.error).toHaveBeenCalledWith('Error al aprobar el pago');
        });
    });

    describe('useRejectPayment', () => {
        it('should call reject mutation and show success toast', async () => {
            const mutateMock = jest.fn((variables, { onSuccess }) => {
                onSuccess();
            });
            mockRejectPaymentMutation.mockReturnValue({
                mutate: mutateMock,
                isPending: false,
                isSuccess: true,
                isError: false,
            });

            const { result } = renderHook(() => useRejectPayment(1), {
                wrapper: createWrapper(),
            });

            act(() => {
                result.current.handleReject('Invalid proof');
            });

            expect(mutateMock).toHaveBeenCalledWith({ reason: 'Invalid proof' }, expect.anything());
            expect(toast.success).toHaveBeenCalledWith('Pago rechazado correctamente');
        });
    });
});
