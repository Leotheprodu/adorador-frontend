/**
 * Formatea segundos a formato MM:SS
 */
export const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    const formattedSeconds =
        remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;
    return `${minutes}:${formattedSeconds}`;
};

/**
 * Formatea la duración del video (ajustado para restar 1 segundo)
 */
export const formatDuration = (seconds: number): string => {
    const adjustedSeconds = Math.max(0, seconds - 1);
    const minutes = Math.floor(adjustedSeconds / 60);
    const remainingSeconds = Math.floor(adjustedSeconds % 60);
    const formattedSeconds =
        remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;
    return `${minutes}:${formattedSeconds}`;
};

/**
 * Formatea el progreso del video
 */
export const formatProgress = (playedSeconds: number): string => {
    const minutes = Math.floor(playedSeconds / 60);
    const remainingSeconds = Math.floor(playedSeconds % 60);

    const formattedSeconds =
        remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;

    return `${minutes}:${formattedSeconds}`;
};
