import { SubscriptionPage } from '@bands/[bandId]/suscripcion/_components/SubscriptionPage';

export default function Suscripcion({
    params,
}: {
    params: { bandId: string };
}) {
    return (
        <div className="flex h-full w-full flex-col items-center p-8 pb-20 sm:p-20">
            <SubscriptionPage params={params} />
        </div>
    );
}
