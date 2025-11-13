'use client';

import { useState, useEffect } from 'react';
import {
  Avatar,
  Button,
  Textarea,
  Spinner,
  Divider,
  Chip,
  Tooltip,
} from '@nextui-org/react';
import { Comment as FeedComment } from '../_interfaces/feedInterface';
import { formatRelativeTime } from '@global/utils/datesUtils';
import { SendIcon, ArrowDownIcon, DownloadIcon } from '@global/icons';
import { BlessingButton } from './BlessingButton';
import { FeedYouTubePlayer } from './FeedYouTubePlayer';
import { CopySongModal } from './CopySongModal';
import {
  createCommentService,
  toggleCommentBlessingService,
  copySongDirectService,
} from '../_services/feedService';
import { useQueryClient } from '@tanstack/react-query';
import { usePaginatedData } from '@global/hooks/usePaginatedData';
import toast from 'react-hot-toast';
import { Server1API } from '@global/config/constants';
import { useStore } from '@nanostores/react';
import { $feedNavigation, clearFeedNavigation } from '@stores/feedNavigation';
import { ShareSongCommentModal } from './ShareSongCommentModal';

interface InlineCommentsProps {
  postId: number;
  isVisible: boolean;
  postType: 'SONG_REQUEST' | 'SONG_SHARE';
  userBands?: Array<{ id: number; name: string }>;
  onCopySong?: (songId: number, key?: string, tempo?: number) => void;
  onViewSong?: (songId: number, bandId: number) => void;
}

export const InlineComments = ({
  postId,
  isVisible,
  postType,
  userBands = [],
  onCopySong,
  onViewSong,
}: InlineCommentsProps) => {
  const queryClient = useQueryClient();
  const feedNavigation = useStore($feedNavigation);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<number | null>(null);
  const [isShareSongModalOpen, setIsShareSongModalOpen] = useState(false);
  const [copySongData, setCopySongData] = useState<{
    songId: number;
    title: string;
    key?: string | null;
    tempo?: number | null;
    commentId?: number;
  } | null>(null);

  // Hook del servicio para copiar canción (usa el songId del copySongData actual)
  const copySongDirect = copySongDirectService({
    songId: copySongData?.songId || 0,
  });

  // Usar el hook genérico de paginación
  const {
    items: allComments,
    isLoading: isLoadingComments,
    isLoadingMore,
    hasMore,
    loadMore,
    reset,
  } = usePaginatedData<FeedComment>({
    baseUrl: `${Server1API}/feed/posts/${postId}/comments`,
    queryKey: ['comments', postId.toString()],
    limit: 10,
    isEnabled: isVisible,
    refetchOnMount: true,
  });

  const createComment = createCommentService({ postId });

  // Resetear estado al cerrar comentarios
  useEffect(() => {
    if (!isVisible) {
      reset();
      setNewComment('');
      setReplyingTo(null);
    }
  }, [isVisible, reset]);

  // Buscar comentario específico cuando venga de notificaciones
  useEffect(() => {
    if (
      isVisible &&
      feedNavigation.targetCommentId &&
      feedNavigation.targetPostId === postId &&
      allComments.length > 0
    ) {
      const targetComment = allComments.find(
        (comment) => comment.id === feedNavigation.targetCommentId,
      );

      if (targetComment) {
        // Comentario encontrado, hacer scroll
        setTimeout(() => {
          const element = document.querySelector(
            `#comment-${targetComment.id}`,
          );
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'center' });
            element.classList.add(
              'ring-2',
              'ring-brand-purple-400',
              'rounded-lg',
            );
            setTimeout(() => {
              element.classList.remove(
                'ring-2',
                'ring-brand-purple-400',
                'rounded-lg',
              );
            }, 2000);
          }
          // Limpiar la navegación una vez completada
          clearFeedNavigation();
        }, 300);
      } else if (hasMore) {
        // Comentario no encontrado, cargar más comentarios para buscarlo
        loadMore();
      } else {
        // No hay más comentarios para cargar y no se encontró el comentario objetivo
        // Limpiar la navegación para evitar bucles infinitos
        clearFeedNavigation();
      }
    }
  }, [
    isVisible,
    feedNavigation.targetCommentId,
    feedNavigation.targetPostId,
    postId,
    allComments,
    hasMore,
    loadMore,
  ]);

  const handleSubmit = () => {
    if (!newComment.trim()) return;

    createComment.mutate(
      {
        content: newComment.trim(),
        parentId: replyingTo || undefined,
      },
      {
        onSuccess: () => {
          // Resetear y recargar comentarios
          reset();
          setNewComment('');
          setReplyingTo(null);
          queryClient.invalidateQueries({
            queryKey: ['comments', postId.toString()],
          });
          queryClient.invalidateQueries({ queryKey: ['feed-infinite'] });
        },
      },
    );
  };

  // Handler compatible con ShareSongCommentModal (devuelve songId y description)
  const handleShareFromSelector = (songId: number, description: string) => {
    createComment.mutate(
      {
        content: description || '',
        parentId: replyingTo || undefined,
        sharedSongId: songId,
      },
      {
        onSuccess: () => {
          reset();
          setNewComment('');
          setReplyingTo(null);
          setIsShareSongModalOpen(false);
          queryClient.invalidateQueries({
            queryKey: ['comments', postId.toString()],
          });
          queryClient.invalidateQueries({ queryKey: ['feed-infinite'] });
        },
      },
    );
  };

  // Handler para copiar canción desde comentario
  const handleCopySongFromComment = (
    songId: number,
    title: string,
    key?: string | null,
    tempo?: number | null,
    commentId?: number,
  ) => {
    setCopySongData({ songId, title, key, tempo, commentId });
  };

  // Handler para cuando se confirma la copia
  const handleCopySongConfirm = (data: {
    targetBandId: number;
    newKey?: string;
    newTempo?: number;
  }) => {
    if (!copySongData) return;

    // Incluir el commentId si está disponible
    const copyData = {
      ...data,
      ...(copySongData.commentId && { commentId: copySongData.commentId }),
    };

    copySongDirect.mutate(copyData, {
      onSuccess: () => {
        setCopySongData(null);

        // Mostrar toast de éxito
        toast.success('¡Canción copiada exitosamente!');

        // Invalidar consultas inmediatamente
        queryClient.invalidateQueries({
          queryKey: ['comments', postId.toString()],
        });
        queryClient.invalidateQueries({ queryKey: ['feed-infinite'] });

        // Forzar refetch después de un pequeño delay para asegurar actualización
        setTimeout(() => {
          queryClient.refetchQueries({
            queryKey: ['comments', postId.toString()],
          });
        }, 100);

        // Llamar callback opcional para notificar al componente padre
        if (onCopySong) {
          onCopySong(
            copySongData.songId,
            copySongData.key || undefined,
            copySongData.tempo || undefined,
          );
        }
      },
      onError: (error) => {
        console.error('Error copiando canción:', error);
        toast.error('Error al copiar la canción');
      },
    });
  };

  const handleLoadMoreComments = () => {
    if (hasMore && !isLoadingComments) {
      loadMore();
    }
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
            {/* Si es SONG_REQUEST, solo mostrar botón de compartir canción */}
            {postType === 'SONG_REQUEST' ? (
              <div className="space-y-2">
                <div className="rounded-lg bg-content2 p-4 text-center">
                  <p className="mb-3 text-sm text-default-500">
                    Este post solicita canciones. Comparte una canción de tu
                    banda para responder.
                  </p>
                  <Button
                    color="success"
                    variant="flat"
                    onPress={() => setIsShareSongModalOpen(true)}
                    isDisabled={createComment.isPending}
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
                    onPress={() => setIsShareSongModalOpen(true)}
                    isDisabled={createComment.isPending}
                  >
                    🎵 Compartir Canción
                  </Button>
                  <Button
                    size="sm"
                    color="primary"
                    onPress={handleSubmit}
                    isDisabled={!newComment.trim()}
                    isLoading={createComment.isPending}
                    startContent={
                      !createComment.isPending && (
                        <SendIcon className="h-4 w-4" />
                      )
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
            onReply={setReplyingTo}
            replyingTo={replyingTo}
            newComment={newComment}
            setNewComment={setNewComment}
            handleSubmit={handleSubmit}
            handleKeyPress={handleKeyPress}
            isSubmitting={createComment.isPending}
            onShareSongInReply={() => {
              setIsShareSongModalOpen(true);
            }}
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
        onClose={() => {
          setIsShareSongModalOpen(false);
        }}
        onShare={handleShareFromSelector}
        isSharing={createComment.isPending}
      />

      {/* Modal para copiar canción */}
      {copySongData && (
        <CopySongModal
          isOpen={!!copySongData}
          onClose={() => {
            setCopySongData(null);
          }}
          onSubmit={handleCopySongConfirm}
          isLoading={copySongDirect.isPending}
          userBands={userBands}
          songTitle={copySongData.title}
          currentKey={copySongData.key}
          currentTempo={copySongData.tempo}
        />
      )}
    </div>
  );
};

// Componente para un comentario individual
interface CommentItemProps {
  comment: FeedComment;
  postId: number;
  onReply: (commentId: number | null) => void;
  replyingTo: number | null;
  newComment: string;
  setNewComment: (value: string) => void;
  handleSubmit: () => void;
  handleKeyPress: (e: React.KeyboardEvent) => void;
  isSubmitting?: boolean;
  onShareSongInReply: () => void;
  onViewSong?: (songId: number, bandId: number) => void;
  onCopySong?: (songId: number, key?: string, tempo?: number) => void;
  handleCopySongFromComment: (
    songId: number,
    title: string,
    key?: string | null,
    tempo?: number | null,
    commentId?: number,
  ) => void;
}

function CommentItem({
  comment,
  postId,
  onReply,
  replyingTo,
  newComment,
  setNewComment,
  handleSubmit,
  handleKeyPress,
  isSubmitting,
  onShareSongInReply,
  onViewSong,
  onCopySong,
  handleCopySongFromComment,
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

          {/* Contenido del comentario */}
          {comment.content && <p className="mb-2 text-sm">{comment.content}</p>}

          {/* Canción compartida en el comentario */}
          {comment.sharedSong && (
            <div className="mt-2 rounded-lg border border-success bg-content2 p-3">
              <div className="mb-2 flex items-center gap-2">
                <span className="text-xs font-medium text-success">
                  🎵 Canción compartida
                </span>
              </div>

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

              <div className="space-y-2">
                {/* Información de la canción */}
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
                  <Chip
                    size="sm"
                    variant="flat"
                    color={
                      comment.sharedSong.songType === 'worship'
                        ? 'primary'
                        : 'secondary'
                    }
                  >
                    {comment.sharedSong.songType === 'worship'
                      ? 'Adoración'
                      : 'Alabanza'}
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
                        onPress={() =>
                          onViewSong(
                            comment.sharedSong!.id,
                            comment.sharedSong!.bandId,
                          )
                        }
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
                        handleCopySongFromComment(
                          comment.sharedSong!.id,
                          comment.sharedSong!.title,
                          comment.sharedSong!.key,
                          comment.sharedSong!.tempo,
                          comment.id, // Agregar el commentId
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
          )}
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
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="light"
                    onPress={() => {
                      onReply(null); // Reset reply
                      setNewComment('');
                    }}
                  >
                    Cancelar respuesta
                  </Button>
                  <Button
                    size="sm"
                    variant="light"
                    color="success"
                    onPress={onShareSongInReply}
                    isDisabled={isSubmitting}
                  >
                    🎵 Compartir Canción
                  </Button>
                </div>
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
                handleSubmit={handleSubmit}
                handleKeyPress={handleKeyPress}
                isSubmitting={isSubmitting}
                onShareSongInReply={onShareSongInReply}
                onViewSong={onViewSong}
                onCopySong={onCopySong}
                handleCopySongFromComment={handleCopySongFromComment}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
