import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
    createPaymentService,
    getBandPayments,
} from '../_services/paymentsService';
import type { CreatePaymentDto } from '@bands/[bandId]/suscripcion/_interfaces/payment.interface';

/**
 * Hook para obtener el historial de pagos de una banda
 */
export const useBandPayments = ({
    bandId,
    enabled = true,
}: {
    bandId: string;
    enabled?: boolean;
}) => {
    const { data, isLoading, error, refetch } = getBandPayments({
        bandId,
        enabled,
    });

    return {
        payments: data?.data || [],
        isLoading,
        error,
        refetch,
    };
};

/**
 * Hook para crear un nuevo pago
 */
export const useCreatePayment = (bandId: string) => {
    const queryClient = useQueryClient();
    const { mutate, isPending, error, status } = createPaymentService(bandId);

    const handleCreatePayment = (paymentData: CreatePaymentDto) => {
        mutate(paymentData, {
            onSuccess: (response) => {
                toast.success(response.message || 'Pago enviado para revisión');
                // Invalidar queries relacionadas
                queryClient.invalidateQueries({ queryKey: ['BandPayments', bandId] });
                queryClient.invalidateQueries({ queryKey: ['BandSubscription', bandId] });
            },
            onError: (error) => {
                toast.error('Error al enviar el pago');
                console.error('Error creando pago:', error);
            },
        });
    };

    return {
        handleCreatePayment,
        isPending,
        error,
        status,
    };
};
