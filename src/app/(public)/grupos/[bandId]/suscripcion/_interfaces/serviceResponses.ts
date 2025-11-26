/**
 * Service Response Interfaces
 * Interfaces específicas para las respuestas de los servicios de suscripciones y pagos
 */

import type {
    SubscriptionPlan,
    BandSubscription,
    SubscriptionLimits,
} from '@bands/[bandId]/suscripcion/_interfaces/subscription.interface';
import type { PaymentHistory } from '@bands/[bandId]/suscripcion/_interfaces/payment.interface';

/**
 * Subscription Service Responses
 */
export type GetPlansResponse = SubscriptionPlan[];

export type GetSubscriptionResponse = BandSubscription;

export type GetLimitsResponse = SubscriptionLimits;

export interface CancelSubscriptionResponse {
    success: boolean;
    message: string;
}

/**
 * Payment Service Responses
 */
export interface CreatePaymentResponse {
    success: boolean;
    data: PaymentHistory;
    message: string;
}

export interface GetPaymentsResponse {
    success: boolean;
    data: PaymentHistory[];
}

export interface ApprovePaymentResponse {
    success: boolean;
    data: PaymentHistory;
    message: string;
}

export interface RejectPaymentResponse {
    success: boolean;
    data: PaymentHistory;
    message: string;
}
