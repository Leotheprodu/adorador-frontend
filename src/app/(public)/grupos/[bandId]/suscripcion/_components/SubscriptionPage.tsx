'use client';
import { useMemo, useState } from 'react';
import { useSubscriptionPlans, useBandSubscription, useSubscriptionLimits } from '../_hooks/useSubscriptionData';
import { useBandPayments } from '../_hooks/usePaymentData';
import { PlanUpgradeCard } from './PlanUpgradeCard';
import { PaymentHistoryTable } from './PaymentHistoryTable';
import { Spinner } from '@nextui-org/spinner';
import { getBandById } from '@bands/_services/bandsService';
import { Tabs, Tab } from '@nextui-org/react';
import type { SubscriptionPlan } from '@bands/[bandId]/suscripcion/_interfaces/subscription.interface';

export const SubscriptionPage = ({
    params,
}: {
    params: { bandId: string };
}) => {
    const [selectedTab, setSelectedTab] = useState<string>('annual');

    // Memoizar params para evitar re-renders innecesarios
    const memoizedParams = useMemo(
        () => ({
            bandId: params.bandId,
        }),
        [params.bandId],
    );

    // Helper to get billing period from durationDays
    const getBillingPeriod = (durationDays: number | null): string => {
        if (durationDays === null || durationDays === 30) return 'mes';
        if (durationDays === 365) return 'año';
        return `${durationDays} días`;
    };

    // Helper to calculate savings for annual plans
    const calculateSavings = (annualPlan: SubscriptionPlan, monthlyPlans: SubscriptionPlan[]): { amount: number; percentage: number } | null => {
        const matchingMonthly = monthlyPlans.find(p => p.type === annualPlan.type);
        if (!matchingMonthly) return null;

        const monthlyYearlyCost = Number(matchingMonthly.price) * 12;
        const annualCost = Number(annualPlan.price);
        const savings = monthlyYearlyCost - annualCost;
        const percentage = Math.round((savings / monthlyYearlyCost) * 100);

        return { amount: savings, percentage };
    };

    // Obtener datos
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

    const isLoading = plansLoading || subscriptionLoading || limitsLoading || paymentsLoading;

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
                <div className="w-full">
                    <h1 className="text-3xl font-bold">Suscripción</h1>
                    <p className="text-default-500">
                        Gestiona tu plan y límites de uso
                    </p>
                </div>

                {/* Current Subscription Card */}
                {subscription && (
                    <div className="w-full rounded-lg border border-default-200 bg-default-50 p-6">
                        <h2 className="mb-2 text-xl font-semibold">Plan Actual</h2>
                        <p className="text-2xl font-bold text-primary">
                            {subscription.plan.name}
                        </p>
                        <p className="text-sm text-default-500">
                            Estado: {subscription.status}
                        </p>
                        <p className="text-sm text-default-500">
                            Válido hasta:{' '}
                            {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                        </p>
                    </div>
                )}

                {/* Usage Limits */}
                {limits && (
                    <div className="w-full rounded-lg border border-default-200 bg-default-50 p-6">
                        <h2 className="mb-4 text-xl font-semibold">Uso Actual</h2>

                        <div className="space-y-4">
                            {/* Members */}
                            <div>
                                <div className="mb-1 flex justify-between text-sm">
                                    <span>Miembros</span>
                                    <span>
                                        {limits.currentMembers} / {limits.maxMembers}
                                    </span>
                                </div>
                                <div className="h-2 w-full rounded-full bg-default-200">
                                    <div
                                        className={`h-2 rounded-full ${membersUsage > 80 ? 'bg-danger' : 'bg-primary'
                                            }`}
                                        style={{ width: `${membersUsage}%` }}
                                    />
                                </div>
                            </div>

                            {/* Songs */}
                            <div>
                                <div className="mb-1 flex justify-between text-sm">
                                    <span>Canciones</span>
                                    <span>
                                        {limits.currentSongs} / {limits.maxSongs}
                                    </span>
                                </div>
                                <div className="h-2 w-full rounded-full bg-default-200">
                                    <div
                                        className={`h-2 rounded-full ${songsUsage > 80 ? 'bg-danger' : 'bg-primary'
                                            }`}
                                        style={{ width: `${songsUsage}%` }}
                                    />
                                </div>
                            </div>

                            {/* Events */}
                            <div>
                                <div className="mb-1 flex justify-between text-sm">
                                    <span>Eventos este mes</span>
                                    <span>
                                        {limits.currentEventsThisMonth} / {limits.maxEventsPerMonth}
                                    </span>
                                </div>
                                <div className="h-2 w-full rounded-full bg-default-200">
                                    <div
                                        className={`h-2 rounded-full ${eventsUsage > 80 ? 'bg-danger' : 'bg-primary'
                                            }`}
                                        style={{ width: `${eventsUsage}%` }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Warning if near limit */}
                        {isNearLimit && (
                            <div className="mt-4 rounded-lg bg-warning-50 p-3 text-sm text-warning-700">
                                ⚠️ Estás cerca de alcanzar tus límites. Considera actualizar tu plan.
                            </div>
                        )}

                        {/* Error if limit reached */}
                        {hasReachedLimit && (
                            <div className="mt-4 rounded-lg bg-danger-50 p-3 text-sm text-danger-700">
                                🚫 Has alcanzado el límite de tu plan. Actualiza para continuar.
                            </div>
                        )}
                    </div>
                )}

                {/* Upgrade Plan Card */}
                {subscription && plans.length > 0 && (
                    <div className="w-full">
                        <PlanUpgradeCard
                            plans={plans}
                            currentPlanId={subscription.planId}
                            bandId={memoizedParams.bandId}
                            bandName={band?.name || 'Mi Banda'}
                        />
                    </div>
                )}

                {/* Available Plans with Tabs */}
                <div className="w-full">
                    <h2 className="mb-4 text-xl font-semibold">Planes Disponibles</h2>

                    <Tabs
                        selectedKey={selectedTab}
                        onSelectionChange={(key) => setSelectedTab(key as string)}
                        aria-label="Plan billing options"
                        color="primary"
                        variant="underlined"
                        classNames={{
                            tabList: "gap-6 w-full relative rounded-none p-0 border-b border-divider",
                            cursor: "w-full bg-primary",
                            tab: "max-w-fit px-0 h-12",
                            tabContent: "group-data-[selected=true]:text-primary"
                        }}
                    >
                        <Tab
                            key="annual"
                            title={
                                <div className="flex items-center space-x-2">
                                    <span>Anual</span>
                                    <span className="rounded-full bg-success-100 px-2 py-0.5 text-xs text-success-700">
                                        Ahorra más
                                    </span>
                                </div>
                            }
                        >
                            <div className="grid grid-cols-1 gap-4 pt-4 md:grid-cols-2 lg:grid-cols-3">
                                {annualPlans.map((plan) => {
                                    const savings = calculateSavings(plan, monthlyPlans);
                                    return (
                                        <div
                                            key={plan.id}
                                            className={`rounded-lg border p-6 ${subscription?.planId === plan.id
                                                ? 'border-primary bg-primary-50'
                                                : 'border-default-200 bg-default-50'
                                                }`}
                                        >
                                            <h3 className="mb-2 text-lg font-bold">{plan.name}</h3>
                                            <p className="mb-1 text-2xl font-bold text-primary">
                                                ${plan.price}
                                                <span className="text-sm text-default-500">
                                                    /{getBillingPeriod(plan.durationDays)}
                                                </span>
                                            </p>
                                            {savings && savings.amount > 0 && (
                                                <p className="mb-4 text-sm font-semibold text-success-600">
                                                    💰 Ahorra ${savings.amount.toFixed(2)} ({savings.percentage}%)
                                                </p>
                                            )}
                                            <ul className="space-y-2 text-sm">
                                                <li>✓ {plan.maxMembers} miembros</li>
                                                <li>✓ {plan.maxSongs} canciones</li>
                                                <li>✓ {plan.maxEventsPerMonth} eventos/mes</li>
                                                <li>✓ {plan.maxPeoplePerEvent} personas/evento</li>
                                            </ul>
                                        </div>
                                    );
                                })}
                            </div>
                        </Tab>

                        <Tab key="monthly" title="Mensual">
                            <div className="grid grid-cols-1 gap-4 pt-4 md:grid-cols-2 lg:grid-cols-3">
                                {monthlyPlans.map((plan) => (
                                    <div
                                        key={plan.id}
                                        className={`rounded-lg border p-6 ${subscription?.planId === plan.id
                                            ? 'border-primary bg-primary-50'
                                            : 'border-default-200 bg-default-50'
                                            }`}
                                    >
                                        <h3 className="mb-2 text-lg font-bold">{plan.name}</h3>
                                        <p className="mb-4 text-2xl font-bold text-primary">
                                            ${plan.price}
                                            <span className="text-sm text-default-500">
                                                /{getBillingPeriod(plan.durationDays)}
                                            </span>
                                        </p>
                                        <ul className="space-y-2 text-sm">
                                            <li>✓ {plan.maxMembers} miembros</li>
                                            <li>✓ {plan.maxSongs} canciones</li>
                                            <li>✓ {plan.maxEventsPerMonth} eventos/mes</li>
                                            <li>✓ {plan.maxPeoplePerEvent} personas/evento</li>
                                        </ul>
                                    </div>
                                ))}
                            </div>
                        </Tab>
                    </Tabs>
                </div>

                {/* Payment History */}
                <div className="w-full">
                    <PaymentHistoryTable
                        payments={payments || []}
                        isLoading={paymentsLoading}
                    />
                </div>
            </div>
        </div>
    );
};
