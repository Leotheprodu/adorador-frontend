import { LyricsProps } from '@bands/[bandId]/eventos/_interfaces/eventsInterface';

export interface SongIdParams {
    bandId: string;
    songId: string;
}

export interface SongHeaderProps {
    onBack: () => void;
}

export interface LyricsSectionProps {
    params: SongIdParams;
    songTitle?: string;
    lyrics: LyricsProps[] | undefined;
    lyricsGrouped: [string, LyricsProps[]][];
    isEditMode: boolean;
    isPracticeMode: boolean;
    transpose: number;
    showChords: boolean;
    lyricsScale: number;
    chordPreferences: {
        useFlats: boolean;
        [key: string]: unknown;
    };
    refetchLyricsOfCurrentSong: () => void;
    mutateUploadLyricsByFile: (file: FormData) => void;
    onEditModeChange: (value: boolean) => void;
}
