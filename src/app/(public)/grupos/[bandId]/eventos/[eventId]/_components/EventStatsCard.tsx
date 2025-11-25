import { EventStatsCardProps } from '../_interfaces/eventAdminInterfaces';

export const EventStatsCard = ({ event, isUpcoming }: EventStatsCardProps) => {
    return (
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-purple-800 dark:bg-black/80">
            <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
                Información del Evento
            </h2>
            <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-lg bg-slate-50 p-4 dark:bg-gray-900/60">
                    <p className="text-sm text-slate-500 dark:text-slate-300">Canciones</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                        {event.songs?.length || 0}
                    </p>
                </div>
                <div className="rounded-lg bg-slate-50 p-4 dark:bg-gray-900/60">
                    <p className="text-sm text-slate-500 dark:text-slate-300">Estado</p>
                    <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                        {isUpcoming ? '🟢 Activo' : '⚪ Finalizado'}
                    </p>
                </div>
                <div className="rounded-lg bg-slate-50 p-4 dark:bg-gray-900/60">
                    <p className="text-sm text-slate-500 dark:text-slate-300">
                        ID del Evento
                    </p>
                    <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
                        #{event.id}
                    </p>
                </div>
            </div>
        </div>
    );
};
