import { FetchData, PostData } from '@global/services/HandleAPI';
import { Server1API } from '@global/config/constants';
import type {
    
    CreatePaymentDto,
    ApprovePaymentDto,
    RejectPaymentDto,
} from '@bands/[bandId]/suscripcion/_interfaces/payment.interface';
import type {
    CreatePaymentResponse,
    GetPaymentsResponse,
    ApprovePaymentResponse,
    RejectPaymentResponse,
} from '../_interfaces/serviceResponses';

/**
 * POST - Create a new payment for a band
 */
export const createPaymentService = (bandId: string) => {
    return PostData<CreatePaymentResponse, CreatePaymentDto>({
        key: 'CreatePayment',
        url: `${Server1API}/payments/band/${bandId}`,
        method: 'POST',
    });
};

/**
 * GET - Get band's payment history
 */
export const getBandPayments = ({
    bandId,
    enabled = true,
}: {
    bandId: string;
    enabled?: boolean;
}) => {
    return FetchData<GetPaymentsResponse>({
        key: ['BandPayments', bandId],
        url: `${Server1API}/payments/band/${bandId}`,
        isEnabled: !!bandId && enabled,
    });
};

/**
 * PUT - Approve a payment (Admin only)
 */
export const approvePaymentService = () => {
    return PostData<ApprovePaymentResponse, ApprovePaymentDto & { paymentId: number }>({
        key: 'ApprovePayment',
        url: `${Server1API}/payments`,
        method: 'PUT',
    });
};

/**
 * PUT - Reject a payment (Admin only)
 */
export const rejectPaymentService = () => {
    return PostData<RejectPaymentResponse, RejectPaymentDto & { paymentId: number }>({
        key: 'RejectPayment',
        url: `${Server1API}/payments`,
        method: 'PUT',
    });
};

/**
 * GET - Get pending payments (Admin only)
 * Note: This is a global endpoint, not band-specific
 */
export const getPendingPayments = ({ enabled = true }: { enabled?: boolean } = {}) => {
    return FetchData<GetPaymentsResponse>({
        key: ['PendingPayments'],
        url: `${Server1API}/payments/pending`,
        isEnabled: enabled,
    });
};
