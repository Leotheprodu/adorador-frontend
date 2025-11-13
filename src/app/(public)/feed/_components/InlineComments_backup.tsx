'use client';

import { useState, useEffect } from 'react';
import { Avatar, Button, Textarea, Spinner, Divider } from '@nextui-org/react';
import { Comment, CreateCommentDto } from '../_interfaces/feedInterface';
import { formatRelativeTime } from '@global/utils/datesUtils';
import { SendIcon, ArrowDownIcon } from '@global/icons';
import { BlessingButton } from './BlessingButton';
import { toggleCommentBlessingService } from '../_services/feedService';
import { useQueryClient } from '@tanstack/react-query';

interface InlineCommentsProps {
  postId: number;
  comments: Comment[];
  onSubmitComment: (data: CreateCommentDto) => void;
  isLoadingComments: boolean;
  isSubmitting?: boolean;
  showLoadMore?: boolean;
  onLoadMore?: () => void;
  isLoadingMore?: boolean;
}

export const InlineComments = ({
  postId,
  comments,
  onSubmitComment,
  isLoadingComments,
  isSubmitting,
  showLoadMore,
  onLoadMore,
  isLoadingMore,
}: InlineCommentsProps) => {
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<number | null>(null);

  const handleSubmit = () => {
    if (!newComment.trim()) return;

    onSubmitComment({
      content: newComment.trim(),
      parentId: replyingTo || undefined,
    });

    setNewComment('');
    setReplyingTo(null);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  if (isLoadingComments) {
    return (
      <div className="flex justify-center py-4">
        <Spinner size="sm" />
      </div>
    );
  }

  return (
    <div className="space-y-4 pt-4">
      <Divider />

      {/* Formulario para nuevo comentario principal */}
      {!replyingTo && (
        <div className="flex gap-3">
          <Avatar size="sm" name="You" className="flex-shrink-0" />
          <div className="flex-1 space-y-2">
            <Textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              onKeyDown={handleKeyPress}
              placeholder="Escribe un comentario..."
              minRows={1}
              maxRows={4}
              size="sm"
              variant="bordered"
            />
            <div className="flex items-center justify-end">
              <Button
                size="sm"
                color="primary"
                onPress={handleSubmit}
                isDisabled={!newComment.trim()}
                isLoading={isSubmitting}
                startContent={!isSubmitting && <SendIcon className="h-4 w-4" />}
              >
                Comentar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Lista de comentarios */}
      <div className="space-y-3">
        {comments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            postId={postId}
            onReply={setReplyingTo}
            replyingTo={replyingTo}
            newComment={newComment}
            setNewComment={setNewComment}
            onSubmitComment={onSubmitComment}
            isSubmitting={isSubmitting}
            handleSubmit={handleSubmit}
            handleKeyPress={handleKeyPress}
          />
        ))}
      </div>

      {/* Botón "Ver más comentarios" */}
      {showLoadMore && (
        <div className="flex justify-center pt-2">
          <Button
            size="sm"
            variant="light"
            onPress={onLoadMore}
            isLoading={isLoadingMore}
            startContent={
              !isLoadingMore && <ArrowDownIcon className="h-4 w-4" />
            }
          >
            Ver más comentarios
          </Button>
        </div>
      )}
    </div>
  );
};

// Componente para un comentario individual
interface CommentItemProps {
  comment: Comment;
  postId: number;
  onReply: (commentId: number) => void;
  replyingTo: number | null;
  newComment: string;
  setNewComment: (value: string) => void;
  onSubmitComment: (data: CreateCommentDto) => void;
  isSubmitting?: boolean;
  handleSubmit: () => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
}

function CommentItem({
  comment,
  postId,
  onReply,
  replyingTo,
  newComment,
  setNewComment,
  onSubmitComment,
  isSubmitting,
  handleSubmit,
  handleKeyPress,
}: CommentItemProps) {
  const queryClient = useQueryClient();
  const [blessingCommentId, setBlessingCommentId] = useState<number | null>(
    null,
  );

  const toggleBlessing = toggleCommentBlessingService({
    commentId: blessingCommentId || 0,
  });

  const isBlessed = comment.userBlessing && comment.userBlessing.length > 0;

  const handleToggleBlessing = () => {
    setBlessingCommentId(comment.id);
    toggleBlessing.mutate(null, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['comments', postId.toString()],
        });
        queryClient.invalidateQueries({ queryKey: ['feed-infinite'] });
        setBlessingCommentId(null);
      },
    });
  };

  return (
    <div className="flex gap-3" id={`comment-${comment.id}`}>
      <Avatar
        size="sm"
        name={comment.author.name}
        className="mt-1 flex-shrink-0"
      />
      <div className="flex-1 space-y-2">
        <div className="rounded-lg bg-gray-50 p-3">
          <div className="mb-1 flex items-center gap-2">
            <span className="text-sm font-medium">{comment.author.name}</span>
            <span className="text-xs text-gray-500">
              {formatRelativeTime(comment.createdAt)}
            </span>
          </div>
          <p className="text-sm">{comment.content}</p>
        </div>

        <div className="flex items-center gap-2">
          <BlessingButton
            size="sm"
            isBlessed={isBlessed || false}
            count={comment._count?.blessings || 0}
            onPress={handleToggleBlessing}
            isLoading={
              toggleBlessing.isPending && blessingCommentId === comment.id
            }
          />

          <Button
            size="sm"
            variant="light"
            onPress={() => onReply(comment.id)}
            className={replyingTo === comment.id ? 'text-primary' : ''}
          >
            Responder
          </Button>
        </div>

        {/* Formulario de respuesta */}
        {replyingTo === comment.id && (
          <div className="mt-3 flex gap-3">
            <Avatar size="sm" name="You" className="flex-shrink-0" />
            <div className="flex-1 space-y-2">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Escribe una respuesta..."
                minRows={1}
                maxRows={4}
                size="sm"
                variant="bordered"
                autoFocus
              />
              <div className="flex items-center justify-between">
                <Button
                  size="sm"
                  variant="light"
                  onPress={() => {
                    onReply(-1); // Reset reply
                    setNewComment('');
                  }}
                >
                  Cancelar respuesta
                </Button>
                <Button
                  size="sm"
                  color="primary"
                  onPress={handleSubmit}
                  isDisabled={!newComment.trim()}
                  isLoading={isSubmitting}
                  startContent={
                    !isSubmitting && <SendIcon className="h-4 w-4" />
                  }
                >
                  Responder
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Respuestas anidadas */}
        {comment.replies && comment.replies.length > 0 && (
          <div className="ml-4 space-y-2 border-l-2 border-gray-100 pl-4">
            {comment.replies.map((reply) => (
              <CommentItem
                key={reply.id}
                comment={reply}
                postId={postId}
                onReply={onReply}
                replyingTo={replyingTo}
                newComment={newComment}
                setNewComment={setNewComment}
                onSubmitComment={onSubmitComment}
                isSubmitting={isSubmitting}
                handleSubmit={handleSubmit}
                handleKeyPress={handleKeyPress}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
