'use client';

import { useState } from 'react';
import {
  Card,
  CardBody,
  Avatar,
  Button,
  Textarea,
  Spinner,
  Chip,
} from '@nextui-org/react';
import { Comment, CreateCommentDto, Post } from '../_interfaces/feedInterface';
import { formatRelativeTime } from '@global/utils/datesUtils';
import { SendIcon, DownloadIcon } from '@global/icons';
import { ShareSongCommentModal } from './ShareSongCommentModal';
import { BlessingButton } from './BlessingButton';
import { toggleCommentBlessingService } from '../_services/feedService';
import { useQueryClient } from '@tanstack/react-query';
import { getYouTubeThumbnail } from '@global/utils/formUtils';

interface CommentSectionProps {
  comments: Comment[];
  onSubmitComment: (data: CreateCommentDto) => void;
  isLoadingComments: boolean;
  isSubmitting?: boolean;
  post?: Post;
  onViewSong?: (songId: number, bandId: number) => void;
  onCopySong?: (
    postId: number,
    songId: number,
    bandId: number,
    key?: string | null,
    tempo?: number | null,
  ) => void;
}

export const CommentSection = ({
  comments,
  onSubmitComment,
  isLoadingComments,
  isSubmitting,
  post,
  onViewSong,
  onCopySong,
}: CommentSectionProps) => {
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [isShareSongModalOpen, setIsShareSongModalOpen] = useState(false);

  const isRequest = post?.type === 'SONG_REQUEST';

  const handleSubmit = () => {
    if (!newComment.trim()) return;

    const data: CreateCommentDto = {
      content: newComment.trim(),
    };

    if (replyingTo) {
      data.parentId = replyingTo;
    }

    onSubmitComment(data);
    setNewComment('');
    setReplyingTo(null);
  };

  const handleShareSong = (songId: number, description: string) => {
    const data: CreateCommentDto = {
      content: description || 'Te comparto esta canción 🎵',
      sharedSongId: songId,
    };

    onSubmitComment(data);
    setIsShareSongModalOpen(false);
  };

  const handleReply = (commentId: number) => {
    setReplyingTo(commentId);
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
    setNewComment('');
  };

  if (isLoadingComments) {
    return (
      <div className="flex justify-center py-8">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Si es una solicitud, mostrar botón para compartir canción */}
      {isRequest && (
        <Button
          color="success"
          variant="flat"
          onPress={() => setIsShareSongModalOpen(true)}
          className="w-full"
        >
          🎵 Tengo esta canción - Compartir
        </Button>
      )}

      {/* Modal para compartir canción */}
      <ShareSongCommentModal
        isOpen={isShareSongModalOpen}
        onClose={() => setIsShareSongModalOpen(false)}
        onShare={handleShareSong}
        isSharing={isSubmitting}
      />

      {/* Formulario de nuevo comentario - Solo mostrar si NO es una solicitud Y NO está respondiendo */}
      {!isRequest && !replyingTo && (
        <Card>
          <CardBody>
            <div className="flex gap-2">
              <Textarea
                placeholder="Escribe un comentario..."
                value={newComment}
                onValueChange={setNewComment}
                minRows={2}
                maxRows={4}
                className="flex-1"
              />
              <Button
                isIconOnly
                color="primary"
                onPress={handleSubmit}
                isLoading={isSubmitting}
                isDisabled={!newComment.trim()}
                aria-label="Enviar comentario"
              >
                <SendIcon className="h-5 w-5" />
              </Button>
            </div>
          </CardBody>
        </Card>
      )}

      {/* Lista de comentarios */}
      {comments.length === 0 ? (
        <div className="py-8 text-center text-default-400">
          {isRequest ? (
            <>
              <p>Aún no hay canciones compartidas</p>
              <p className="text-small">
                ¡Sé el primero en compartir una canción!
              </p>
            </>
          ) : (
            <>
              <p>Aún no hay comentarios</p>
              <p className="text-small">¡Sé el primero en comentar!</p>
            </>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onReply={handleReply}
              onViewSong={onViewSong}
              onCopySong={onCopySong}
              postId={post?.id}
              isRequest={isRequest}
              replyingTo={replyingTo}
              newComment={newComment}
              setNewComment={setNewComment}
              onSubmitReply={handleSubmit}
              onCancelReply={handleCancelReply}
              isSubmitting={isSubmitting}
            />
          ))}
        </div>
      )}
    </div>
  );
};

interface CommentItemProps {
  comment: Comment;
  onReply: (commentId: number) => void;
  onViewSong?: (songId: number, bandId: number) => void;
  onCopySong?: (
    postId: number,
    songId: number,
    bandId: number,
    key?: string | null,
    tempo?: number | null,
  ) => void;
  postId?: number;
  isReply?: boolean;
  isRequest?: boolean;
  replyingTo: number | null;
  newComment: string;
  setNewComment: (value: string) => void;
  onSubmitReply: () => void;
  onCancelReply: () => void;
  isSubmitting?: boolean;
}

const CommentItem = ({
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
  const queryClient = useQueryClient();
  const [blessingCommentId, setBlessingCommentId] = useState<number | null>(
    null,
  );
  const toggleBlessing = toggleCommentBlessingService({
    commentId: blessingCommentId || 0,
  });

  const blessingCount = comment._count?.blessings || 0;
  const hasBlessed = (comment.userBlessing?.length || 0) > 0;

  const handleToggleBlessing = () => {
    setBlessingCommentId(comment.id);
    toggleBlessing.mutate(null, {
      onSuccess: () => {
        if (postId) {
          queryClient.invalidateQueries({
            queryKey: ['comments', postId.toString()],
          });
        }
        setBlessingCommentId(null);
      },
    });
  };

  return (
    <div className={isReply ? 'ml-8' : ''}>
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
                <span className="text-tiny text-default-400">
                  {formatRelativeTime(comment.createdAt)}
                </span>
              </div>
              <p className="text-small text-default-700">{comment.content}</p>

              {/* Canción compartida */}
              {comment.sharedSong && (
                <Card className="mt-3 border-2 border-success-200 bg-success-50">
                  <CardBody className="py-3">
                    <div className="flex items-start gap-3">
                      {/* Thumbnail de YouTube si existe */}
                      {comment.sharedSong.youtubeLink && (
                        <div className="flex-shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={getYouTubeThumbnail(
                              comment.sharedSong.youtubeLink,
                              'mqdefault',
                            )}
                            alt={comment.sharedSong.title}
                            className="h-[90px] w-[120px] rounded-lg object-cover"
                          />
                        </div>
                      )}
                      <div className="flex flex-1 flex-col">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">🎵</span>
                          <div className="flex-1">
                            <p className="text-small font-semibold text-success-700">
                              {comment.sharedSong.title}
                            </p>
                            {comment.sharedSong.artist && (
                              <p className="text-tiny text-success-600">
                                {comment.sharedSong.artist}
                              </p>
                            )}
                            <div className="mt-1 flex gap-2">
                              {comment.sharedSong.key && (
                                <Chip
                                  size="sm"
                                  variant="flat"
                                  color="success"
                                  className="text-tiny"
                                >
                                  Tono: {comment.sharedSong.key}
                                </Chip>
                              )}
                              {comment.sharedSong.tempo && (
                                <Chip
                                  size="sm"
                                  variant="flat"
                                  color="success"
                                  className="text-tiny"
                                >
                                  {comment.sharedSong.tempo} BPM
                                </Chip>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-3 flex gap-2">
                      <Button
                        size="sm"
                        variant="flat"
                        color="success"
                        startContent={<span>👁️</span>}
                        onPress={() =>
                          onViewSong?.(
                            comment.sharedSong!.id,
                            comment.sharedSong!.bandId,
                          )
                        }
                        className="flex-1"
                      >
                        Ver
                      </Button>
                      {onCopySong && (
                        <Button
                          size="sm"
                          variant="solid"
                          color="success"
                          startContent={<DownloadIcon className="h-4 w-4" />}
                          onPress={() =>
                            onCopySong(
                              postId!,
                              comment.sharedSong!.id,
                              comment.sharedSong!.bandId,
                              comment.sharedSong!.key,
                              comment.sharedSong!.tempo,
                            )
                          }
                          className="flex-1"
                        >
                          Guardar
                        </Button>
                      )}
                    </div>
                  </CardBody>
                </Card>
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
                  isLoading={
                    toggleBlessing.isPending && blessingCommentId === comment.id
                  }
                />
              </div>

              {/* Formulario de respuesta - Se muestra debajo del comentario */}
              {replyingTo === comment.id && (
                <Card className="mt-3">
                  <CardBody>
                    <div className="mb-2 flex items-center justify-between">
                      <span className="text-small text-default-600">
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
