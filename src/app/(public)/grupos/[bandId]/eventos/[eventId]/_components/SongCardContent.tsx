import { songTypes } from '@global/config/constants';
import { handleTranspose } from '@bands/[bandId]/eventos/[eventId]/en-vivo/_utils/handleTranspose';
import { SongCardContentProps } from '../_interfaces/songCardInterfaces';

export const SongCardContent = ({ data }: SongCardContentProps) => {
    return (
        <div className="flex-1">
            <p className="font-semibold text-slate-900 dark:text-slate-100">
                {data.song.title}
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                <span className="rounded-full bg-slate-100 px-2 py-0.5 text-slate-600">
                    {songTypes[data.song.songType].es}
                </span>
                {data.song.key !== null && (
                    <span className="rounded-full bg-brand-purple-100 px-2 py-0.5 font-medium text-brand-purple-700">
                        Tono: {handleTranspose(data.song.key, data.transpose)}
                    </span>
                )}
            </div>
        </div>
    );
};
