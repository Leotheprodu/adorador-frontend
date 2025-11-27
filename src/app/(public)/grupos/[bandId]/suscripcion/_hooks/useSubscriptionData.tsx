import {
    getBandSubscription,
    getSubscriptionLimits,
    getSubscriptionPlans,
} from '../_services/subscriptionsService';

/**
 * Hook para obtener los planes de suscripción disponibles
 */
export const useSubscriptionPlans = () => {
    const { data, isLoading, error, refetch } = getSubscriptionPlans();

    return {
        plans: data || [], // Backend devuelve array directamente
        isLoading,
        error,
        refetch,
    };
};

/**
 * Hook para obtener la suscripción actual de una banda
 */
export const useBandSubscription = ({
    bandId,
    enabled = true,
}: {
    bandId: string;
    enabled?: boolean;
}) => {
    const { data, isLoading, error, refetch } = getBandSubscription({
        bandId,
        enabled,
    });

    return {
        subscription: data || null, // Backend devuelve objeto directamente
        isLoading,
        error,
        refetch,
    };
};

/**
 * Hook para obtener los límites y uso actual de una banda
 */
export const useSubscriptionLimits = ({
    bandId,
    enabled = true,
}: {
    bandId: string;
    enabled?: boolean;
}) => {
    const { data, isLoading, error, refetch } = getSubscriptionLimits({
        bandId,
        enabled,
    });

    const limits = data; // Backend devuelve objeto directamente

    // Calcular porcentajes de uso
    const membersUsage = limits
        ? Math.round((limits.currentMembers / limits.maxMembers) * 100)
        : 0;
    const songsUsage = limits
        ? Math.round((limits.currentSongs / limits.maxSongs) * 100)
        : 0;
    const eventsUsage = limits
        ? Math.round((limits.currentEventsThisMonth / limits.maxEventsPerMonth) * 100)
        : 0;

    // Verificar si algún límite está cerca del máximo (>80%)
    const isNearLimit =
        membersUsage > 80 || songsUsage > 80 || eventsUsage > 80;

    // Verificar si algún límite fue alcanzado
    const hasReachedLimit = limits
        ? limits.currentMembers >= limits.maxMembers ||
        limits.currentSongs >= limits.maxSongs ||
        limits.currentEventsThisMonth >= limits.maxEventsPerMonth
        : false;

    return {
        limits,
        membersUsage,
        songsUsage,
        eventsUsage,
        isNearLimit,
        hasReachedLimit,
        isLoading,
        error,
        refetch,
    };
};
