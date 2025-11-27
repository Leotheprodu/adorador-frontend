/**
 * Payment Method Enum
 */
export enum PaymentMethod {
    BANK_TRANSFER = 'BANK_TRANSFER',
    PAYPAL = 'PAYPAL',
    SINPE_MOVIL = 'SINPE_MOVIL',
}

/**
 * Payment Status Enum
 */
export enum PaymentStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
}

/**
 * Payment History Record
 */
export interface PaymentHistory {
    id: number;
    bandId: number | null;
    subscriptionId: number;
    amount: string;
    currency: string;
    method: PaymentMethod;
    status: PaymentStatus;
    paidByUserId: number | null;
    referenceNumber: string | null;
    proofImageUrl: string | null;
    notes: string | null;
    approvedByUserId: number | null;
    approvedAt: string | null;
    rejectionReason: string | null;
    createdAt: string;
    updatedAt: string;
    // Relaciones anidadas
    plan?: {
        id: number;
        name: string;
        price: number;
    };
    // Fallback para registros antiguos sin planId
    subscription?: {
        plan: {
            id: number;
            name: string;
            price: number;
        };
    };
    paidByUser?: {
        id: number;
        name: string;
        phone: string;
    };
    band?: {
        id: number;
        name: string;
    };
}

/**
 * Create Payment DTO
 */
export interface CreatePaymentDto {
    planId: number;
    method: PaymentMethod;
    proofUrl: string;
    amount?: number;
}

/**
 * Approve Payment DTO
 */
export interface ApprovePaymentDto {
    adminUserId: number;
}

/**
 * Reject Payment DTO
 */
export interface RejectPaymentDto {
    adminUserId: number;
    reason: string;
}

/**
 * Payment Summary for Display
 */
export interface PaymentSummary {
    total: number;
    pending: number;
    approved: number;
    rejected: number;
    lastPayment?: PaymentHistory;
}
