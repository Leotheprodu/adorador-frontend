import { LyricsScaleControlsProps } from '../../_interfaces/rehearsalControlsInterfaces';

export const LyricsScaleControls = ({
    lyricsScale,
    onScaleChange,
}: LyricsScaleControlsProps) => {
    return (
        <div>
            <div className="mb-3 flex items-center justify-between">
                <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Tamaño de Letra
                </h4>
                <span className="rounded-lg bg-slate-100 px-3 py-1 text-sm font-bold text-slate-700 dark:bg-gray-900 dark:text-slate-100">
                    {lyricsScale}x
                </span>
            </div>
            <div className="flex items-center justify-center gap-3">
                <button
                    disabled={lyricsScale <= 0.5}
                    onClick={() => {
                        if (lyricsScale > 0.5) {
                            onScaleChange(lyricsScale - 0.25);
                        }
                    }}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-slate-200 bg-white text-xl font-bold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-gray-900 dark:text-slate-100 dark:hover:border-slate-600 dark:hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    -
                </button>
                <button
                    onClick={() => onScaleChange(1)}
                    className="rounded-lg border-2 border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-gray-900 dark:text-slate-100 dark:hover:border-slate-600 dark:hover:bg-gray-800"
                >
                    Normal
                </button>
                <button
                    disabled={lyricsScale >= 2}
                    onClick={() => {
                        if (lyricsScale < 2) {
                            onScaleChange(lyricsScale + 0.25);
                        }
                    }}
                    className="flex h-10 w-10 items-center justify-center rounded-lg border-2 border-slate-200 bg-white text-xl font-bold text-slate-700 transition-all hover:border-slate-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-gray-900 dark:text-slate-100 dark:hover:border-slate-600 dark:hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-40"
                >
                    +
                </button>
            </div>
        </div>
    );
};
