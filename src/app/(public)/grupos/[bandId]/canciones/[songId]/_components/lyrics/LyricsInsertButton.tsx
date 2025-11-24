import { LyricsInsertButtonProps } from '../../_interfaces/lyricsInterfaces';

export const LyricsInsertButton = ({ onClick, position }: LyricsInsertButtonProps) => {
    const text = position === 'before' ? 'Insertar letra aquí' : 'Insertar letra aquí';
    const marginClass = position === 'before' ? 'mb-1' : 'mt-1';

    return (
        <button
            onClick={onClick}
            className={`${marginClass} w-full rounded border-2 border-dashed border-slate-200 bg-slate-50/50 py-2 text-xs text-slate-500 opacity-50 transition-all hover:border-primary-400 hover:bg-primary-50 hover:text-primary-600 hover:opacity-100 dark:border-slate-700 dark:bg-gray-800 dark:text-slate-400 dark:hover:border-primary-400 dark:hover:bg-gray-900 dark:hover:text-primary-300`}
        >
            + {text}
        </button>
    );
};
