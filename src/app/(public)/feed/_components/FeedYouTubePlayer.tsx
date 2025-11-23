'use client';

import { YouTubePlayer } from '@global/components/YouTubePlayer';

interface FeedYouTubePlayerProps {
  youtubeUrl: string;
  postId?: number;
  commentId?: number;
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
      showControls={true}
      className={className}
    />
  );
};
