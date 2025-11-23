'use client';

import { useState, useEffect } from 'react';
import { Card, CardHeader, CardBody, CardFooter } from '@nextui-org/react';
import { Post } from '../_interfaces/feedInterface';
import { formatRelativeTime } from '@global/utils/datesUtils';
import { PostHeader } from './PostHeader';
import { SongShareContent } from './SongShareContent';
import { SongRequestContent } from './SongRequestContent';
import { PostFooter } from './PostFooter';
import { InlineComments } from './InlineComments';
import { toggleBlessingService } from '../_services/feedService';
import { useQueryClient } from '@tanstack/react-query';
import { useStore } from '@nanostores/react';
import { $feedNavigation } from '@stores/feedNavigation';

interface PostCardProps {
  post: Post;
  onCopySong?: (postId: number) => void;
  onViewSong?: (postId: number) => void;
  userBands?: Array<{ id: number; name: string }>;
  onCopySongFromComment?: (
    songId: number,
    key?: string,
    tempo?: number,
  ) => void;
  onViewSongFromComment?: (songId: number, bandId: number) => void;
}

export const PostCard = ({
  post,
  onCopySong,
  onViewSong,
  userBands = [],
  onCopySongFromComment,
  onViewSongFromComment,
}: PostCardProps) => {
  const queryClient = useQueryClient();
  const feedNavigation = useStore($feedNavigation);
  const [blessingPostId, setBlessingPostId] = useState<number | null>(null);
  const [showComments, setShowComments] = useState(false);

  const toggleBlessing = toggleBlessingService({ postId: blessingPostId || 0 });

  const isBlessed = post.userBlessing && post.userBlessing.length > 0;
  const isSongShare = post.type === 'SONG_SHARE';
  const isSongRequest = post.type === 'SONG_REQUEST';

  const handleToggleBlessing = () => {
    setBlessingPostId(post.id);
    toggleBlessing.mutate(null, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['feed-infinite'] });
        queryClient.invalidateQueries({
          queryKey: ['post', post.id.toString()],
        });
        setBlessingPostId(null);
      },
    });
  };

  // Detectar si este post es el objetivo de navegación desde notificaciones
  useEffect(() => {
    if (
      feedNavigation.isNavigating &&
      feedNavigation.targetPostId === post.id &&
      feedNavigation.targetCommentId
    ) {
      setShowComments(true);
    }
  }, [feedNavigation, post.id]);

  return (
    <Card className="w-full" id={`post-${post.id}`}>
      <CardHeader className="justify-between">
        <PostHeader
          authorName={post.author.name}
          bandName={post.band.name}
          isSongShare={isSongShare}
        />
      </CardHeader>

      <CardBody className="px-3 py-2 text-small text-foreground-700">
        {/* Título del post */}
        <h3 className="mb-2 text-base font-semibold">{post.title}</h3>

        {/* Descripción/Contenido del post */}
        {post.description && (
          <div className="mb-3 whitespace-pre-wrap text-foreground-600">
            {post.description}
          </div>
        )}

        {/* Si comparte una canción */}
        {isSongShare && post.sharedSong && (
          <SongShareContent
            postId={post.id}
            song={post.sharedSong}
            onViewSong={onViewSong}
            onCopySong={onCopySong}
          />
        )}

        {/* Si solicita una canción */}
        {isSongRequest && (
          <SongRequestContent
            postId={post.id}
            requestedSongTitle={post.requestedSongTitle}
            requestedArtist={post.requestedArtist}
            requestedYoutubeUrl={post.requestedYoutubeUrl}
          />
        )}

        {/* Timestamp */}
        <p className="text-tiny text-foreground-400">
          {formatRelativeTime(post.createdAt)}
        </p>
      </CardBody>

      <CardFooter className="gap-3">
        <PostFooter
          isBlessed={isBlessed}
          blessingCount={post._count.blessings}
          commentCount={post._count.comments}
          songCopyCount={post._count.songCopies}
          isSongShare={isSongShare}
          onToggleBlessing={handleToggleBlessing}
          onToggleComments={() => setShowComments(!showComments)}
          isBlessingLoading={toggleBlessing.isPending && blessingPostId === post.id}
        />
      </CardFooter>

      {/* Sección de comentarios inline */}
      {showComments && (
        <div className="px-4 pb-4">
          <InlineComments
            postId={post.id}
            isVisible={showComments}
            postType={post.type}
            userBands={userBands}
            onCopySong={onCopySongFromComment}
            onViewSong={onViewSongFromComment}
          />
        </div>
      )}
    </Card>
  );
};
