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
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = (seconds % 60) - 1;
    const formattedSeconds =
        remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;
    return `${minutes}:${formattedSeconds}`;
};

/**
 * Formatea el progreso del video con lógica especial para minutos
 */
export const formatProgress = (playedSeconds: number): string => {
    let minutes = 0;
    const remainingSeconds = Math.ceil(playedSeconds % 60) % 60;

    if (playedSeconds < 59 && minutes === 0) {
        minutes = Math.floor(playedSeconds / 60);
    } else if (remainingSeconds === 0 && minutes === 0 && playedSeconds > 0) {
        minutes = Math.floor(playedSeconds / 60) + 1;
    } else if (remainingSeconds === 0 && playedSeconds >= 60) {
        minutes = Math.floor(playedSeconds / 60) + 1;
    } else {
        minutes = Math.floor(playedSeconds / 60);
    }

    const formattedSeconds =
        remainingSeconds < 10 ? `0${remainingSeconds}` : `${remainingSeconds}`;

    return `${minutes}:${formattedSeconds}`;
};
