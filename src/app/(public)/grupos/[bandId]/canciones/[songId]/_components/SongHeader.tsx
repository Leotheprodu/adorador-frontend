import { BackwardIcon } from '@global/icons/BackwardIcon';
import { SongHeaderProps } from '../_interfaces/songIdInterfaces';

export const SongHeader = ({ onBack }: SongHeaderProps) => {
    return (
        <section className="mb-6 w-full max-w-4xl px-4">
            <div className="mb-4 flex items-center gap-3">
                <button
                    onClick={onBack}
                    className="group flex items-center justify-center gap-2 rounded-xl bg-white/80 p-3 shadow-sm transition-all duration-200 hover:scale-105 hover:bg-brand-purple-50 hover:shadow-md active:scale-95 dark:bg-gray-900 dark:text-slate-100 dark:hover:bg-gray-800"
                >
                    <BackwardIcon />
                    <small className="hidden text-xs font-medium text-brand-purple-700 sm:group-hover:block dark:text-brand-purple-300">
                        Volver a canciones
                    </small>
                </button>
                <h1 className="bg-gradient-to-r from-brand-purple-600 to-brand-blue-600 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl dark:bg-gradient-to-r dark:from-brand-purple-300 dark:to-brand-blue-300">
                    Detalles de Canción
                </h1>
            </div>
        </section>
    );
};
