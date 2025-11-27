import { approvePaymentRequest, rejectPaymentRequest, getPendingPaymentsService } from '../_services/adminPaymentService';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export const useAdminPayments = () => {
    const { data: pendingPayments, isLoading, error } = getPendingPaymentsService();

    return {
        pendingPayments,
        isLoading,
        error,
    };
};

export const useApprovePayment = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: (id: number) => approvePaymentRequest(id),
        onSuccess: () => {
            toast.success('Pago aprobado correctamente');
            queryClient.invalidateQueries({ queryKey: ['AdminPendingPayments'] });
        },
        onError: (error: Error) => {
            toast.error(`Error al aprobar el pago: ${error.message}`);
        }
    });

    const handleApprove = (id: number) => {
        mutation.mutate(id);
    };

    return {
        handleApprove,
        isApproving: mutation.isPending,
    };
};

export const useRejectPayment = () => {
    const queryClient = useQueryClient();

    const mutation = useMutation({
        mutationFn: ({ id, reason }: { id: number; reason?: string }) => rejectPaymentRequest(id, reason),
        onSuccess: () => {
            toast.success('Pago rechazado correctamente');
            queryClient.invalidateQueries({ queryKey: ['AdminPendingPayments'] });
        },
        onError: (error: Error) => {
            toast.error(`Error al rechazar el pago: ${error.message}`);
        }
    });

    const handleReject = (id: number, reason?: string) => {
        mutation.mutate({ id, reason });
    };

    return {
        handleReject,
        isRejecting: mutation.isPending,
    };
};
