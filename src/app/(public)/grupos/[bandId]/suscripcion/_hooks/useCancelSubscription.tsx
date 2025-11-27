import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { cancelSubscriptionService } from '../_services/subscriptionsService';

/**
 * Hook para cancelar la suscripción de una banda
 */
export const useCancelSubscription = (bandId: string) => {
    const queryClient = useQueryClient();
    const { mutate, isPending, error, status } = cancelSubscriptionService(bandId);

    const handleCancel = () => {
        mutate(null, {
            onSuccess: (response) => {
                toast.success(response.message || 'Suscripción cancelada exitosamente');
                // Invalidar queries relacionadas
                queryClient.invalidateQueries({ queryKey: ['BandSubscription', bandId] });
                queryClient.invalidateQueries({ queryKey: ['SubscriptionLimits', bandId] });
            },
            onError: (error) => {
                toast.error('Error al cancelar la suscripción');
                console.error('Error cancelando suscripción:', error);
            },
        });
    };

    return {
        handleCancel,
        isPending,
        error,
        status,
    };
};
