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
}

export const YouTubePlayer = ({
  youtubeUrl,
  uniqueId,
  title,
  artist,
  showControls = true,
  className = '',
}: YouTubePlayerProps) => {
  const {
    playerRef,
    showPlayer,
    youtubeId,
    thumbnail,
    isPlaying,
    handlePlayPause,
    handlePlay,
    handlePause,
  } = useYouTubePlayer({ youtubeUrl, uniqueId });

  if (!youtubeId) {
    return null;
  }

  return (
    <div
      className={`relative overflow-hidden rounded-xl bg-content2 dark:bg-content3 ${className}`}
    >
      {!showPlayer ? (
        <YouTubeThumbnail
          thumbnail={thumbnail}
          title={title}
          artist={artist}
          onPlay={handlePlayPause}
        />
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
