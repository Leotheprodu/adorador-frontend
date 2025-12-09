'use client';

import { Card, CardBody, CardHeader, Button, Progress, Chip } from "@heroui/react";
import { useBandSubscription, useSubscriptionLimits } from '../_hooks/useSubscriptionData';
import Link from 'next/link';
import { CrownIcon } from '@global/icons/CrownIcon';

export const SubscriptionSummaryCard = ({ bandId }: { bandId: string }) => {
    const { subscription, isLoading: subLoading } = useBandSubscription({ bandId });
    const { limits, membersUsage, songsUsage, eventsUsage, isLoading: limitsLoading } = useSubscriptionLimits({ bandId });

    const isLoading = subLoading || limitsLoading;

    if (isLoading) {
        return (
            <Card className="w-full animate-pulse">
                <CardBody className="h-32" />
            </Card>
        );
    }

    if (!subscription) return null;

    return (
        <Card className="w-full border-none bg-gradient-to-br from-violet-50 to-fuchsia-50 dark:from-violet-900/20 dark:to-fuchsia-900/20">
            <CardHeader className="flex justify-between px-6 pt-6">
                <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-violet-500 to-fuchsia-500 text-white shadow-lg">
                        <CrownIcon className="h-5 w-5" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-foreground">Tu Suscripción</h3>
                        <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-violet-600 dark:text-violet-400">
                                Plan {subscription.plan.name}
                            </span>
                            <Chip size="sm" variant="flat" color={subscription.status === 'ACTIVE' ? 'success' : 'warning'}>
                                {subscription.status}
                            </Chip>
                        </div>
                        <p className="text-xs text-default-500">
                            Vence el {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                        </p>
                    </div>
                </div>
                <Button
                    as={Link}
                    href={`/grupos/${bandId}/suscripcion`}
                    color="secondary"
                    variant="flat"
                    className="font-medium"
                    aria-label='Gestionar suscripción'
                >
                    Gestionar
                </Button>
            </CardHeader>

            <CardBody className="px-6 pb-6">
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                            <span className="text-default-500">Miembros</span>
                            <span className="font-medium">{limits?.currentMembers || 0} / {limits?.maxMembers}</span>
                        </div>
                        <Progress
                            value={membersUsage}
                            color={membersUsage > 90 ? "danger" : "secondary"}
                            size="sm"
                            className="max-w-md"
                            aria-label='Miembros'
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                            <span className="text-default-500">Canciones</span>
                            <span className="font-medium">{limits?.currentSongs || 0} / {limits?.maxSongs}</span>
                        </div>
                        <Progress
                            value={songsUsage}
                            color={songsUsage > 90 ? "danger" : "secondary"}
                            size="sm"
                            className="max-w-md"
                            aria-label='Canciones'
                        />
                    </div>

                    <div className="space-y-2">
                        <div className="flex justify-between text-xs">
                            <span className="text-default-500">Eventos (mes)</span>
                            <span className="font-medium">{limits?.currentEventsThisMonth || 0} / {limits?.maxEventsPerMonth}</span>
                        </div>
                        <Progress
                            value={eventsUsage}
                            color={eventsUsage > 90 ? "danger" : "secondary"}
                            size="sm"
                            className="max-w-md"
                            aria-label='Eventos'
                        />
                    </div>
                </div>
            </CardBody>
        </Card>
    );
};
