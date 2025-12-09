import { Checkbox } from "@heroui/react";
import { InlineDisplayTogglesProps } from '../../_interfaces/lyricsInterfaces';

export const InlineDisplayToggles = ({
    showChords,
    onShowChordsChange,
    noteType,
    onNoteTypeChange,
}: InlineDisplayTogglesProps) => {
    return (
        <div className="space-y-3 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 p-4">
            <Checkbox
                color="secondary"
                size="md"
                isSelected={showChords}
                onValueChange={onShowChordsChange}
            >
                <span className="text-sm font-semibold text-slate-700">
                    🎸 Mostrar Acordes
                </span>
            </Checkbox>

            {showChords && (
                <Checkbox
                    color="secondary"
                    size="md"
                    isSelected={noteType === 'american'}
                    onValueChange={(checked) =>
                        onNoteTypeChange(checked ? 'american' : 'regular')
                    }
                >
                    <span className="text-sm font-semibold text-slate-700">
                        🔤 Acordes Cifrados (A, B, C...)
                    </span>
                </Checkbox>
            )}
        </div>
    );
};
