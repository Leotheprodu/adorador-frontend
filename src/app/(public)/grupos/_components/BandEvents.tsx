import { CalendarIcon, ClockIcon } from '@global/icons';
import { IconButton } from '@global/components/buttons';
import { formatDate, formatTime } from '@global/utils/dataFormat';
import { BandEventsProps } from '../_interfaces/bandCardInterfaces';

export const BandEvents = ({
    events,
    currentEventIndex,
    isCurrentEvent,
    eventTimeLeft,
    onNextEvent,
    onPrevEvent,
}: BandEventsProps) => {
    if (events.length === 0) return null;

    const currentEvent = events[currentEventIndex];

    return (
        <div className="border-b border-slate-100 px-6 py-5 dark:border-brand-purple-900/60">
            <div className="mb-3 flex items-center justify-between">
                <h3 className="flex items-center gap-2 text-sm font-bold text-slate-700 dark:text-brand-purple-100">
                    <CalendarIcon className="h-4 w-4 text-brand-purple-600 dark:text-brand-purple-300" />
                    Próximos Eventos
                </h3>
                <span className="text-xs text-slate-500 dark:text-brand-purple-300">
                    {currentEventIndex + 1} / {events.length}
                </span>
            </div>

            <div className="flex items-center gap-3">
                {/* Botón anterior */}
                <IconButton
                    onClick={onPrevEvent}
                    disabled={currentEventIndex === 0}
                    variant="circular"
                    size="md"
                    ariaLabel="Evento anterior"
                >
                    <span className="font-bold dark:text-purple-300">‹</span>
                </IconButton>

                {/* Contenido del evento */}
                <div className="flex-1 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 p-4 shadow-sm ring-1 ring-slate-200/50 dark:from-brand-purple-950 dark:to-brand-purple-900 dark:ring-brand-purple-800/50">
                    <h4 className="mb-2 text-center font-semibold text-slate-800 dark:text-brand-purple-100">
                        {currentEvent.title}
                    </h4>
                    <div className="space-y-1 text-center text-xs text-slate-600 dark:text-brand-purple-200">
                        <p className="flex items-center justify-center gap-1 font-medium">
                            <CalendarIcon className="h-3 w-3" />
                            {formatDate(currentEvent.date, true)}
                        </p>
                        <p className="flex items-center justify-center gap-1">
                            <ClockIcon className="h-3 w-3" />
                            {formatTime(currentEvent.date)}
                        </p>
                    </div>
                    {isCurrentEvent && (
                        <div className="mt-2 flex items-center justify-center gap-1">
                            <span className="relative flex h-2 w-2">
                                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                            </span>
                            <span className="text-xs font-semibold text-green-600">Hoy</span>
                        </div>
                    )}
                    {/* Tiempo restante - Solo para eventos futuros */}
                    {eventTimeLeft && new Date(currentEvent.date) > new Date() && (
                        <div className="mt-2 rounded-lg bg-gradient-to-r from-brand-purple-50 to-brand-blue-50 px-3 py-2 ring-1 ring-brand-purple-200/50 dark:from-brand-purple-900 dark:to-brand-blue-900 dark:ring-brand-purple-800/50">
                            <p className="text-center text-xs font-semibold text-brand-purple-700 dark:text-brand-blue-100">
                                ⏱️ {eventTimeLeft}
                            </p>
                        </div>
                    )}
                </div>

                {/* Botón siguiente */}
                <IconButton
                    onClick={onNextEvent}
                    disabled={currentEventIndex === events.length - 1}
                    variant="circular"
                    size="md"
                    ariaLabel="Evento siguiente"
                >
                    <span className="font-bold dark:text-purple-300">›</span>
                </IconButton>
            </div>
        </div>
    );
};
