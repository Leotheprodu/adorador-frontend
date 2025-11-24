import { ArrowLeftIcon, ArrowRightIcon } from '@global/icons';
import { InlineTransposeControlsProps } from '../../_interfaces/lyricsInterfaces';

export const InlineTransposeControls = ({
    transpose,
    onTransposeChange,
}: InlineTransposeControlsProps) => {
    return (
        <div className="mb-4 rounded-xl bg-gradient-to-br from-brand-purple-50 to-brand-pink-50 p-4">
            <div className="mb-2 flex items-center justify-between">
                <h4 className="text-sm font-semibold text-slate-700">
                    🎹 Transposición
                </h4>
                <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-brand-purple-600 shadow-sm">
                    {transpose > 0 ? '+' : ''}
                    {transpose}
                </span>
            </div>
            <div className="flex items-center justify-center gap-3">
                <button
                    onClick={() => onTransposeChange(transpose - 1)}
                    className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-brand-purple-500 to-brand-blue-500 text-white shadow-md transition-all duration-200 hover:scale-110 hover:shadow-lg active:scale-95"
                >
                    <ArrowLeftIcon className="h-4 w-4" />
                </button>
                <button
                    onClick={() => onTransposeChange(0)}
                    className="rounded-lg bg-white px-4 py-2 text-xs font-semibold text-slate-700 shadow-sm transition-all hover:scale-105 hover:shadow-md active:scale-95"
                >
                    Resetear
                </button>
                <button
                    onClick={() => onTransposeChange(transpose + 1)}
                    className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-brand-purple-500 to-brand-blue-500 text-white shadow-md transition-all duration-200 hover:scale-110 hover:shadow-lg active:scale-95"
                >
                    <ArrowRightIcon className="h-4 w-4" />
                </button>
            </div>
            <p className="mt-2 text-center text-xs text-slate-600">
                Cambia la tonalidad sin modificar la canción
            </p>
        </div>
    );
};
