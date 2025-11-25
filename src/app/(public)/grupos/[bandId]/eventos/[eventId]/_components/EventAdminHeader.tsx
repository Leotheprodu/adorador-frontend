import { BackwardIcon } from '@global/icons/BackwardIcon';
import { EditEventButton } from '@bands/[bandId]/eventos/[eventId]/en-vivo/_components/EditEventButton';
import { DeleteEventButton } from '@bands/[bandId]/eventos/[eventId]/en-vivo/_components/DeleteEventButton';
import { useRouter } from 'next/navigation';
import { EventAdminHeaderProps } from '../_interfaces/eventAdminInterfaces';

export const EventAdminHeader = ({
    bandId,
    eventId,
    showActionButtons,
    isAdminEvent,
    refetch,
}: EventAdminHeaderProps) => {
    const router = useRouter();

    return (
        <div className="flex items-center justify-between">
            <button
                onClick={() => router.push(`/grupos/${bandId}/eventos`)}
                className="flex items-center gap-2 text-slate-600 transition-colors hover:text-brand-purple-600 dark:text-slate-200 dark:hover:text-brand-purple-300"
            >
                <BackwardIcon className="h-5 w-5" />
                <span>Volver a eventos</span>
            </button>

            {showActionButtons && (
                <div className="flex items-center gap-2">
                    <EditEventButton
                        bandId={bandId}
                        eventId={eventId}
                        refetch={refetch}
                        isAdminEvent={isAdminEvent}
                    />
                    <DeleteEventButton
                        bandId={bandId}
                        eventId={eventId}
                        isAdminEvent={isAdminEvent}
                    />
                </div>
            )}
        </div>
    );
};
