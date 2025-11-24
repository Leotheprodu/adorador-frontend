import { CalendarIcon, MusicNoteIcon, UsersIcon } from '@global/icons';
import { BandStatsProps } from '../_interfaces/bandCardInterfaces';

export const BandStats = ({
    eventCount,
    songCount,
    memberCount,
}: BandStatsProps) => {
    return (
        <div className="relative z-10 -mt-4 px-6">
            <div className="flex flex-wrap gap-2">
                <div className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5 backdrop-blur-sm dark:bg-brand-purple-900/60">
                    <CalendarIcon className="h-3 w-3 text-white dark:text-brand-blue-200" />
                    <span className="text-xs font-semibold text-white dark:text-brand-blue-100">
                        {eventCount} eventos
                    </span>
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5 backdrop-blur-sm dark:bg-brand-purple-900/60">
                    <MusicNoteIcon className="h-3 w-3 text-white dark:text-brand-pink-200" />
                    <span className="text-xs font-semibold text-white dark:text-brand-pink-100">
                        {songCount} canciones
                    </span>
                </div>
                <div className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5 backdrop-blur-sm dark:bg-brand-purple-900/60">
                    <UsersIcon className="h-3 w-3 text-white dark:text-brand-purple-200" />
                    <span className="text-xs font-semibold text-white dark:text-brand-purple-100">
                        {memberCount} miembros
                    </span>
                </div>
            </div>
        </div>
    );
};
