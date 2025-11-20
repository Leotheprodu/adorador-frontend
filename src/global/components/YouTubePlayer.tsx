/* eslint-disable @next/next/no-img-element */
'use client';

import { useStore } from '@nanostores/react';
import { useEffect, useRef, useState } from 'react';
import ReactPlayer from 'react-player';
import { Button } from '@nextui-org/react';
import {
  $activeYouTubePlayer,
  setActivePlayer,
  pauseActivePlayer,
} from '@global/stores/youtubePlayer';
import { PlayIcon } from '@global/icons';
import { extractYouTubeId, getYouTubeThumbnail } from '@global/utils/formUtils';

interface YouTubePlayerProps {
  youtubeUrl: string; // URL o ID de YouTube
  uniqueId: string; // Identificador único (ej: "post-123" o "comment-456")
  title?: string;
  artist?: string;
  showControls?: boolean;
  className?: string;
}

export const YouTubePlayer = ({
  youtubeUrl,
  uniqueId,
  title,
  artist,
  showControls = true,
  className = '',
}: YouTubePlayerProps) => {
  const activePlayer = useStore($activeYouTubePlayer);
  const playerRef = useRef<ReactPlayer>(null);
  const [showPlayer, setShowPlayer] = useState(false);

  // Extraer el ID de YouTube
  const youtubeId = extractYouTubeId(youtubeUrl);

  const isActive = activePlayer?.id === uniqueId;
  const isPlaying = isActive && activePlayer?.isPlaying;

  // Efecto para manejar cuando otro reproductor toma el control
  useEffect(() => {
    if (showPlayer && !isActive) {
      // Otro reproductor está activo, pausar este
      setShowPlayer(false);
    }
  }, [activePlayer, isActive, showPlayer]);

  if (!youtubeId) {
    return null;
  }

  const handlePlayPause = () => {
    if (!showPlayer) {
      // Mostrar el reproductor y activarlo
      setShowPlayer(true);
      setActivePlayer({
        id: uniqueId,
        youtubeId,
        isPlaying: true,
      });
    } else if (isPlaying) {
      // Pausar
      pauseActivePlayer();
    } else {
      // Reanudar
      setActivePlayer({
        id: uniqueId,
        youtubeId,
        isPlaying: true,
      });
    }
  };

  const handlePlay = () => {
    // Asegurarse de que este sea el reproductor activo
    if (!isActive) {
      setActivePlayer({
        id: uniqueId,
        youtubeId,
        isPlaying: true,
      });
    }
  };

  const handlePause = () => {
    pauseActivePlayer();
  };

  const thumbnail = getYouTubeThumbnail(youtubeUrl);

  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-content2 dark:bg-content3 ${className}`}
    >
      {!showPlayer ? (
        // Thumbnail con botón de play
        <div className="group relative flex aspect-video w-full cursor-pointer justify-center">
          <img
            src={thumbnail}
            alt={title || 'Video de YouTube'}
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />

          {/* Overlay oscuro */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

          {/* Botón de play centrado */}
          <div className="absolute inset-0 flex items-center justify-center">
            <Button
              isIconOnly
              size="lg"
              onClick={handlePlayPause}
              className="h-16 w-16 bg-brand-purple-600/90 text-white shadow-2xl backdrop-blur-sm transition-all duration-300 hover:scale-110 hover:bg-brand-purple-700 group-hover:h-20 group-hover:w-20"
              aria-label="Reproducir video"
            >
              <PlayIcon className="h-8 w-8" />
            </Button>
          </div>

          {/* Información del video */}
          {(title || artist) && (
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              {title && (
                <p className="line-clamp-1 text-sm font-semibold text-white">
                  {title}
                </p>
              )}
              {artist && (
                <p className="line-clamp-1 text-xs text-white/80">{artist}</p>
              )}
            </div>
          )}
        </div>
      ) : (
        // Reproductor activo - Más alto que el thumbnail
        <div className="relative w-full" style={{ height: '400px' }}>
          <ReactPlayer
            ref={playerRef}
            url={`https://www.youtube.com/watch?v=${youtubeId}`}
            playing={isPlaying}
            controls={showControls}
            width="100%"
            height="100%"
            onPlay={handlePlay}
            onPause={handlePause}
            config={{
              youtube: {
                playerVars: {
                  modestbranding: 1,
                  rel: 0,
                },
              },
            }}
          />
        </div>
      )}
    </div>
  );
};
