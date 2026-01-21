import { useStore } from '@nanostores/react';
import { useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import {
  $activeYouTubePlayer,
  setActivePlayer,
  pauseActivePlayer,
} from '@global/stores/youtubePlayer';
import { extractYouTubeId, getYouTubeThumbnail } from '@global/utils/formUtils';

interface UseYouTubePlayerProps {
  youtubeUrl: string;
  uniqueId: string;
  autoplay?: boolean;
  onEnd?: () => void;
}

export const useYouTubePlayer = ({
  youtubeUrl,
  uniqueId,
  autoplay = false,
  onEnd,
}: UseYouTubePlayerProps) => {
  const activePlayer = useStore($activeYouTubePlayer);
  const playerRef = useRef<ReactPlayer>(null);
  const [showPlayer, setShowPlayer] = useState(false);
  const [playing, setPlaying] = useState(false);

  // Extraer el ID de YouTube
  const youtubeId = extractYouTubeId(youtubeUrl);
  const thumbnail = getYouTubeThumbnail(youtubeId, 'maxresdefault');

  const isActive = activePlayer?.id === uniqueId;
  const isPlaying = isActive && activePlayer?.isPlaying;

  // Reset state when song/video changes - MISMO PATRÓN QUE MUSIC PLAYER
  useEffect(() => {
    if (autoplay && youtubeId) {
      setShowPlayer(true);
      setPlaying(true); // Auto-play cuando cambia el video
      setActivePlayer({
        id: uniqueId,
        youtubeId: youtubeId,
        isPlaying: true,
      });
    }
  }, [autoplay, youtubeId, uniqueId]); // Dependencia en youtubeId para detectar cambios

  // Efecto para manejar cuando otro reproductor toma el control
  useEffect(() => {
    if (showPlayer && !isActive) {
      // Otro reproductor está activo, pausar este
      setShowPlayer(false);
      setPlaying(false);
    }
  }, [activePlayer, isActive, showPlayer]);

  const handlePlayPause = () => {
    if (!showPlayer) {
      // Mostrar el reproductor y activarlo
      setShowPlayer(true);
      setPlaying(true);
      setActivePlayer({
        id: uniqueId,
        youtubeId: youtubeId || '',
        isPlaying: true,
      });
    } else if (isPlaying) {
      // Pausar
      setPlaying(false);
      pauseActivePlayer();
    } else {
      // Reanudar
      setPlaying(true);
      setActivePlayer({
        id: uniqueId,
        youtubeId: youtubeId || '',
        isPlaying: true,
      });
    }
  };

  const handlePlay = () => {
    setPlaying(true);
    // Asegurarse de que este sea el reproductor activo
    if (!isActive) {
      setActivePlayer({
        id: uniqueId,
        youtubeId: youtubeId || '',
        isPlaying: true,
      });
    }
  };

  const handlePause = () => {
    setPlaying(false);
    pauseActivePlayer();
  };

  const handleEnd = () => {
    setPlaying(false);
    pauseActivePlayer();
    if (onEnd) {
      onEnd();
    }
  };

  return {
    playerRef,
    showPlayer,
    youtubeId,
    thumbnail,
    playing, // Retornar el estado local de playing
    isPlaying,
    handlePlayPause,
    handlePlay,
    handlePause,
    handleEnd,
  };
};
