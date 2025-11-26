import { FetchData } from '@global/services/HandleAPI';
import { fetchAPI } from '@global/utils/fetchAPI';
import { Server1API } from '@global/config/constants';
import { AdminPayment, ApprovePaymentDto } from '../_interfaces/adminPaymentInterface';

export const getPendingPaymentsService = () => {
    return FetchData<AdminPayment[]>({
        key: 'AdminPendingPayments',
        url: `${Server1API}/payments/pending`,
    });
};

export const approvePaymentRequest = async (paymentId: number) => {
    return fetchAPI<AdminPayment>({
        url: `${Server1API}/payments/${paymentId}/approve`,
        method: 'PUT',
    });
}

export const rejectPaymentRequest = async (paymentId: number, reason?: string) => {
    return fetchAPI<AdminPayment, { reason?: string }>({
        url: `${Server1API}/payments/${paymentId}/reject`,
        method: 'PUT',
        body: { reason }
    });
}
