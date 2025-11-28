import { SubscriptionLimits } from '@bands/[bandId]/suscripcion/_interfaces/subscription.interface';

interface UsageLimitsCardProps {
    limits: SubscriptionLimits | null;
    membersUsage: number;
    songsUsage: number;
    eventsUsage: number;
    isNearLimit: boolean;
    hasReachedLimit: boolean;
}

export const UsageLimitsCard = ({
    limits,
    membersUsage,
    songsUsage,
    eventsUsage,
    isNearLimit,
    hasReachedLimit,
}: UsageLimitsCardProps) => {
    if (!limits) return null;

    return (
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
    );
};
