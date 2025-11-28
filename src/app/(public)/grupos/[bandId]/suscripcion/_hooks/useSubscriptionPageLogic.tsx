import { useMemo, useState } from 'react';
import { useSubscriptionPlans, useBandSubscription, useSubscriptionLimits } from './useSubscriptionData';
import { useBandPayments } from './usePaymentData';
import { getBandById } from '@bands/_services/bandsService';
import { SubscriptionPlan } from '@bands/[bandId]/suscripcion/_interfaces/subscription.interface';

interface UseSubscriptionPageLogicProps {
    bandId: string;
}

export const useSubscriptionPageLogic = ({ bandId }: UseSubscriptionPageLogicProps) => {
    const [selectedTab, setSelectedTab] = useState<string>('annual');

    // Memoize params
    const memoizedParams = useMemo(
        () => ({
            bandId,
        }),
        [bandId],
    );

    // Fetch data
    const { data: band } = getBandById(memoizedParams.bandId);
    const { plans, isLoading: plansLoading } = useSubscriptionPlans();
    const { subscription, isLoading: subscriptionLoading } = useBandSubscription({
        bandId: memoizedParams.bandId,
    });
    const {
        limits,
        membersUsage,
        songsUsage,
        eventsUsage,
        isNearLimit,
        hasReachedLimit,
        isLoading: limitsLoading,
    } = useSubscriptionLimits({
        bandId: memoizedParams.bandId,
    });
    const { payments, isLoading: paymentsLoading } = useBandPayments({
        bandId: memoizedParams.bandId,
    });

    // Group plans by billing cycle
    const { annualPlans, monthlyPlans } = useMemo(() => {
        const annual = plans.filter(p => p.durationDays === 365 && p.name !== 'Trial');
        const monthly = plans.filter(p => (p.durationDays === null || p.durationDays === 30) && p.name !== 'Trial');
        return { annualPlans: annual, monthlyPlans: monthly };
    }, [plans]);

    // Helper to get billing period
    const getBillingPeriod = (durationDays: number | null): string => {
        if (durationDays === null || durationDays === 30) return 'mes';
        if (durationDays === 365) return 'año';
        return `${durationDays} días`;
    };

    // Helper to calculate savings
    const calculateSavings = (annualPlan: SubscriptionPlan, monthlyPlans: SubscriptionPlan[]): { amount: number; percentage: number } | null => {
        const matchingMonthly = monthlyPlans.find(p => p.type === annualPlan.type);
        if (!matchingMonthly) return null;

        const monthlyYearlyCost = Number(matchingMonthly.price) * 12;
        const annualCost = Number(annualPlan.price);
        const savings = monthlyYearlyCost - annualCost;
        const percentage = Math.round((savings / monthlyYearlyCost) * 100);

        return { amount: savings, percentage };
    };

    const isLoading = plansLoading || subscriptionLoading || limitsLoading || paymentsLoading;

    return {
        band,
        plans,
        subscription,
        limits,
        membersUsage,
        songsUsage,
        eventsUsage,
        isNearLimit,
        hasReachedLimit,
        payments,
        annualPlans,
        monthlyPlans,
        selectedTab,
        setSelectedTab,
        isLoading,
        getBillingPeriod,
        calculateSavings,
    };
};
