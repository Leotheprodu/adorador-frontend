import { ArrowLeftIcon, ArrowRightIcon } from '@global/icons';
import { TransposeControlsProps } from '../../_interfaces/rehearsalControlsInterfaces';

export const TransposeControls = ({
    transpose,
    onTransposeChange,
}: TransposeControlsProps) => {
    return (
        <div>
            <div className="mb-3 flex items-center justify-between">
                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Transposición
                </h4>
                <span className="rounded-lg bg-slate-100 px-3 py-1 text-sm font-bold text-slate-700 dark:bg-gray-900 dark:text-slate-100">
                    {transpose > 0 ? '+' : ''}
                    {transpose}
                </span>
            </div>
            <div className="flex items-center justify-center gap-3">
                <button
                    onClick={() => onTransposeChange(transpose - 1)}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-slate-200 bg-white text-slate-700 transition-all hover:border-brand-purple-300 hover:bg-brand-purple-50 dark:border-slate-700 dark:bg-gray-900 dark:text-slate-100 dark:hover:border-brand-purple-400 dark:hover:bg-gray-800"
                >
                    <ArrowLeftIcon className="h-4 w-4" />
                </button>
                <button
                    onClick={() => onTransposeChange(0)}
                    className="rounded-lg border-2 border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-gray-900 dark:text-slate-100 dark:hover:border-slate-600 dark:hover:bg-gray-800"
                >
                    Resetear
                </button>
                <button
                    onClick={() => onTransposeChange(transpose + 1)}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-slate-200 bg-white text-slate-700 transition-all hover:border-brand-purple-300 hover:bg-brand-purple-50 dark:border-slate-700 dark:bg-gray-900 dark:text-slate-100 dark:hover:border-brand-purple-400 dark:hover:bg-gray-800"
                >
                    <ArrowRightIcon className="h-4 w-4" />
                </button>
            </div>
            <p className="mt-2 text-center text-xs text-slate-500 dark:text-slate-400">
                Cambia la tonalidad sin modificar la canción
            </p>
        </div>
    );
};
