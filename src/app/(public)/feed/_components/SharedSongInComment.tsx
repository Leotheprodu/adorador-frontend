import { Button, Chip, Tooltip } from '@heroui/react';
import { CopyIcon, BookmarkIcon, EyeIcon, DownloadIcon } from '@global/icons';
import { FeedYouTubePlayer } from './FeedYouTubePlayer';
import {
  Comment as FeedComment,
  SongBasic,
} from '../_interfaces/feedInterface';
import { useSavedSong } from '../_hooks/useSavedSong';
import Link from 'next/link';

interface SharedSongInCommentProps {
  comment: FeedComment;
  onViewSong?: (songId: number, bandId: number) => void;
  onCopySong: (
    songId: number,
    title: string,
    key?: string | null,
    tempo?: number | null,
    commentId?: number,
  ) => void;
}

/**
 * Componente para mostrar una canción compartida dentro de un comentario
 */
export const SharedSongInComment = ({
  comment,
  onViewSong,
  onCopySong,
}: SharedSongInCommentProps) => {
  if (!comment.sharedSong) return null;

  return (
    <SharedSongInCommentContent
      comment={comment}
      sharedSong={comment.sharedSong}
      onViewSong={onViewSong}
      onCopySong={onCopySong}
    />
  );
};

interface SharedSongInCommentContentProps {
  comment: FeedComment;
  sharedSong: SongBasic;
  onViewSong?: (songId: number, bandId: number) => void;
  onCopySong: (
    songId: number,
    title: string,
    key?: string | null,
    tempo?: number | null,
    commentId?: number,
  ) => void;
}

const SharedSongInCommentContent = ({
  comment,
  sharedSong,
  onViewSong,
  onCopySong,
}: SharedSongInCommentContentProps) => {
  const {
    isSaved,
    toggleSave,
    isLoading: isSaving,
  } = useSavedSong(sharedSong.id);

  return (
    <div className="mb-3">
      {/* Reproductor de YouTube si existe */}
      {sharedSong.youtubeLink && (
        <div className="mb-3 w-full">
          <FeedYouTubePlayer
            youtubeUrl={sharedSong.youtubeLink}
            commentId={comment.id}
            title={sharedSong.title}
            artist={sharedSong.artist || undefined}
          />
        </div>
      )}

      <Tooltip
        content="Click para ver letra y acordes"
        delay={300}
        closeDelay={0}
      >
        <div
          className="group cursor-pointer rounded-lg border border-divider bg-content2 p-4 transition-all hover:border-primary hover:bg-content3 dark:hover:bg-content4"
          onClick={() =>
            onViewSong && onViewSong(sharedSong.id, sharedSong.bandId)
          }
        >
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 space-y-2">
              <div>
                <h3 className="text-base font-semibold text-foreground">
                  {sharedSong.title}
                </h3>
                {sharedSong.artist && (
                  <p className="text-sm text-foreground-500">
                    {sharedSong.artist}
                  </p>
                )}
              </div>

              <div className="flex flex-wrap gap-2">
                {sharedSong.key && (
                  <Chip size="sm" variant="flat">
                    {sharedSong.key}
                  </Chip>
                )}
                {sharedSong.tempo && (
                  <Chip size="sm" variant="flat">
                    {sharedSong.tempo} BPM
                  </Chip>
                )}
                {sharedSong.songType && (
                  <Chip
                    size="sm"
                    variant="flat"
                    color={
                      sharedSong.songType === 'worship'
                        ? 'primary'
                        : 'secondary'
                    }
                  >
                    {sharedSong.songType === 'worship'
                      ? 'Adoración'
                      : 'Alabanza'}
                  </Chip>
                )}
                {(sharedSong.hasSyncedLyrics || sharedSong.hasLyrics) && (
                  <Chip size="sm" color="success" variant="flat">
                    Letra Sync
                  </Chip>
                )}
                {(sharedSong.hasSyncedChords || sharedSong.hasChords) && (
                  <Chip size="sm" color="secondary" variant="flat">
                    Acordes Sync
                  </Chip>
                )}
              </div>
            </div>

            <div
              className="flex items-center gap-1"
              onClick={(e) => e.stopPropagation()}
            >
              <Tooltip
                content={isSaved ? 'Quitar de guardados' : 'Guardar canción'}
              >
                <Button
                  isIconOnly
                  size="sm"
                  variant={isSaved ? 'solid' : 'flat'}
                  color={isSaved ? 'primary' : 'default'}
                  onPress={toggleSave}
                  isLoading={isSaving}
                  aria-label={
                    isSaved ? 'Quitar de guardados' : 'Guardar canción'
                  }
                >
                  <BookmarkIcon
                    className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`}
                  />
                </Button>
              </Tooltip>

              <Tooltip content="Ver canción completa">
                <Button
                  isIconOnly
                  size="sm"
                  variant="flat"
                  color="default"
                  as={Link}
                  href={`/grupos/${sharedSong.bandId}/canciones/${sharedSong.id}`}
                  aria-label="Ver canción completa"
                >
                  <EyeIcon className="h-4 w-4" />
                </Button>
              </Tooltip>

              {onCopySong && (
                <Tooltip content="Copiar a mi banda">
                  <Button
                    isIconOnly
                    size="sm"
                    variant="flat"
                    color="primary"
                    onPress={() =>
                      onCopySong(
                        sharedSong.id,
                        sharedSong.title,
                        sharedSong.key,
                        sharedSong.tempo,
                        comment.id,
                      )
                    }
                    aria-label="Copiar a mi banda"
                  >
                    <CopyIcon className="h-4 w-4" />
                  </Button>
                </Tooltip>
              )}
            </div>
          </div>
          {/* Contador de copias */}
          {(comment._count?.songCopies ?? 0) > 0 && (
            <div className="mt-2 flex items-center gap-1 text-xs text-foreground-400">
              <DownloadIcon className="h-3 w-3" />
              <span>
                {comment._count!.songCopies === 1
                  ? '1 persona copió'
                  : `${comment._count!.songCopies} personas copiaron`}
              </span>
            </div>
          )}
        </div>
      </Tooltip>
    </div>
  );
};
