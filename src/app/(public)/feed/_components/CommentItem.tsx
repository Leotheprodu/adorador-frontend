'use client';

import {
    Card,
    CardBody,
    Avatar,
    Button,
    Textarea,
    Chip,
    Tooltip,
} from "@heroui/react";
import { formatRelativeTime } from '@global/utils/datesUtils';
import { SendIcon, DownloadIcon } from '@global/icons';
import { BlessingButton } from './BlessingButton';
import { FeedYouTubePlayer } from './FeedYouTubePlayer';
import { useCommentItem } from '../_hooks/useCommentItem';
import { CommentItemProps } from './_interfaces/commentSectionInterfaces';

export const CommentItem = ({
    comment,
    onReply,
    onViewSong,
    onCopySong,
    postId,
    isReply = false,
    isRequest = false,
    replyingTo,
    newComment,
    setNewComment,
    onSubmitReply,
    onCancelReply,
    isSubmitting,
}: CommentItemProps) => {
    const { handleToggleBlessing, isBlessingLoading } = useCommentItem({
        commentId: comment.id,
        postId,
    });

    const blessingCount = comment._count?.blessings || 0;
    const hasBlessed = (comment.userBlessing?.length || 0) > 0;

    return (
        <div id={`comment-${comment.id}`} className={isReply ? 'ml-8' : ''}>
            <Card>
                <CardBody>
                    <div className="flex gap-3">
                        <Avatar
                            name={comment.author.name}
                            size="sm"
                            className="flex-shrink-0"
                        />
                        <div className="flex-1">
                            <div className="mb-1 flex items-center gap-2">
                                <span className="text-small font-semibold">
                                    {comment.author.name}
                                </span>
                                <span className="text-tiny text-foreground-400">
                                    {formatRelativeTime(comment.createdAt)}
                                </span>
                            </div>
                            <p className="text-small text-foreground-700">{comment.content}</p>

                            {/* Canción compartida */}
                            {comment.sharedSong && (
                                <div className="mt-3 rounded-lg border border-success bg-content2 p-3">
                                    {/* Reproductor de YouTube si existe */}
                                    {comment.sharedSong.youtubeLink && (
                                        <div className="mb-3">
                                            <FeedYouTubePlayer
                                                youtubeUrl={comment.sharedSong.youtubeLink}
                                                commentId={comment.id}
                                                title={comment.sharedSong.title}
                                                artist={comment.sharedSong.artist || undefined}
                                            />
                                        </div>
                                    )}

                                    {/* Información de la canción */}
                                    <div className="space-y-2">
                                        <div>
                                            <h4 className="text-sm font-semibold text-foreground">
                                                {comment.sharedSong.title}
                                            </h4>
                                            {comment.sharedSong.artist && (
                                                <p className="text-sm text-foreground-500">
                                                    {comment.sharedSong.artist}
                                                </p>
                                            )}
                                        </div>

                                        {/* Detalles técnicos */}
                                        <div className="flex flex-wrap gap-2">
                                            {comment.sharedSong.key && (
                                                <Chip size="sm" variant="flat">
                                                    {comment.sharedSong.key}
                                                </Chip>
                                            )}
                                            {comment.sharedSong.tempo && (
                                                <Chip size="sm" variant="flat">
                                                    {comment.sharedSong.tempo} BPM
                                                </Chip>
                                            )}
                                        </div>

                                        {/* Botones de acción */}
                                        <div className="flex gap-2">
                                            <Tooltip content="Ver letra y acordes">
                                                <Button
                                                    size="sm"
                                                    variant="flat"
                                                    color="success"
                                                    className="flex-1"
                                                    onPress={() =>
                                                        onViewSong?.(
                                                            comment.sharedSong!.id,
                                                            comment.sharedSong!.bandId,
                                                            comment.id,
                                                        )
                                                    }
                                                >
                                                    Ver
                                                </Button>
                                            </Tooltip>
                                            {onCopySong && (
                                                <Tooltip content="Guardar canción">
                                                    <Button
                                                        size="sm"
                                                        variant="solid"
                                                        color="success"
                                                        className="flex-1"
                                                        startContent={<DownloadIcon className="h-4 w-4" />}
                                                        onPress={() =>
                                                            onCopySong(
                                                                postId!,
                                                                comment.sharedSong!.id,
                                                                comment.sharedSong!.bandId,
                                                                comment.id,
                                                                comment.sharedSong!.title,
                                                                comment.sharedSong!.key,
                                                                comment.sharedSong!.tempo,
                                                            )
                                                        }
                                                    >
                                                        Guardar
                                                    </Button>
                                                </Tooltip>
                                            )}
                                        </div>

                                        {/* Contador de copias */}
                                        {(comment._count?.songCopies ?? 0) > 0 && (
                                            <div className="flex items-center justify-center gap-1 text-xs text-foreground-400">
                                                <DownloadIcon className="h-3 w-3" />
                                                <span>
                                                    {comment._count!.songCopies === 1
                                                        ? '1 persona guardó'
                                                        : `${comment._count!.songCopies} personas guardaron`}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Botones de acción */}
                            <div className="mt-2 flex items-center gap-2">
                                {!isReply && !isRequest && (
                                    <Button
                                        size="sm"
                                        variant="light"
                                        onPress={() => onReply(comment.id)}
                                    >
                                        Responder
                                    </Button>
                                )}
                                {/* Permitir responder a comentarios con canciones compartidas, incluso en solicitudes */}
                                {!isReply && isRequest && comment.sharedSong && (
                                    <Button
                                        size="sm"
                                        variant="light"
                                        onPress={() => onReply(comment.id)}
                                    >
                                        Responder
                                    </Button>
                                )}
                                <BlessingButton
                                    isBlessed={hasBlessed}
                                    count={blessingCount}
                                    onPress={handleToggleBlessing}
                                    isLoading={isBlessingLoading}
                                />
                            </div>

                            {/* Formulario de respuesta - Se muestra debajo del comentario */}
                            {replyingTo === comment.id && (
                                <Card className="mt-3">
                                    <CardBody>
                                        <div className="mb-2 flex items-center justify-between">
                                            <span className="text-small text-foreground-600">
                                                Respondiendo a este comentario
                                            </span>
                                            <Button size="sm" variant="light" onPress={onCancelReply}>
                                                Cancelar
                                            </Button>
                                        </div>
                                        <div className="flex gap-2">
                                            <Textarea
                                                placeholder="Escribe tu respuesta..."
                                                value={newComment}
                                                onValueChange={setNewComment}
                                                minRows={2}
                                                maxRows={4}
                                                className="flex-1"
                                                autoFocus
                                            />
                                            <Button
                                                isIconOnly
                                                color="primary"
                                                onPress={onSubmitReply}
                                                isLoading={isSubmitting}
                                                isDisabled={!newComment.trim()}
                                                aria-label="Enviar respuesta"
                                            >
                                                <SendIcon className="h-5 w-5" />
                                            </Button>
                                        </div>
                                    </CardBody>
                                </Card>
                            )}
                        </div>
                    </div>
                </CardBody>
            </Card>

            {/* Respuestas anidadas */}
            {comment.replies && comment.replies.length > 0 && (
                <div className="mt-2 space-y-2">
                    {comment.replies.map((reply) => (
                        <CommentItem
                            key={reply.id}
                            comment={reply}
                            onReply={onReply}
                            onViewSong={onViewSong}
                            onCopySong={onCopySong}
                            postId={postId}
                            isReply
                            isRequest={isRequest}
                            replyingTo={replyingTo}
                            newComment={newComment}
                            setNewComment={setNewComment}
                            onSubmitReply={onSubmitReply}
                            onCancelReply={onCancelReply}
                            isSubmitting={isSubmitting}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};
