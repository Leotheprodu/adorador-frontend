'use client';

import { useState } from 'react';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Avatar,
  Button,
  Chip,
} from '@nextui-org/react';
import { Post } from '../_interfaces/feedInterface';
import { formatRelativeTime } from '@global/utils/datesUtils';
import { ChatIcon, DownloadIcon } from '@global/icons';
import { BlessingButton } from './BlessingButton';
import { toggleBlessingService } from '../_services/feedService';
import { useQueryClient } from '@tanstack/react-query';
import { getYouTubeThumbnail } from '@global/utils/formUtils';

interface PostCardProps {
  post: Post;
  onComment: (postId: number) => void;
  onCopySong?: (postId: number) => void;
  onViewSong?: (postId: number) => void;
}

export const PostCard = ({
  post,
  onComment,
  onCopySong,
  onViewSong,
}: PostCardProps) => {
  const queryClient = useQueryClient();
  const [blessingPostId, setBlessingPostId] = useState<number | null>(null);
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

  return (
    <Card className="w-full">
      <CardHeader className="justify-between">
        <div className="flex gap-3">
          <Avatar name={post.author.name} size="md" className="flex-shrink-0" />
          <div className="flex flex-col gap-1">
            <h4 className="text-small font-semibold leading-none text-default-600">
              {post.author.name}
            </h4>
            <h5 className="text-small tracking-tight text-default-400">
              {post.band.name}
            </h5>
          </div>
        </div>
        <Chip
          size="sm"
          variant="flat"
          color={isSongShare ? 'success' : 'warning'}
        >
          {isSongShare ? '🎵 Compartir' : '🙏 Solicitar'}
        </Chip>
      </CardHeader>

      <CardBody className="px-3 py-2 text-small text-default-700">
        {/* Título del post */}
        <h3 className="mb-2 text-base font-semibold">{post.title}</h3>

        {/* Descripción/Contenido del post */}
        {post.description && (
          <p className="mb-3 text-default-600">{post.description}</p>
        )}

        {/* Si comparte una canción */}
        {isSongShare && post.sharedSong && (
          <div
            className="group mb-2 cursor-pointer rounded-lg bg-default-100 p-3 transition-all hover:bg-default-200 hover:shadow-md"
            onClick={() => onViewSong && onViewSong(post.id)}
            title="Click para ver letra y acordes"
          >
            <div className="flex items-start gap-3">
              {/* Thumbnail de YouTube si existe */}
              {post.sharedSong.youtubeLink && (
                <div className="flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getYouTubeThumbnail(
                      post.sharedSong.youtubeLink,
                      'mqdefault',
                    )}
                    alt={post.sharedSong.title}
                    className="h-[90px] w-[120px] rounded-lg object-cover"
                  />
                </div>
              )}
              <div className="flex flex-1 items-start justify-between gap-2">
                <div className="flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <h3 className="text-base font-semibold">
                      {post.sharedSong.title}
                    </h3>
                    <span className="text-xs text-default-400 opacity-0 transition-opacity group-hover:opacity-100">
                      Ver
                    </span>
                  </div>
                  {post.sharedSong.artist && (
                    <p className="text-small text-default-500">
                      {post.sharedSong.artist}
                    </p>
                  )}
                  <div className="mt-2 flex gap-2">
                    {post.sharedSong.key && (
                      <Chip size="sm" variant="flat">
                        Tono: {post.sharedSong.key}
                      </Chip>
                    )}
                    {post.sharedSong.tempo && (
                      <Chip size="sm" variant="flat">
                        BPM: {post.sharedSong.tempo}
                      </Chip>
                    )}
                    <Chip
                      size="sm"
                      variant="flat"
                      color={
                        post.sharedSong.songType === 'worship'
                          ? 'primary'
                          : 'secondary'
                      }
                    >
                      {post.sharedSong.songType === 'worship'
                        ? 'Adoración'
                        : 'Alabanza'}
                    </Chip>
                  </div>
                </div>
                {onCopySong && (
                  <div onClick={(e) => e.stopPropagation()}>
                    <Button
                      isIconOnly
                      size="sm"
                      variant="flat"
                      color="primary"
                      onPress={() => onCopySong(post.id)}
                      aria-label="Copiar canción"
                    >
                      <DownloadIcon className="h-5 w-5" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Si solicita una canción */}
        {isSongRequest && (
          <div className="mb-2 rounded-lg bg-default-100 p-3">
            <div className="flex gap-3">
              {/* Thumbnail de YouTube si existe */}
              {post.requestedYoutubeUrl && (
                <div className="flex-shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={getYouTubeThumbnail(
                      post.requestedYoutubeUrl,
                      'mqdefault',
                    )}
                    alt={post.requestedSongTitle || 'Video solicitado'}
                    className="h-[90px] w-[120px] rounded-lg object-cover"
                  />
                </div>
              )}
              <div className="flex flex-1 flex-col justify-center">
                <p className="text-small text-default-600">
                  🎵 Buscando:{' '}
                  <span className="font-semibold">
                    {post.requestedSongTitle}
                  </span>
                  {post.requestedArtist && (
                    <span className="text-default-500">
                      {' '}
                      - {post.requestedArtist}
                    </span>
                  )}
                </p>
                {post.requestedYoutubeUrl && (
                  <a
                    href={
                      post.requestedYoutubeUrl.startsWith('http')
                        ? post.requestedYoutubeUrl
                        : `https://www.youtube.com/watch?v=${post.requestedYoutubeUrl}`
                    }
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-1 inline-flex items-center gap-1 text-small text-primary hover:underline"
                  >
                    🎥 Ver en YouTube
                  </a>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Timestamp */}
        <p className="text-tiny text-default-400">
          {formatRelativeTime(post.createdAt)}
        </p>
      </CardBody>

      <CardFooter className="gap-3">
        {/* Botón de Blessing */}
        <BlessingButton
          isBlessed={isBlessed}
          count={post._count.blessings}
          onPress={handleToggleBlessing}
          isLoading={toggleBlessing.isPending && blessingPostId === post.id}
        />

        {/* Botón de Comentarios */}
        <Button
          size="sm"
          variant="light"
          startContent={<ChatIcon className="h-5 w-5" />}
          onPress={() => onComment(post.id)}
        >
          {post._count.comments}
        </Button>

        {/* Contador de copias */}
        {isSongShare && post._count.songCopies > 0 && (
          <div className="flex items-center gap-1 text-small text-default-500">
            <DownloadIcon className="h-4 w-4" />
            <span>{post._count.songCopies}</span>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};
