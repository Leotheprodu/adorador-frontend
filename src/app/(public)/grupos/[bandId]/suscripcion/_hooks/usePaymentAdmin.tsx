import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
    getPendingPayments,
    approvePaymentService,
    rejectPaymentService,
} from '../_services/paymentsService';
import type {
    ApprovePaymentDto,
    RejectPaymentDto,
} from '@bands/[bandId]/suscripcion/_interfaces/payment.interface';

/**
 * Hook para obtener pagos pendientes (Admin only)
 */
export const usePendingPayments = ({ enabled = true }: { enabled?: boolean } = {}) => {
    const { data, isLoading, error, refetch } = getPendingPayments({ enabled });

    return {
        pendingPayments: data?.data || [],
        isLoading,
        error,
        refetch,
    };
};

/**
 * Hook para aprobar un pago (Admin only)
 */
export const useApprovePayment = () => {
    const queryClient = useQueryClient();
    const { mutate, isPending, error, status } = approvePaymentService();

    const handleApprove = (data: ApprovePaymentDto & { paymentId: number }) => {
        mutate(data, {
            onSuccess: (response) => {
                toast.success(response.message || 'Pago aprobado exitosamente');
                // Invalidar queries relacionadas
                queryClient.invalidateQueries({ queryKey: ['PendingPayments'] });
                queryClient.invalidateQueries({ queryKey: ['BandPayments'] });
                queryClient.invalidateQueries({ queryKey: ['BandSubscription'] });
            },
            onError: (error) => {
                toast.error('Error al aprobar el pago');
                console.error('Error aprobando pago:', error);
            },
        });
    };

    return {
        handleApprove,
        isPending,
        error,
        status,
    };
};

/**
 * Hook para rechazar un pago (Admin only)
 */
export const useRejectPayment = () => {
    const queryClient = useQueryClient();
    const { mutate, isPending, error, status } = rejectPaymentService();

    const handleReject = (data: RejectPaymentDto & { paymentId: number }) => {
        mutate(data, {
            onSuccess: (response) => {
                toast.success(response.message || 'Pago rechazado');
                // Invalidar queries relacionadas
                queryClient.invalidateQueries({ queryKey: ['PendingPayments'] });
                queryClient.invalidateQueries({ queryKey: ['BandPayments'] });
            },
            onError: (error) => {
                toast.error('Error al rechazar el pago');
                console.error('Error rechazando pago:', error);
            },
        });
    };

    return {
        handleReject,
        isPending,
        error,
        status,
    };
};
