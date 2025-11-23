'use client';

import { Avatar, Button, Textarea, Spinner, Divider } from '@nextui-org/react';
import { SendIcon, ArrowDownIcon } from '@global/icons';
import { ShareSongCommentModal } from './ShareSongCommentModal';
import { CopySongModal } from './CopySongModal';
import { CommentItem } from './CommentItem';
import { useInlineComments } from '../_hooks/useInlineComments';

interface InlineCommentsProps {
  postId: number;
  isVisible: boolean;
  postType: 'SONG_REQUEST' | 'SONG_SHARE';
  userBands?: Array<{ id: number; name: string }>;
  onCopySong?: (songId: number, key?: string, tempo?: number) => void;
  onViewSong?: (songId: number, bandId: number) => void;
}

/**
 * Componente para mostrar comentarios inline con paginación
 * Refactorizado para usar hooks y sub-componentes
 */
export const InlineComments = ({
  postId,
  isVisible,
  postType,
  userBands = [],
  onCopySong,
  onViewSong,
}: InlineCommentsProps) => {
  const {
    // Datos de comentarios
    allComments,
    isLoadingComments,
    isLoadingMore,
    hasMore,
    handleLoadMoreComments,

    // Acciones de comentarios
    newComment,
    setNewComment,
    replyingTo,
    isShareSongModalOpen,
    isSubmitting,
    handleSubmit,
    handleShareFromSelector,
    handleKeyPress,
    handleReply,
    openShareSongModal,
    closeShareSongModal,

    // Copiar canciones
    copySongData,
    isLoading: isCopyingLoading,
    handleCopySongFromComment,
    handleCopySongConfirm,
    handleCloseCopySong,
  } = useInlineComments({ postId, isVisible, onCopySong });

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
            {/* Si es SONG_REQUEST, solo mostrar botón de compartir canción */}
            {postType === 'SONG_REQUEST' ? (
              <div className="space-y-2">
                <div className="rounded-lg bg-content2 p-4 text-center">
                  <p className="mb-3 text-sm text-foreground-500">
                    Este post solicita canciones. Comparte una canción de tu
                    banda para responder.
                  </p>
                  <Button
                    color="success"
                    variant="flat"
                    onPress={openShareSongModal}
                    isDisabled={isSubmitting}
                  >
                    🎵 Compartir Canción
                  </Button>
                </div>
              </div>
            ) : (
              // Para SONG_SHARE, permitir comentarios normales
              <>
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
                <div className="flex items-center justify-between">
                  <Button
                    size="sm"
                    variant="light"
                    color="success"
                    onPress={openShareSongModal}
                    isDisabled={isSubmitting}
                  >
                    🎵 Compartir Canción
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
                    Comentar
                  </Button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* Lista de comentarios */}
      <div className="space-y-3">
        {allComments.map((comment) => (
          <CommentItem
            key={comment.id}
            comment={comment}
            postId={postId}
            onReply={handleReply}
            replyingTo={replyingTo}
            newComment={newComment}
            setNewComment={setNewComment}
            handleSubmit={handleSubmit}
            handleKeyPress={handleKeyPress}
            isSubmitting={isSubmitting}
            onShareSongInReply={openShareSongModal}
            onViewSong={onViewSong}
            onCopySong={onCopySong}
            handleCopySongFromComment={handleCopySongFromComment}
          />
        ))}
      </div>

      {/* Botón "Ver más comentarios" */}
      {hasMore && (
        <div className="flex justify-center pt-2">
          <Button
            size="sm"
            variant="light"
            onPress={handleLoadMoreComments}
            isLoading={isLoadingMore}
            startContent={
              !isLoadingMore && <ArrowDownIcon className="h-4 w-4" />
            }
          >
            Ver más comentarios
          </Button>
        </div>
      )}

      {/* Modal para compartir canción */}
      <ShareSongCommentModal
        isOpen={isShareSongModalOpen}
        onClose={closeShareSongModal}
        onShare={handleShareFromSelector}
        isSharing={isSubmitting}
      />

      {/* Modal para copiar canción */}
      {copySongData && (
        <CopySongModal
          isOpen={!!copySongData}
          onClose={handleCloseCopySong}
          onSubmit={handleCopySongConfirm}
          isLoading={isCopyingLoading}
          userBands={userBands}
          songTitle={copySongData.title}
          currentKey={copySongData.key}
          currentTempo={copySongData.tempo}
        />
      )}
    </div>
  );
};
