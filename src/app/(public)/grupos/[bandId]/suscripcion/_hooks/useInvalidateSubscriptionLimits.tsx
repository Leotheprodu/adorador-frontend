import { useQueryClient } from '@tanstack/react-query';

/**
 * Hook para invalidar las queries de suscripción cuando cambia el uso
 * Úsalo después de mutaciones que afecten:
 * - Canciones (agregar/eliminar)
 * - Miembros (agregar/eliminar)
 * - Eventos (crear/eliminar)
 */
export const useInvalidateSubscriptionLimits = () => {
    const queryClient = useQueryClient();

    const invalidateLimits = (bandId: string) => {
        // Invalida los límites de la banda específica
        queryClient.invalidateQueries({
            queryKey: ['subscription-limits', bandId],
        });
    };

    const invalidateAllSubscriptionData = (bandId: string) => {
        // Invalida todos los datos de suscripción de la banda
        queryClient.invalidateQueries({
            queryKey: ['subscription-limits', bandId],
        });
        queryClient.invalidateQueries({
            queryKey: ['band-subscription', bandId],
        });
    };

    return {
        invalidateLimits,
        invalidateAllSubscriptionData,
    };
};
