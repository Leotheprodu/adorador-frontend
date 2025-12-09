'use client';

import {
  Card,
  CardBody,
  Button,
  Textarea,
  Spinner,
} from "@heroui/react";
import { useCommentSection } from '../_hooks/useCommentSection';
import { ShareSongCommentModal } from './ShareSongCommentModal';
import { CommentItem } from './CommentItem';
import { SendIcon } from '@global/icons';
import { CommentSectionProps } from './_interfaces/commentSectionInterfaces';

export const CommentSection = ({
  comments,
  onSubmitComment,
  isLoadingComments,
  isSubmitting,
  post,
  onViewSong,
  onCopySong,
}: CommentSectionProps) => {
  const {
    newComment,
    setNewComment,
    replyingTo,
    isShareSongModalOpen,
    handleSubmit,
    handleShareSong,
    handleReply,
    handleCancelReply,
    handleOpenShareSongModal,
    handleCloseShareSongModal,
  } = useCommentSection({ onSubmitComment });

  const isRequest = post?.type === 'SONG_REQUEST';

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
          onPress={handleOpenShareSongModal}
          className="w-full"
        >
          🎵 Tengo esta canción - Compartir
        </Button>
      )}

      {/* Modal para compartir canción */}
      <ShareSongCommentModal
        isOpen={isShareSongModalOpen}
        onClose={handleCloseShareSongModal}
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
        <div className="py-8 text-center text-foreground-400">
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
