'use client';

import { YouTubePlayer } from '@global/components/YouTubePlayer';

interface FeedYouTubePlayerProps {
  youtubeUrl: string;
  postId?: number;
  commentId?: number;
  title?: string;
  artist?: string;
  className?: string;
}

/**
 * Componente wrapper para reproductor de YouTube en el feed
 * Maneja automáticamente el ID único basado en el contexto (post o comentario)
 */
export const FeedYouTubePlayer = ({
  youtubeUrl,
  postId,
  commentId,
  title,
  artist,
  className = '',
}: FeedYouTubePlayerProps) => {
  // Generar ID único basado en el contexto
  const uniqueId = commentId
    ? `comment-${commentId}`
    : postId
      ? `post-${postId}`
      : `youtube-${Date.now()}`;

  return (
    <YouTubePlayer
      youtubeUrl={youtubeUrl}
      uniqueId={uniqueId}
      title={title}
      artist={artist}
      showControls={true}
      className={className}
    />
  );
};
