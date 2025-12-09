import { SubscriptionPage } from '@bands/[bandId]/suscripcion/_components/SubscriptionPage';

export default async function Suscripcion({
    params,
}: {
    params: Promise<{ bandId: string }>;
}) {
    const resolvedParams = await params;
    return (
        <div className="flex h-full w-full flex-col items-center p-8 pb-20 sm:p-20">
            <SubscriptionPage params={resolvedParams} />
        </div>
    );
}
