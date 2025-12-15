'use client';

import ReactPlayer from 'react-player';
import { useYouTubePlayer } from '@global/hooks/useYouTubePlayer';
import { YouTubeThumbnail } from './YouTubeThumbnail';

interface YouTubePlayerProps {
  youtubeUrl: string; // URL o ID de YouTube
  uniqueId: string; // Identificador único (ej: "post-123" o "comment-456")
  title?: string;
  artist?: string;
  showControls?: boolean;
  className?: string;
  autoplay?: boolean;
  onEnd?: () => void;
  playerRef?: React.RefObject<ReactPlayer>; // External ref for controlling the player
  onProgress?: (state: { played: number; playedSeconds: number }) => void;
  onDuration?: (duration: number) => void;
}

export const YouTubePlayer = ({
  youtubeUrl,
  uniqueId,
  title,
  artist,
  showControls = true,
  className = '',
  autoplay = false,
  onEnd,
  playerRef: externalRef,
  onProgress,
  onDuration,
}: YouTubePlayerProps) => {
  const {
    playerRef: internalRef,
    showPlayer,
    youtubeId,
    thumbnail,
    playing,
    handlePlayPause,
    handlePlay,
    handlePause,
    handleEnd,
  } = useYouTubePlayer({ youtubeUrl, uniqueId, autoplay, onEnd });

  // Use external ref if provided, otherwise use internal ref
  const playerReference = externalRef || internalRef;

  if (!youtubeId) {
    return null;
  }

  return (
    <div
      className={`relative h-full overflow-hidden rounded-xl bg-content2 dark:bg-content3 ${className}`}
    >
      {!showPlayer ? (
        <YouTubeThumbnail
          thumbnail={thumbnail}
          title={title}
          artist={artist}
          onPlay={handlePlayPause}
        />
      ) : (
        // Reproductor activo - Fill container
        <div className="relative h-full w-full">
          <ReactPlayer
            ref={playerReference}
            url={`https://www.youtube.com/watch?v=${youtubeId}`}
            playing={playing}
            controls={showControls}
            width="100%"
            height="100%"
            onPlay={handlePlay}
            onPause={handlePause}
            onEnded={handleEnd}
            onProgress={onProgress}
            onDuration={onDuration}
            config={{
              youtube: {
                playerVars: {
                  modestbranding: 1,
                  rel: 0,
                  autoplay: autoplay ? 1 : 0,
                  fs: 1, // Enable fullscreen
                },
              },
            }}
          />
        </div>
      )}
    </div>
  );
};
