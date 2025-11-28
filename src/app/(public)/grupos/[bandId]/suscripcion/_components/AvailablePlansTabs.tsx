import { Tabs, Tab } from '@nextui-org/react';
import { SubscriptionPlan, BandSubscription } from '@bands/[bandId]/suscripcion/_interfaces/subscription.interface';

interface AvailablePlansTabsProps {
    selectedTab: string;
    setSelectedTab: (key: string) => void;
    annualPlans: SubscriptionPlan[];
    monthlyPlans: SubscriptionPlan[];
    subscription: BandSubscription | null;
    getBillingPeriod: (durationDays: number | null) => string;
    calculateSavings: (annualPlan: SubscriptionPlan, monthlyPlans: SubscriptionPlan[]) => { amount: number; percentage: number } | null;
}

export const AvailablePlansTabs = ({
    selectedTab,
    setSelectedTab,
    annualPlans,
    monthlyPlans,
    subscription,
    getBillingPeriod,
    calculateSavings,
}: AvailablePlansTabsProps) => {
    return (
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
    );
};
