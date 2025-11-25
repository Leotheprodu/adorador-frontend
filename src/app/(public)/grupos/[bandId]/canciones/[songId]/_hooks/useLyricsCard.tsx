import { useState, useEffect, useRef } from 'react';

export const useLyricsCard = (isPracticeMode: boolean) => {
    const [updateLyric, setUpdateLyric] = useState(false);
    const [isDragging, setIsDragging] = useState(false);
    const prevIsDragging = useRef(false);

    const handleClickLyric = () => {
        // No permitir edición en modo práctica
        if (isPracticeMode) return;
        setUpdateLyric(!updateLyric);
    };

    const handleCloseEditor = () => {
        setUpdateLyric(false);
    };

    // Detectar cuando termina el drag y cerrar el editor
    useEffect(() => {
        // Si estaba arrastrando y ya no lo está (drag terminado)
        if (prevIsDragging.current && !isDragging) {
            setUpdateLyric(false);
        }
        prevIsDragging.current = isDragging;
    }, [isDragging]);

    return {
        updateLyric,
        isDragging,
        setIsDragging,
        handleClickLyric,
        handleCloseEditor,
    };
};
