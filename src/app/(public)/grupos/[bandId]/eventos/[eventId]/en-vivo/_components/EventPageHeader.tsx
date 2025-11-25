import { BackwardIcon } from '@global/icons/BackwardIcon';
import { EditEventButton } from './EditEventButton';
import { DeleteEventButton } from './DeleteEventButton';
import { EventPageHeaderProps } from '../_interfaces/liveEventInterfaces';

export const EventPageHeader = ({
    bandId,
    eventId,
    onBack,
    showActionButtons,
    isAdminEvent,
    refetch,
}: EventPageHeaderProps) => {
    return (
        <div className="mb-4 w-full rounded-2xl bg-gradient-to-br from-brand-purple-50 via-white to-brand-blue-50 p-4 shadow-sm backdrop-blur-sm sm:mb-6 dark:bg-gradient-to-br dark:from-brand-purple-900/30 dark:via-black/30 dark:to-brand-blue-900/30">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <button
                        onClick={onBack}
                        className="group flex items-center justify-center gap-2 rounded-lg bg-white/80 p-2 shadow-sm transition-all duration-200 hover:scale-105 hover:bg-brand-purple-50 hover:shadow-md active:scale-95"
                        aria-label="Volver a eventos"
                    >
                        <BackwardIcon />
                        <small className="hidden text-xs font-medium text-brand-purple-700 sm:group-hover:block">
                            Volver
                        </small>
                    </button>
                    <div>
                        <h1 className="bg-gradient-to-r from-brand-purple-600 to-brand-blue-600 bg-clip-text text-xl font-bold text-transparent sm:text-2xl">
                            Evento en Vivo
                        </h1>
                        <p className="text-xs text-slate-500">Panel de control musical</p>
                    </div>
                </div>

                {/* Botones de admin con mejor diseño */}
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
        </div>
    );
};
