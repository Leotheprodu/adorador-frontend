import { Button, Chip, Tooltip } from "@heroui/react";
import { DownloadIcon } from '@global/icons';
import { FeedYouTubePlayer } from './FeedYouTubePlayer';
import { Comment as FeedComment } from '../_interfaces/feedInterface';

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

    const { sharedSong } = comment;

    return (
        <div className="mt-2 rounded-lg border border-success bg-content2 p-3">
            <div className="mb-2 flex items-center gap-2">
                <span className="text-xs font-medium text-success">
                    🎵 Canción compartida
                </span>
            </div>

            {/* Reproductor de YouTube si existe */}
            {sharedSong.youtubeLink && (
                <div className="mb-3">
                    <FeedYouTubePlayer
                        youtubeUrl={sharedSong.youtubeLink}
                        commentId={comment.id}
                        title={sharedSong.title}
                        artist={sharedSong.artist || undefined}
                    />
                </div>
            )}

            <div className="space-y-2">
                {/* Información de la canción */}
                <div>
                    <h4 className="text-sm font-semibold text-foreground">
                        {sharedSong.title}
                    </h4>
                    {sharedSong.artist && (
                        <p className="text-sm text-foreground-500">{sharedSong.artist}</p>
                    )}
                </div>

                {/* Detalles técnicos */}
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
                    <Chip
                        size="sm"
                        variant="flat"
                        color={sharedSong.songType === 'worship' ? 'primary' : 'secondary'}
                    >
                        {sharedSong.songType === 'worship' ? 'Adoración' : 'Alabanza'}
                    </Chip>
                </div>

                {/* Botones de acción */}
                <div className="flex gap-2">
                    {onViewSong && (
                        <Tooltip content="Ver letra y acordes">
                            <Button
                                size="sm"
                                variant="flat"
                                color="success"
                                className="flex-1"
                                onPress={() => onViewSong(sharedSong.id, sharedSong.bandId)}
                            >
                                Ver
                            </Button>
                        </Tooltip>
                    )}
                    <Tooltip content="Copiar a mi banda">
                        <Button
                            size="sm"
                            variant="solid"
                            color="success"
                            className="flex-1"
                            startContent={<DownloadIcon className="h-4 w-4" />}
                            onPress={() =>
                                onCopySong(
                                    sharedSong.id,
                                    sharedSong.title,
                                    sharedSong.key,
                                    sharedSong.tempo,
                                    comment.id,
                                )
                            }
                        >
                            Copiar
                        </Button>
                    </Tooltip>
                </div>

                {/* Contador de copias */}
                {(comment._count?.songCopies ?? 0) > 0 && (
                    <div className="flex items-center justify-center gap-1 text-xs text-foreground-400">
                        <DownloadIcon className="h-3 w-3" />
                        <span>
                            {comment._count!.songCopies === 1
                                ? '1 persona copió'
                                : `${comment._count!.songCopies} personas copiaron`}
                        </span>
                    </div>
                )}
            </div>
        </div>
    );
};
