import { Checkbox } from "@heroui/react";
import { DisplayOptionsProps } from '../../_interfaces/rehearsalControlsInterfaces';

export const DisplayOptions = ({
    showChords,
    noteType,
    onShowChordsChange,
    onNoteTypeChange,
}: DisplayOptionsProps) => {
    return (
        <div className="border-t border-slate-200 pt-4 dark:border-slate-700">
            <h4 className="mb-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
                Opciones de Visualización
            </h4>

            <div className="space-y-3">
                <Checkbox
                    color="secondary"
                    size="md"
                    isSelected={showChords}
                    onValueChange={onShowChordsChange}
                >
                    <span className="text-sm text-slate-700 dark:text-slate-100">
                        Mostrar Acordes
                    </span>
                </Checkbox>

                {showChords && (
                    <div className="ml-6">
                        <Checkbox
                            color="secondary"
                            size="sm"
                            isSelected={noteType === 'american'}
                            onValueChange={() => {
                                onNoteTypeChange(
                                    noteType === 'american' ? 'regular' : 'american',
                                );
                            }}
                        >
                            <span className="text-xs text-slate-600 dark:text-slate-300">
                                Notación Americana (A, B, C...)
                            </span>
                        </Checkbox>
                    </div>
                )}
            </div>
        </div>
    );
};
