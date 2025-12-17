'use client';

import { YouTubePlayer } from '@global/components/YouTubePlayer';
import { SongNavigationButtons } from '@bands/[bandId]/eventos/[eventId]/en-vivo/_components/SongNavigationButtons';
import { VideoProgressBar } from '@bands/[bandId]/eventos/[eventId]/en-vivo/_components/VideoProgressBar';
import { useEventGateway } from '@bands/[bandId]/eventos/[eventId]/en-vivo/_hooks/useEventGateway';
import { Chip } from '@heroui/react';
import { EventSongsProps } from '@bands/[bandId]/eventos/_interfaces/eventsInterface';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { useStore } from '@nanostores/react';
import {
  $videoProgress,
  $videoProgressDuration,
  $videoDuration,
  $videoPlayerReady,
} from '@stores/videoPlayer';
import { $videoLyricsPlayerRef } from '@stores/videoLyricsPlayer';
import type ReactPlayer from 'react-player';

interface VideoLyricsEventPlayerProps {
  currentSong: EventSongsProps | null;
  onNext: () => void;
  onPrevious: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
  isEventManager: boolean;
  isFullscreen: boolean;
  bandId: string;
  activateFullscreen?: () => void;
}

type VideoLyric = NonNullable<EventSongsProps['song']['videoLyrics']>[number];

/**
 * Selecciona el video a mostrar según prioridad:
 * 1. Video marcado como preferido
 * 2. Video con menor número de prioridad (1 es mayor prioridad que 2)
 */
const selectVideo = (
  videos?: EventSongsProps['song']['videoLyrics'],
): VideoLyric | null => {
  if (!videos || videos.length === 0) return null;

  // Buscar video preferido
  const preferred = videos.find((v) => v.isPreferred);
  if (preferred) return preferred;

  // Ordenar por prioridad ascendente (menor número = mayor prioridad)
  const sorted = [...videos].sort((a, b) => a.priority - b.priority);
  return sorted[0];
};

export const VideoLyricsEventPlayer = ({
  currentSong,
  onNext,
  onPrevious,
  hasNext,
  hasPrevious,
  isEventManager,
  isFullscreen,
  bandId,
  activateFullscreen,
}: VideoLyricsEventPlayerProps) => {
  const playerRef = useRef<ReactPlayer>(null);
  const [currentVideoId, setCurrentVideoId] = useState<string>('');
  const [showOverlay, setShowOverlay] = useState(true);
  const { sendMessage } = useEventGateway();

  // Use global stores for progress (shared with EventControls)
  const progress = useStore($videoProgress);
  const progressDuration = useStore($videoProgressDuration);
  const duration = useStore($videoDuration);

  // Store playerRef globally for WebSocket access
  useEffect(() => {
    $videoLyricsPlayerRef.set(playerRef);
    return () => {
      $videoLyricsPlayerRef.set(null);
    };
  }, []);

  // Reset video player ready state when component unmounts
  useEffect(() => {
    return () => {
      $videoPlayerReady.set(false);
      $videoProgress.set(0);
      $videoProgressDuration.set('0:00');
      $videoDuration.set('0:00');
    };
  }, []);

  // Format time helpers
  const formatDuration = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleProgress = ({
    played,
    playedSeconds,
  }: {
    played: number;
    playedSeconds: number;
  }) => {
    $videoProgress.set(played);
    $videoProgressDuration.set(formatDuration(playedSeconds));
  };

  const handleDuration = (seconds: number) => {
    $videoDuration.set(formatDuration(seconds));
    $videoPlayerReady.set(true); // Mark player as ready
  };

  const handleSeek = (value: number) => {
    if (!playerRef.current) return;

    // Emit WebSocket event for synchronization
    if (isEventManager && sendMessage) {
      sendMessage({
        type: 'videoSeek',
        data: {
          seekTo: value, // 0 to 1
        },
      });
    }

    // Apply seek locally
    const player = playerRef.current.getInternalPlayer();
    if (player && player.getDuration) {
      const seekTime = value * player.getDuration();
      player.seekTo(seekTime);
    }
  };

  // Auto-fullscreen del CONTENEDOR cuando cambia la canción (más confiable que YouTube iframe)
  useEffect(() => {
    const selectedVideo = selectVideo(currentSong?.song.videoLyrics);

    if (selectedVideo && selectedVideo.youtubeId !== currentVideoId) {
      setCurrentVideoId(selectedVideo.youtubeId);
      setShowOverlay(true); // Mostrar overlay cuando cambia la canción

      // Activar fullscreen del contenedor
      if (!isFullscreen && activateFullscreen) {
        setTimeout(() => {
          activateFullscreen();
        }, 300); // Pequeño delay para smoothness
      }
    }
  }, [currentSong, currentVideoId, isFullscreen, activateFullscreen]);

  // Listen for video seek events from WebSocket (only apply if NOT event manager and in projector mode)
  useEffect(() => {
    const handleVideoSeekReceived = (
      event: CustomEvent<{ seekTo: number }>,
    ) => {
      // Only apply external seek if:
      // 1. We're NOT the event manager (they control the seek)
      // 2. The video player is ready
      if (!isEventManager && playerRef.current) {
        const { seekTo } = event.detail;
        const player = playerRef.current.getInternalPlayer();
        if (player && player.getDuration) {
          const duration = player.getDuration();
          const seekTime = seekTo * duration;
          player.seekTo(seekTime);
        }
      }
    };

    window.addEventListener(
      'videoSeekReceived',
      handleVideoSeekReceived as EventListener,
    );
    return () => {
      window.removeEventListener(
        'videoSeekReceived',
        handleVideoSeekReceived as EventListener,
      );
    };
  }, [isEventManager]);

  // Broadcast progress periodically if in projector mode (so event manager can see progress)
  useEffect(() => {
    // Only broadcast when VideoLyricsEventPlayer is mounted (projector mode)
    // Don't need fullscreen - just need to be in projector mode with a video
    if (!currentSong) {
      return;
    }

    const intervalId = setInterval(() => {
      const currentProgress = $videoProgress.get();
      const currentProgressDuration = $videoProgressDuration.get();
      const currentDuration = $videoDuration.get();

      // Emit progress update via WebSocket
      if (sendMessage) {
        sendMessage({
          type: 'videoProgress',
          data: {
            progress: currentProgress,
            progressDuration: currentProgressDuration,
            duration: currentDuration,
          },
        });
      }
    }, 2000); // Broadcast every 2 seconds

    return () => {
      clearInterval(intervalId);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentSong?.song?.id]); // Only depend on song ID, not sendMessage

  // Auto-hide overlay después de 5 segundos en fullscreen
  useEffect(() => {
    if (isFullscreen && showOverlay) {
      const timer = setTimeout(() => {
        setShowOverlay(false);
      }, 5000); // 5 segundos

      return () => clearTimeout(timer);
    } else if (!isFullscreen && !showOverlay) {
      // Mostrar overlay si no está en fullscreen
      setShowOverlay(true);
    }
  }, [isFullscreen, showOverlay]);

  if (!currentSong) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-8 text-center">
        <h2
          className={`font-momotrust ${isFullscreen ? 'text-4xl' : 'text-2xl'} text-white`}
        >
          No hay canción seleccionada
        </h2>
        <p className="text-white/70">Selecciona una canción para comenzar</p>
      </div>
    );
  }

  const selectedVideo = selectVideo(currentSong.song.videoLyrics);

  if (!selectedVideo) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-6 p-8 text-center">
        <h2
          className={`font-momotrust ${isFullscreen ? 'text-4xl md:text-6xl' : 'text-2xl md:text-4xl'} text-white`}
        >
          {currentSong.song.title}
        </h2>

        <div className="flex flex-col gap-4">
          <p
            className={`text-white/70 ${isFullscreen ? 'text-2xl' : 'text-lg'}`}
          >
            Esta canción no tiene videos configurados
          </p>

          {isEventManager && (
            <Link
              href={`/grupos/${bandId}/canciones/${currentSong.song.id}`}
              target="_blank"
              className="rounded-lg bg-brand-purple-500 px-6 py-3 text-white transition-colors hover:bg-brand-purple-600"
            >
              Agregar videos a esta canción
            </Link>
          )}
        </div>

        <SongNavigationButtons
          hasPreviousSong={hasPrevious}
          hasNextSong={hasNext}
          onPrevious={onPrevious}
          onNext={onNext}
          onMainAction={onNext}
          mainActionIcon="start"
          isEventManager={isEventManager}
          isFullscreen={isFullscreen}
        />
      </div>
    );
  }

  // Crear key única para forzar re-render cuando cambia el video
  const playerKey = `${currentSong.song.id}-${selectedVideo.youtubeId}`;

  return (
    <div className="relative flex h-full w-full flex-col items-center justify-center">
      {/* YouTube Player - Full size, sin controles de YouTube */}
      <div className="relative h-full w-full">
        <YouTubePlayer
          key={playerKey}
          youtubeUrl={selectedVideo.youtubeId}
          uniqueId={`event-video-${currentSong.song.id}`}
          title={selectedVideo.title || currentSong.song.title}
          showControls={false}
          autoplay={true}
          playerRef={playerRef}
          onProgress={handleProgress}
          onDuration={handleDuration}
          onEnd={() => {
            // Auto-avanzar a la siguiente canción cuando termine el video
            if (hasNext && isEventManager) {
              onNext();
            }
          }}
        />

        {/* Custom Progress Bar - Solo para event managers, NO en fullscreen/proyector */}
        {isEventManager && !isFullscreen && (
          <div className="absolute bottom-0 left-0 w-full">
            <VideoProgressBar
              progress={progress}
              progressDuration={progressDuration}
              duration={duration}
              onSeek={handleSeek}
              isFullscreen={isFullscreen}
            />
          </div>
        )}
      </div>

      {/* Song Title Overlay - Auto-hide después de 5 segundos en fullscreen */}
      {showOverlay && (
        <div
          className={`absolute left-4 top-4 z-10 flex flex-col gap-2 rounded-lg bg-black/60 p-3 backdrop-blur-sm transition-opacity duration-1000 ${
            !showOverlay ? 'opacity-0' : 'opacity-100'
          }`}
        >
          <h2
            className={`font-bold text-white drop-shadow-lg ${isFullscreen ? 'text-2xl md:text-4xl' : 'text-lg md:text-xl'}`}
          >
            {currentSong.song.title}
          </h2>

          <div className="flex flex-wrap gap-2">
            {selectedVideo.title && (
              <Chip size="sm" variant="flat" className="bg-black/50 text-white">
                {selectedVideo.title}
              </Chip>
            )}

            <Chip
              size="sm"
              variant="flat"
              color={
                selectedVideo.videoType === 'instrumental'
                  ? 'secondary'
                  : 'success'
              }
            >
              {selectedVideo.videoType === 'instrumental'
                ? 'Instrumental'
                : 'Canción completa'}
            </Chip>

            {selectedVideo.isPreferred && (
              <Chip size="sm" variant="flat" color="warning">
                ⭐ Preferido
              </Chip>
            )}
          </div>
        </div>
      )}

      {/* Navigation Buttons - Bottom center, only for event managers */}
      {isEventManager && (
        <div className="absolute bottom-20 left-1/2 z-10 -translate-x-1/2">
          <SongNavigationButtons
            hasPreviousSong={hasPrevious}
            hasNextSong={hasNext}
            onPrevious={onPrevious}
            onNext={onNext}
            onMainAction={() => {}} // No action needed for video mode
            mainActionIcon="start"
            isEventManager={isEventManager}
            isFullscreen={isFullscreen}
          />
        </div>
      )}
    </div>
  );
};
