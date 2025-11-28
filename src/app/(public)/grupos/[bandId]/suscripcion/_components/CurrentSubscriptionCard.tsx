import { BandSubscription } from '@bands/[bandId]/suscripcion/_interfaces/subscription.interface';

interface CurrentSubscriptionCardProps {
    subscription: BandSubscription | null;
}

export const CurrentSubscriptionCard = ({ subscription }: CurrentSubscriptionCardProps) => {
    if (!subscription) return null;

    return (
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
    );
};
