'use client';

import { Avatar } from '@heroui/react';
import { PostHeaderProps } from './_interfaces/postCardInterfaces';

export const PostHeader = ({
  authorName,
  bandName,
  postType,
  songTitle,
}: PostHeaderProps) => {
  const renderNarrative = () => {
    if (postType === 'SONG_SHARE' && songTitle) {
      return (
        <span>
          <span className="font-semibold text-foreground">{authorName}</span>
          <span className="text-foreground-500">
            {' '}
            ha compartido la canción{' '}
          </span>
          <span className="font-semibold text-foreground">{songTitle}</span>
        </span>
      );
    }
    if (postType === 'SONG_REQUEST' && songTitle) {
      return (
        <span>
          <span className="font-semibold text-foreground">{authorName}</span>
          <span className="text-foreground-500">
            {' '}
            está solicitando la canción{' '}
          </span>
          <span className="font-semibold text-foreground">{songTitle}</span>
        </span>
      );
    }
    if (postType === 'SONG_REQUEST' && !songTitle) {
      return (
        <span>
          <span className="font-semibold text-foreground">{authorName}</span>
          <span className="text-foreground-500"> ha hecho una solicitud</span>
        </span>
      );
    }

    return <span className="font-semibold text-foreground">{authorName}</span>;
  };

  return (
    <div className="flex items-center justify-between">
      <div className="flex gap-3">
        <Avatar name={authorName} size="md" className="flex-shrink-0" />
        <div className="flex flex-col gap-1">
          <h4 className="leading-none text-small">{renderNarrative()}</h4>
          <h5 className="tracking-tight text-foreground-400 text-small">
            {bandName}
          </h5>
        </div>
      </div>
    </div>
  );
};
