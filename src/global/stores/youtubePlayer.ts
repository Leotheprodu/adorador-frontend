import { atom } from 'nanostores';

interface ActiveYouTubePlayer {
  id: string; // Identificador único del video (postId-type o commentId-type)
  youtubeId: string; // ID del video de YouTube
  isPlaying: boolean;
}

/**
 * Store para controlar el reproductor de YouTube activo en el feed
 * Solo un video puede estar reproduciéndose a la vez
 */
export const $activeYouTubePlayer = atom<ActiveYouTubePlayer | null>(null);

/**
 * Establecer el reproductor activo
 */
export const setActivePlayer = (player: ActiveYouTubePlayer) => {
  $activeYouTubePlayer.set(player);
};

/**
 * Pausar el reproductor activo
 */
export const pauseActivePlayer = () => {
  const current = $activeYouTubePlayer.get();
  if (current) {
    $activeYouTubePlayer.set({ ...current, isPlaying: false });
  }
};

/**
 * Detener/limpiar el reproductor activo
 */
export const stopActivePlayer = () => {
  $activeYouTubePlayer.set(null);
};

/**
 * Verificar si un video específico está activo
 */
export const isPlayerActive = (id: string): boolean => {
  const current = $activeYouTubePlayer.get();
  return current?.id === id;
};

/**
 * Verificar si un video específico está reproduciéndose
 */
export const isPlayerPlaying = (id: string): boolean => {
  const current = $activeYouTubePlayer.get();
  return current?.id === id && current.isPlaying === true;
};
