import { useEffect, useState } from 'react';
import { hasTempLyrics } from '../_utils/lyricsStorage';

export const useLyricsEditMode = (bandId: string, songId: string) => {
    const [isEditMode, setIsEditMode] = useState(false);
    const [isPracticeMode, setIsPracticeMode] = useState(true);

    // Detectar si hay letra guardada en localStorage y activar modo edición automáticamente
    useEffect(() => {
        const hasStored = hasTempLyrics(bandId, songId);
        if (hasStored) {
            setIsEditMode(true);
            setIsPracticeMode(false);
        }
    }, [bandId, songId]);

    // Escuchar cambios en el storage (cuando se elimina la letra guardada)
    useEffect(() => {
        const handleLyricsStorageChange = () => {
            const hasStored = hasTempLyrics(bandId, songId);
            if (!hasStored && isEditMode) {
                setIsEditMode(false);
                setIsPracticeMode(true);
            }
        };

        window.addEventListener('lyricsStorageChange', handleLyricsStorageChange);
        window.addEventListener('storage', handleLyricsStorageChange);

        return () => {
            window.removeEventListener('lyricsStorageChange', handleLyricsStorageChange);
            window.removeEventListener('storage', handleLyricsStorageChange);
        };
    }, [bandId, songId, isEditMode]);

    return {
        isEditMode,
        setIsEditMode,
        isPracticeMode,
        setIsPracticeMode,
    };
};
