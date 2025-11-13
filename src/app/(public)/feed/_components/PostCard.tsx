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
  Tooltip,
} from '@nextui-org/react';
import { Post } from '../_interfaces/feedInterface';
import { formatRelativeTime } from '@global/utils/datesUtils';
import { ChatIcon, DownloadIcon } from '@global/icons';
import { BlessingButton } from './BlessingButton';
import { toggleBlessingService } from '../_services/feedService';
import { useQueryClient } from '@tanstack/react-query';
import { FeedYouTubePlayer } from './FeedYouTubePlayer';

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
          <div className="mb-3">
            {/* Reproductor de YouTube si existe */}
            {post.sharedSong.youtubeLink && (
              <div className="mb-3 w-full">
                <FeedYouTubePlayer
                  youtubeUrl={post.sharedSong.youtubeLink}
                  postId={post.id}
                  title={post.sharedSong.title}
                  artist={post.sharedSong.artist || undefined}
                />
              </div>
            )}

            {/* Información de la canción - Diseño minimalista */}
            <Tooltip
              content="Click para ver letra y acordes"
              delay={300}
              closeDelay={0}
            >
              <div
                className="group cursor-pointer rounded-lg border border-divider bg-content2 p-4 transition-all hover:border-primary hover:bg-content3"
                onClick={() => onViewSong && onViewSong(post.id)}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 space-y-2">
                    {/* Título y artista */}
                    <div>
                      <h3 className="text-base font-semibold text-foreground">
                        {post.sharedSong.title}
                      </h3>
                      {post.sharedSong.artist && (
                        <p className="text-sm text-foreground-500">
                          {post.sharedSong.artist}
                        </p>
                      )}
                    </div>

                    {/* Detalles técnicos */}
                    <div className="flex flex-wrap gap-2">
                      {post.sharedSong.key && (
                        <Chip size="sm" variant="flat">
                          {post.sharedSong.key}
                        </Chip>
                      )}
                      {post.sharedSong.tempo && (
                        <Chip size="sm" variant="flat">
                          {post.sharedSong.tempo} BPM
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

                  {/* Botón de copiar */}
                  {onCopySong && (
                    <div onClick={(e) => e.stopPropagation()}>
                      <Tooltip content="Copiar canción">
                        <Button
                          isIconOnly
                          size="sm"
                          variant="flat"
                          color="primary"
                          onPress={() => onCopySong(post.id)}
                          aria-label="Copiar canción"
                        >
                          <DownloadIcon className="h-4 w-4" />
                        </Button>
                      </Tooltip>
                    </div>
                  )}
                </div>
              </div>
            </Tooltip>
          </div>
        )}

        {/* Si solicita una canción */}
        {isSongRequest && (
          <div className="mb-3">
            {/* Card de solicitud de canción */}
            <div className="mb-3 rounded-lg border border-divider bg-content2 p-3">
              <div className="mb-2">
                <Chip size="sm" variant="flat" color="warning">
                  Solicitud
                </Chip>
              </div>
              <p className="text-sm font-semibold text-foreground">
                {post.requestedSongTitle}
              </p>
              {post.requestedArtist && (
                <p className="text-sm text-foreground-500">
                  {post.requestedArtist}
                </p>
              )}
            </div>

            {/* Reproductor de YouTube si existe */}
            {post.requestedYoutubeUrl && (
              <FeedYouTubePlayer
                youtubeUrl={post.requestedYoutubeUrl}
                postId={post.id}
                title={post.requestedSongTitle || undefined}
                artist={post.requestedArtist || undefined}
              />
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
