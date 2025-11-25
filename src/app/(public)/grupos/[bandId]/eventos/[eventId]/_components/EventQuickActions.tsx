import Link from 'next/link';
import { PlayIcon, UsersIcon } from '@global/icons';
import { EventQuickActionsProps } from '../_interfaces/eventAdminInterfaces';

export const EventQuickActions = ({ bandId, eventId }: EventQuickActionsProps) => {
    return (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {/* Ir al evento en vivo */}
            <Link
                href={`/grupos/${bandId}/eventos/${eventId}/en-vivo`}
                className="group relative overflow-hidden rounded-lg border border-brand-purple-200 bg-gradient-to-br from-brand-purple-50 to-brand-blue-50 p-6 shadow-sm transition-all duration-200 hover:shadow-md active:scale-[0.98] dark:border-purple-800 dark:from-brand-purple-900 dark:to-brand-blue-900"
            >
                <div className="flex items-center gap-4">
                    <div className="rounded-full bg-brand-purple-100 p-3 dark:bg-brand-purple-900/60">
                        <PlayIcon className="h-6 w-6 text-brand-purple-600 dark:text-brand-purple-200" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-900 group-hover:text-brand-purple-600 dark:text-slate-100 dark:group-hover:text-brand-purple-300">
                            Evento en Vivo
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-300">
                            Ver y controlar el evento
                        </p>
                    </div>
                </div>
            </Link>

            {/* Participantes (próximamente) */}
            <div className="group relative overflow-hidden rounded-lg border border-slate-200 bg-white p-6 opacity-60 shadow-sm dark:border-purple-800 dark:bg-gray-900/60">
                <div className="flex items-center gap-4">
                    <div className="rounded-full bg-slate-100 p-3 dark:bg-gray-800">
                        <UsersIcon className="h-6 w-6 text-slate-500 dark:text-slate-300" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-slate-700 dark:text-slate-100">
                            Participantes
                        </h3>
                        <p className="text-sm text-slate-500 dark:text-slate-300">
                            Próximamente
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
