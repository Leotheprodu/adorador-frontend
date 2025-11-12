'use client';

import { useState } from 'react';
import {
  Card,
  CardBody,
  Avatar,
  Button,
  Textarea,
  Spinner,
} from '@nextui-org/react';
import { Comment, CreateCommentDto, Post } from '../_interfaces/feedInterface';
import { formatRelativeTime } from '@global/utils/datesUtils';
import { SendIcon } from '@global/icons';

interface CommentSectionProps {
  comments: Comment[];
  onSubmitComment: (data: CreateCommentDto) => void;
  isLoadingComments: boolean;
  isSubmitting?: boolean;
  post?: Post; // Post original para saber si es solicitud
  onShareSongToRequest?: (postId: number) => void; // Handler para compartir canción
}

export const CommentSection = ({
  comments,
  onSubmitComment,
  isLoadingComments,
  isSubmitting,
  post,
  onShareSongToRequest,
}: CommentSectionProps) => {
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<number | null>(null);

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
      {isRequest && onShareSongToRequest && post && (
        <Button
          color="success"
          variant="flat"
          onPress={() => onShareSongToRequest(post.id)}
          className="w-full"
        >
          🎵 Tengo esta canción - Compartir
        </Button>
      )}

      {/* Formulario de nuevo comentario */}
      <Card>
        <CardBody>
          {replyingTo && (
            <div className="mb-2 flex items-center justify-between rounded-lg bg-default-100 px-3 py-2">
              <span className="text-small text-default-600">
                Respondiendo a comentario
              </span>
              <Button size="sm" variant="light" onPress={handleCancelReply}>
                Cancelar
              </Button>
            </div>
          )}
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

      {/* Lista de comentarios */}
      {comments.length === 0 ? (
        <div className="py-8 text-center text-default-400">
          <p>Aún no hay comentarios</p>
          <p className="text-small">¡Sé el primero en comentar!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onReply={handleReply}
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
  isReply?: boolean;
}

const CommentItem = ({
  comment,
  onReply,
  isReply = false,
}: CommentItemProps) => {
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
              {!isReply && (
                <Button
                  size="sm"
                  variant="light"
                  className="mt-2"
                  onPress={() => onReply(comment.id)}
                >
                  Responder
                </Button>
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
              isReply
            />
          ))}
        </div>
      )}
    </div>
  );
};
