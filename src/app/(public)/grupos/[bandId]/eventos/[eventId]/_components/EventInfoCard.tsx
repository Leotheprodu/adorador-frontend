import { CalendarIcon, ClockIcon } from '@global/icons';
import { formatDate, formatTime } from '@global/utils/dataFormat';
import { EventInfoCardProps } from '../_interfaces/eventAdminInterfaces';

export const EventInfoCard = ({
    event,
    isUpcoming,
    eventTimeLeft,
}: EventInfoCardProps) => {
    return (
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-purple-800 dark:bg-black/80">
            <div className="mb-4 flex items-center justify-between">
                <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                    {event.title}
                </h1>
                <div
                    className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold ${isUpcoming
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                            : 'bg-slate-100 text-slate-600 dark:bg-gray-900/60 dark:text-slate-300'
                        }`}
                >
                    {isUpcoming ? (
                        <>
                            <div className="h-2 w-2 rounded-full bg-emerald-500 dark:bg-emerald-300"></div>
                            <span>Próximo</span>
                        </>
                    ) : (
                        <span>Finalizado</span>
                    )}
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-4 dark:bg-gray-900/60">
                    <CalendarIcon className="h-5 w-5 text-slate-500 dark:text-slate-300" />
                    <div>
                        <p className="text-xs text-slate-500 dark:text-slate-300">Fecha</p>
                        <p className="font-semibold text-slate-900 dark:text-slate-100">
                            {formatDate(event.date, true)}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-4 dark:bg-gray-900/60">
                    <ClockIcon className="h-5 w-5 text-slate-500 dark:text-slate-300" />
                    <div>
                        <p className="text-xs text-slate-500 dark:text-slate-300">Hora</p>
                        <p className="font-semibold text-slate-900 dark:text-slate-100">
                            {formatTime(event.date)}
                        </p>
                    </div>
                </div>
            </div>

            {isUpcoming && eventTimeLeft && (
                <div className="mt-4 rounded-lg bg-gradient-to-r from-brand-purple-50 to-brand-blue-50 p-4 ring-1 ring-brand-purple-200/50 dark:from-brand-purple-900 dark:to-brand-blue-900 dark:ring-purple-800">
                    <p className="text-center text-sm font-semibold text-brand-purple-700 dark:text-slate-100">
                        ⏱️ Tiempo restante: {eventTimeLeft}
                    </p>
                </div>
            )}
        </div>
    );
};
