export enum PaymentStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
}

export enum PaymentMethod {
    SINPE_MOVIL = 'SINPE_MOVIL',
    BANK_TRANSFER = 'BANK_TRANSFER',
    PAYPAL = 'PAYPAL',
}

export interface AdminPayment {
    id: number;
    amount: number;
    currency: string;
    status: PaymentStatus;
    method: PaymentMethod;
    referenceNumber: string | null;
    proofImageUrl: string | null;
    createdAt: string;
    updatedAt: string;
    subscription: {
        band: {
            name: string;
        };
        plan: {
            name: string;
        };
    };
    paidByUser: {
        name: string;
        email: string;
    } | null;
}

export interface ApprovePaymentDto {
    adminUserId: number;
}

export interface RejectPaymentDto {
    reason?: string;
}
