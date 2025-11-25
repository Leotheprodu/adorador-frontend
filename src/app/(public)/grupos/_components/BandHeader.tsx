import { GuitarIcon, EditIcon, TrashIcon } from '@global/icons';
import { IconButton } from '@global/components/buttons';
import { BandHeaderProps } from '../_interfaces/bandCardInterfaces';

export const BandHeader = ({
    name,
    isUserAuthorized,
    onEditOpen,
    onDeleteOpen,
}: BandHeaderProps) => {
    return (
        <div className="relative overflow-hidden bg-brand-purple-600 px-6 py-8 dark:bg-brand-purple-950">
            {/* Patrón de fondo con GuitarIcon */}
            <div className="absolute inset-0 opacity-10">
                <GuitarIcon className="absolute -right-16 -top-8 h-64 w-64 rotate-12 text-white dark:text-brand-purple-200" />
                <div className="absolute left-0 top-0 h-32 w-32 rounded-full bg-white blur-3xl dark:bg-brand-purple-200/40"></div>
                <div className="absolute bottom-0 right-0 h-32 w-32 rounded-full bg-white blur-3xl dark:bg-brand-purple-200/40"></div>
            </div>

            {/* Contenido del header */}
            <div className="relative z-10">
                <div className="mb-2 flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm dark:bg-brand-purple-800/40">
                        <GuitarIcon className="h-5 w-5 text-white dark:text-brand-purple-200" />
                    </div>
                    <h2 className="flex-1 text-2xl font-bold text-white dark:text-brand-pink-200">
                        {name}
                    </h2>
                    {/* Botones de administración */}
                    {isUserAuthorized && (
                        <div className="flex gap-2">
                            <IconButton
                                onClick={onEditOpen}
                                variant="circular"
                                size="sm"
                                ariaLabel="Editar grupo"
                                className="border border-white/30 bg-white/10 text-white shadow-lg backdrop-blur-md transition-all hover:scale-105 hover:border-white/50 hover:bg-white/20 hover:shadow-xl dark:border-brand-purple-300/30 dark:bg-brand-purple-800/30 dark:text-brand-purple-100 dark:hover:border-brand-purple-200 dark:hover:bg-brand-purple-700/40"
                            >
                                <EditIcon className="h-4 w-4" />
                            </IconButton>
                            <IconButton
                                onClick={onDeleteOpen}
                                variant="circular"
                                size="sm"
                                ariaLabel="Eliminar grupo"
                                className="border border-white/30 bg-white/10 text-white shadow-lg backdrop-blur-md transition-all hover:scale-105 hover:border-red-300/50 hover:bg-red-500/30 hover:shadow-xl dark:border-brand-pink-400/30 dark:bg-brand-pink-900/30 dark:text-brand-pink-100 dark:hover:border-brand-pink-200 dark:hover:bg-brand-pink-800/40"
                            >
                                <TrashIcon className="h-4 w-4" />
                            </IconButton>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
