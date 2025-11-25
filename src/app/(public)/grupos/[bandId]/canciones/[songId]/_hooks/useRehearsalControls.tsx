import { useEffect, useState } from 'react';
import { useStore } from '@nanostores/react';
import { $eventConfig, $chordPreferences } from '@stores/event';
import {
    getLocalStorage,
    setLocalStorage,
} from '@global/utils/handleLocalStorage';

export const useRehearsalControls = (songId: string) => {
    const eventConfig = useStore($eventConfig);
    const chordConfig = useStore($chordPreferences);
    const [transpose, setTranspose] = useState(0);

    // Cargar configuración global al montar
    useEffect(() => {
        if (getLocalStorage('eventConfig')) {
            $eventConfig.set(getLocalStorage('eventConfig'));
        }
        if (getLocalStorage('chordPreferences')) {
            $chordPreferences.set(getLocalStorage('chordPreferences'));
        }
    }, []);

    // Cargar transposición específica de esta canción
    useEffect(() => {
        const storageKey = `songTranspose_${songId}`;
        const stored = localStorage.getItem(storageKey);
        if (stored) {
            setTranspose(parseInt(stored));
        } else {
            setTranspose(0);
        }
    }, [songId]);

    // Handlers
    const handleTransposeChange = (newTranspose: number) => {
        setTranspose(newTranspose);
        const storageKey = `songTranspose_${songId}`;
        localStorage.setItem(storageKey, newTranspose.toString());
    };

    const handleLyricsScaleChange = (newScale: number) => {
        $eventConfig.set({
            ...eventConfig,
            lyricsScale: newScale,
        });
        setLocalStorage('eventConfig', {
            ...eventConfig,
            lyricsScale: newScale,
        });
    };

    const handleShowChordsChange = (value: boolean) => {
        $eventConfig.set({
            ...eventConfig,
            showChords: value,
        });
        setLocalStorage('eventConfig', {
            ...eventConfig,
            showChords: value,
        });
    };

    const handleNoteTypeChange = (value: 'regular' | 'american') => {
        $chordPreferences.set({
            ...chordConfig,
            noteType: value,
        });
        setLocalStorage('chordPreferences', {
            ...chordConfig,
            noteType: value,
        });
    };

    return {
        transpose,
        eventConfig,
        chordConfig,
        handleTransposeChange,
        handleLyricsScaleChange,
        handleShowChordsChange,
        handleNoteTypeChange,
    };
};
