'use client';

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
import { HeartIcon, ChatIcon, DownloadIcon } from '@global/icons';

interface PostCardProps {
  post: Post;
  onToggleBlessing: (postId: number) => void;
  onComment: (postId: number) => void;
  onCopySong?: (postId: number) => void;
  isLoadingBlessing?: boolean;
}

export const PostCard = ({
  post,
  onToggleBlessing,
  onComment,
  onCopySong,
  isLoadingBlessing,
}: PostCardProps) => {
  const isBlessed = post.userBlessing && post.userBlessing.length > 0;
  const isSongShare = post.type === 'SONG_SHARE';
  const isSongRequest = post.type === 'SONG_REQUEST';

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
          <div className="mb-2 rounded-lg bg-default-100 p-3">
            <div className="flex items-start justify-between gap-2">
              <div className="flex-1">
                <h3 className="text-base font-semibold">
                  {post.sharedSong.title}
                </h3>
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
              )}
            </div>
          </div>
        )}

        {/* Si solicita una canción */}
        {isSongRequest && (
          <div className="mb-2 rounded-lg bg-default-100 p-3">
            <p className="text-small text-default-600">
              🎵 Buscando:{' '}
              <span className="font-semibold">{post.requestedSongTitle}</span>
              {post.requestedSongArtist && (
                <span className="text-default-500">
                  {' '}
                  - {post.requestedSongArtist}
                </span>
              )}
            </p>
            {post.requestedYoutubeUrl && (
              <a
                href={post.requestedYoutubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-2 inline-flex items-center gap-1 text-small text-primary hover:underline"
              >
                🎥 Ver en YouTube
              </a>
            )}
          </div>
        )}

        {/* Timestamp */}
        <p className="text-tiny text-default-400">
          {formatRelativeTime(post.createdAt)}
        </p>
      </CardBody>

      <CardFooter className="gap-3">
        {/* Botón de Blessing */}
        <Button
          size="sm"
          variant="light"
          startContent={
            <HeartIcon
              className={`h-5 w-5 ${isBlessed ? 'fill-red-500 text-red-500' : ''}`}
            />
          }
          onPress={() => onToggleBlessing(post.id)}
          isLoading={isLoadingBlessing}
          className={isBlessed ? 'text-red-500' : ''}
        >
          {post._count.blessings}
        </Button>

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
