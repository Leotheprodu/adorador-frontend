'use client';

import { getSubscriptionPlans } from '@bands/[bandId]/suscripcion/_services/subscriptionsService';
import { PlanType } from '@bands/[bandId]/suscripcion/_interfaces/subscription.interface';

/**
 * Hook para obtener los planes de suscripción disponibles
 * Reutiliza el servicio existente de subscripciones
 */
export const usePricingData = () => {
    const { data, isLoading, error } = getSubscriptionPlans();

    // GetPlansResponse es directamente SubscriptionPlan[]
    // Aseguramos que data sea un array antes de filtrar
    const plans = Array.isArray(data) ? data : [];

    // Separar planes por duración
    const monthlyPlans = plans.filter(
        (plan) =>
            plan.durationDays === null ||
            (plan.durationDays === 30 && plan.name !== 'Trial'),
    );

    const annualPlans = plans.filter((plan) => plan.durationDays === 365);

    const trialPlan = plans.find((plan) => plan.type === PlanType.TRIAL);

    return {
        plans,
        monthlyPlans,
        annualPlans,
        trialPlan,
        isLoading,
        error,
    };
};
