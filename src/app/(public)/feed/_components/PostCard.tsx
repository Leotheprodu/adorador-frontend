'use client';

import { Card, CardHeader, CardBody, CardFooter } from "@heroui/react";
import { formatRelativeTime } from '@global/utils/datesUtils';
import { PostHeader } from './PostHeader';
import { SongShareContent } from './SongShareContent';
import { SongRequestContent } from './SongRequestContent';
import { PostFooter } from './PostFooter';
import { InlineComments } from './InlineComments';
import { usePostCard } from '../_hooks/usePostCard';
import { PostCardProps } from './_interfaces/postCardInterfaces';

export const PostCard = ({
  post,
  onCopySong,
  onViewSong,
  userBands = [],
  onCopySongFromComment,
  onViewSongFromComment,
}: PostCardProps) => {
  const { showComments, handleToggleBlessing, handleToggleComments, isBlessingLoading } =
    usePostCard({ postId: post.id });

  const isBlessed = post.userBlessing && post.userBlessing.length > 0;
  const isSongShare = post.type === 'SONG_SHARE';
  const isSongRequest = post.type === 'SONG_REQUEST';

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
        <h3 className="mb-2 text-base font-semibold">{post.title}</h3>

        {post.description && (
          <div className="mb-3 whitespace-pre-wrap text-foreground-600">
            {post.description}
          </div>
        )}

        {isSongShare && post.sharedSong && (
          <SongShareContent
            postId={post.id}
            song={post.sharedSong}
            onViewSong={onViewSong}
            onCopySong={onCopySong}
          />
        )}

        {isSongRequest && (
          <SongRequestContent
            postId={post.id}
            requestedSongTitle={post.requestedSongTitle}
            requestedArtist={post.requestedArtist}
            requestedYoutubeUrl={post.requestedYoutubeUrl}
          />
        )}

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
          onToggleComments={handleToggleComments}
          isBlessingLoading={isBlessingLoading}
        />
      </CardFooter>

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
