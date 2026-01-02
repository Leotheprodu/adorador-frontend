'use client';

import { Card, CardBody, Avatar, Button, Textarea } from '@heroui/react';
import { formatRelativeTime } from '@global/utils/datesUtils';
import { SendIcon } from '@global/icons';
import { BlessingButton } from './BlessingButton';

import { useCommentItem } from '../_hooks/useCommentItem';
import { CommentItemProps } from './_interfaces/commentSectionInterfaces';
import { SharedSongInComment } from './SharedSongInComment';

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
          <div className="flex flex-col gap-2">
            {/* Header: Avatar + Nombre + Fecha */}
            <div className="flex items-center gap-3">
              <Avatar
                name={comment.author.name}
                size="sm"
                className="flex-shrink-0"
              />
              <div className="flex flex-col">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-small">
                    {comment.author.name}
                  </span>
                  <span className="text-foreground-400 text-tiny">
                    {formatRelativeTime(comment.createdAt)}
                  </span>
                </div>
              </div>
            </div>

            {/* Content: Texto + Canción + Botones */}
            <div>
              <p className="mb-2 text-foreground-700 text-small">
                {comment.content}
              </p>

              {/* Canción compartida */}
              <SharedSongInComment
                comment={comment}
                onViewSong={(songId, bandId) =>
                  onViewSong?.(songId, bandId, comment.id)
                }
                onCopySong={(songId, title, key, tempo, commentId) =>
                  onCopySong?.(
                    postId!,
                    songId,
                    comment.sharedSong!.bandId,
                    commentId!,
                    title,
                    key,
                    tempo,
                  )
                }
              />

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
                      <span className="text-foreground-600 text-small">
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
