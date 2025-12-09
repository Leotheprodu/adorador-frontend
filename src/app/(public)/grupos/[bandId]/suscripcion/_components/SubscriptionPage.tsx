'use client';

import { Spinner } from "@heroui/spinner";
import { PlanUpgradeCard } from './PlanUpgradeCard';
import { PaymentHistoryTable } from './PaymentHistoryTable';
import { useSubscriptionPageLogic } from '../_hooks/useSubscriptionPageLogic';
import { SubscriptionHeader } from './SubscriptionHeader';
import { CurrentSubscriptionCard } from './CurrentSubscriptionCard';
import { UsageLimitsCard } from './UsageLimitsCard';
import { AvailablePlansTabs } from './AvailablePlansTabs';

export const SubscriptionPage = ({
    params,
}: {
    params: { bandId: string };
}) => {
    const {
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
    } = useSubscriptionPageLogic({ bandId: params.bandId });

    if (isLoading) {
        return (
            <div className="flex h-full w-full items-center justify-center">
                <Spinner size="lg" />
            </div>
        );
    }

    return (
        <div className="mb-40 flex h-full w-full flex-col items-center justify-center px-3 sm:px-4">
            <div className="flex w-full max-w-screen-lg flex-col items-center gap-6">
                {/* Header */}
                <SubscriptionHeader />

                {/* Current Subscription Card */}
                <CurrentSubscriptionCard subscription={subscription} />

                {/* Usage Limits */}
                <UsageLimitsCard
                    limits={limits}
                    membersUsage={membersUsage}
                    songsUsage={songsUsage}
                    eventsUsage={eventsUsage}
                    isNearLimit={isNearLimit}
                    hasReachedLimit={hasReachedLimit}
                />

                {/* Upgrade Plan Card */}
                {subscription && plans.length > 0 && (
                    <div className="w-full">
                        <PlanUpgradeCard
                            plans={plans}
                            currentPlanId={subscription.planId}
                            bandId={params.bandId}
                            bandName={band?.name || 'Mi Banda'}
                        />
                    </div>
                )}

                {/* Available Plans with Tabs */}
                <AvailablePlansTabs
                    selectedTab={selectedTab}
                    setSelectedTab={setSelectedTab}
                    annualPlans={annualPlans}
                    monthlyPlans={monthlyPlans}
                    subscription={subscription}
                    getBillingPeriod={getBillingPeriod}
                    calculateSavings={calculateSavings}
                />

                {/* Payment History */}
                <div className="w-full">
                    <PaymentHistoryTable
                        payments={payments || []}
                        isLoading={isLoading}
                    />
                </div>
            </div>
        </div>
    );
};
