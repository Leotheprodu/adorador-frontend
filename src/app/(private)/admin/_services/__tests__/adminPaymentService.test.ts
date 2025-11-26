import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getPendingPaymentsService } from '../adminPaymentService';
import { fetchAPI } from '@/global/utils/fetchAPI';
import { PaymentStatus, PaymentMethod } from '../../_interfaces/adminPaymentInterface';

jest.mock('@/global/utils/fetchAPI');

const mockedFetchAPI = fetchAPI as jest.MockedFunction<typeof fetchAPI>;

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
            },
        },
    });
    // eslint-disable-next-line react/display-name
    return ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client= { queryClient } > { children } </QueryClientProvider>
  );
};

describe('adminPaymentService', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('getPendingPaymentsService', () => {
        it('should fetch pending payments successfully', async () => {
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

            mockedFetchAPI.mockResolvedValueOnce(mockPayments);

            const { result } = renderHook(() => getPendingPaymentsService(), {
                wrapper: createWrapper(),
            });

            await waitFor(() => expect(result.current.isSuccess).toBe(true));

            expect(result.current.data).toEqual(mockPayments);
            expect(mockedFetchAPI).toHaveBeenCalledWith(
                expect.objectContaining({
                    url: expect.stringContaining('/payments/pending'),
                }),
            );
        });
    });
});
