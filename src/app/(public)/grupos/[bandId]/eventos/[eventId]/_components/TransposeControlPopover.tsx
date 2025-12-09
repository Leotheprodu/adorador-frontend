import { Button, Popover, PopoverContent, PopoverTrigger } from "@heroui/react";
import { ArrowsUpDownIconIcon } from '@global/icons/ArrowsUpDownIcon';
import { handleTranspose } from '@bands/[bandId]/eventos/[eventId]/en-vivo/_utils/handleTranspose';
import { TransposeControlPopoverProps } from '../_interfaces/songCardInterfaces';

export const TransposeControlPopover = ({
    data,
    index,
    songOrder,
    setSongOrder,
}: TransposeControlPopoverProps) => {
    const handleTransposeUp = () => {
        if (data.transpose >= 6) return;
        const updatedSongs = [...songOrder];
        updatedSongs[index].transpose += 1;
        setSongOrder(updatedSongs);
    };

    const handleTransposeDown = () => {
        if (data.transpose <= -6) return;
        const updatedSongs = [...songOrder];
        updatedSongs[index].transpose -= 1;
        setSongOrder(updatedSongs);
    };

    if (data.song.key === null) return null;

    return (
        <Popover placement="top">
            <PopoverTrigger>
                <button
                    className="flex items-center justify-center rounded-full p-2 transition-all duration-200 hover:scale-110 hover:bg-brand-purple-100 active:scale-95"
                    title="Cambiar tonalidad"
                    onClick={(e) => e.stopPropagation()}
                >
                    <ArrowsUpDownIconIcon className="h-5 w-5 text-brand-purple-600" />
                </button>
            </PopoverTrigger>
            <PopoverContent className="w-64 dark:border-1 dark:border-brand-purple-600">
                <div className="w-full p-3">
                    {/* Header */}
                    <div className="mb-2 flex items-center gap-2">
                        <div className="flex h-6 w-6 items-center justify-center rounded-lg bg-gradient-to-br from-brand-purple-500 to-brand-blue-500">
                            <ArrowsUpDownIconIcon className="h-3 w-3 text-white" />
                        </div>
                        <div>
                            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-100">
                                Cambiar Tonalidad
                            </h4>
                        </div>
                    </div>

                    {/* Current Key Info */}
                    <div className="dark:bg-grandient-to-br mb-2 rounded-lg bg-gradient-to-br from-brand-purple-50 via-white to-brand-blue-50 p-2 shadow-sm dark:from-brand-purple-900 dark:via-gray-900 dark:to-brand-blue-900">
                        <div className="flex items-center justify-between">
                            <span className="text-[10px] font-semibold text-slate-600 dark:text-slate-100">
                                Actual:
                            </span>
                            <span className="rounded-full bg-brand-purple-600 px-2 py-0.5 text-xs font-bold text-white shadow-sm">
                                {handleTranspose(data.song.key, data.transpose)}
                            </span>
                        </div>
                        <div className="mt-1 text-[10px] text-slate-500 dark:text-slate-100">
                            {data.transpose === 0 ? (
                                <span>✓ Tonalidad original</span>
                            ) : (
                                <span>
                                    🎵 Transpuesta {Math.abs(data.transpose)}{' '}
                                    {Math.abs(data.transpose) === 1 ? 'semitono' : 'semitonos'}{' '}
                                    {data.transpose > 0 ? '↑' : '↓'}
                                    <span className="text-brand-purple-600">
                                        {' '}
                                        (original: {data.song.key})
                                    </span>
                                </span>
                            )}
                        </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex w-full items-center gap-2">
                        <Button
                            isDisabled={data.transpose === 6}
                            variant="flat"
                            size="sm"
                            className={`flex-1 text-xs font-semibold transition-all duration-200 ${data.transpose === 6
                                    ? 'bg-slate-100 text-slate-400'
                                    : 'bg-gradient-to-r from-green-500 to-emerald-500 text-white hover:scale-105 hover:shadow-md'
                                }`}
                            onPress={handleTransposeUp}
                        >
                            ↑ Subir
                        </Button>
                        <Button
                            isDisabled={data.transpose === -6}
                            variant="flat"
                            size="sm"
                            className={`flex-1 text-xs font-semibold transition-all duration-200 ${data.transpose === -6
                                    ? 'bg-slate-100 text-slate-400'
                                    : 'bg-gradient-to-r from-red-500 to-rose-500 text-white hover:scale-105 hover:shadow-md'
                                }`}
                            onPress={handleTransposeDown}
                        >
                            ↓ Bajar
                        </Button>
                    </div>

                    {/* Helper Text */}
                    {(data.transpose === 6 || data.transpose === -6) && (
                        <p className="mt-1.5 text-center text-[10px] text-orange-600">
                            ⚠️ Límite alcanzado
                        </p>
                    )}
                </div>
            </PopoverContent>
        </Popover>
    );
};
