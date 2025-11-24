export interface TransposeControlsProps {
    transpose: number;
    onTransposeChange: (value: number) => void;
}

export interface LyricsScaleControlsProps {
    lyricsScale: number;
    onScaleChange: (value: number) => void;
}

export interface DisplayOptionsProps {
    showChords: boolean;
    noteType: 'regular' | 'american';
    onShowChordsChange: (value: boolean) => void;
    onNoteTypeChange: (value: 'regular' | 'american') => void;
}

export interface EventConfig {
    showChords: boolean;
    lyricsScale: number;
}

export interface ChordPreferences {
    noteType: 'regular' | 'american';
    useFlats: boolean;
}
