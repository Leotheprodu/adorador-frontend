'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import {
  Spinner,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
} from "@heroui/react";
import { useFeedInfinite } from '../_hooks/useFeedInfinite';
import { useFeedWebSocket } from '../_hooks/useFeedWebSocket';
import { useFeedModals } from '../_hooks/useFeedModals';
import { useFeedSongActions } from '../_hooks/useFeedSongActions';
import { useFeedNavigation } from '../_hooks/useFeedNavigation';
import { PostCard } from './PostCard';
import { CreatePostInline } from './CreatePostInline';
import { CommentSection } from './CommentSection';
import { CopySongModal } from './CopySongModal';
import { SongQuickViewModal } from './SongQuickViewModal';
import {
  createPostService,
  getCommentsService,
  createCommentService,
  copySongService,
  copySongDirectService,
  getSongsOfBandForFeed,
} from '../_services/feedService';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import {
  CreatePostDto,
  CreateCommentDto,
  CopySongDto,
} from '../_interfaces/feedInterface';
import { $user } from '@stores/users';
import { useStore } from '@nanostores/react';
import { UIGuard } from '@global/utils/UIGuard';
import { useInvalidateSubscriptionLimits } from '@bands/[bandId]/suscripcion/_hooks/useInvalidateSubscriptionLimits';

export const FeedClient = () => {
  const user = useStore($user);
  const queryClient = useQueryClient();
  const { invalidateLimits } = useInvalidateSubscriptionLimits();
  const observerTarget = useRef<HTMLDivElement>(null);

  // Estado local
  const [selectedBandIdForPost, setSelectedBandIdForPost] = useState<
    number | null
  >(null);

  // Hooks personalizados
  const modals = useFeedModals();
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useFeedInfinite({ limit: 10 });

  const songActions = useFeedSongActions({
    data,
    selectedViewSong: modals.selectedViewSong,
    setSelectedCopySong: modals.setSelectedCopySong,
    setSelectedViewSong: modals.setSelectedViewSong,
    setSuggestedKey: modals.setSuggestedKey,
    setSuggestedTempo: modals.setSuggestedTempo,
    setCopySongId: modals.setCopySongId,
    onCopySongOpen: modals.onCopySongOpen,
    onViewSongOpen: modals.onViewSongOpen,
  });

  useFeedNavigation({
    isCommentsOpen: modals.isCommentsOpen,
    selectedPostId: modals.selectedPostId,
    onCommentsOpen: modals.onCommentsOpen,
    setSelectedPostId: modals.setSelectedPostId,
    setCommentPostId: modals.setCommentPostId,
  });

  // Queries
  const { data: commentsData, isLoading: isLoadingComments } =
    getCommentsService({
      postId: modals.selectedPostId || 0,
      isEnabled: !!modals.selectedPostId,
    });

  const { data: bandSongs } = getSongsOfBandForFeed(
    selectedBandIdForPost || 0,
    !!selectedBandIdForPost,
  );

  // Mutations
  const createPost = createPostService();
  const createComment = createCommentService({
    postId: modals.commentPostId || 0,
  });
  const copySong = copySongService({ postId: modals.copySongPostId || 0 });
  const copySongDirect = copySongDirectService({
    songId: modals.copySongId || 0,
  });

  // WebSocket
  useFeedWebSocket({
    enabled: true,
    onNewPost: () => {
      refetch();
    },
  });

  // Intersection Observer para scroll infinito
  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [target] = entries;
      if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage],
  );

  useEffect(() => {
    const element = observerTarget.current;
    if (!element) return;

    const option = { threshold: 0.1 };
    const observer = new IntersectionObserver(handleObserver, option);
    observer.observe(element);

    return () => observer.unobserve(element);
  }, [handleObserver]);

  // Handlers
  const handleCreatePost = async (data: CreatePostDto) => {
    await createPost.mutateAsync(data);
    setSelectedBandIdForPost(null);
    queryClient.invalidateQueries({ queryKey: ['feed-infinite'] });
  };

  const handleBandChange = (bandId: number) => {
    setSelectedBandIdForPost(bandId);
  };

  const handleCreateComment = (data: CreateCommentDto) => {
    if (!modals.commentPostId) return;
    createComment.mutate(data, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['comments', modals.commentPostId!.toString()],
        });
        queryClient.invalidateQueries({ queryKey: ['feed-infinite'] });
      },
    });
  };

  const handleCopySong = async (copyData: CopySongDto) => {
    if (!modals.selectedCopySong) return;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isFromComment = (modals.selectedCopySong as any)._isFromComment;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const commentId = (modals.selectedCopySong as any)._commentId;

    if (isFromComment) {
      modals.setCopySongId(modals.selectedCopySong.sharedSongId!);
      const copyDataWithComment = {
        ...copyData,
        commentId: commentId,
      };
      copySongDirect.mutate(copyDataWithComment, {
        onSuccess: () => {
          modals.handleCloseCopySong();
          toast.success('¡Canción copiada exitosamente!');
          queryClient.invalidateQueries({ queryKey: ['feed-infinite'] });
          // Invalidar límites de suscripción de la banda destino (currentSongs aumentó)
          invalidateLimits(copyData.targetBandId.toString());
          modals.setCopySongId(null);
        },
        onError: (error) => {
          console.error('Error copiando canción:', error);
          toast.error('Error al copiar la canción');
        },
      });
    } else {
      modals.setCopySongPostId(modals.selectedCopySong.id);
      copySong.mutate(copyData, {
        onSuccess: () => {
          modals.handleCloseCopySong();
          toast.success('¡Canción copiada exitosamente!');
          queryClient.invalidateQueries({ queryKey: ['feed-infinite'] });
          queryClient.invalidateQueries({
            queryKey: ['post', modals.selectedCopySong!.id.toString()],
          });
          // Invalidar límites de suscripción de la banda destino (currentSongs aumentó)
          invalidateLimits(copyData.targetBandId.toString());
          modals.setCopySongPostId(null);
        },
        onError: (error) => {
          console.error('Error copiando canción:', error);
          toast.error('Error al copiar la canción');
        },
      });
    }
  };

  // Flatten posts from pages
  const posts = data?.pages.flatMap((page) => page.items) || [];

  // Obtener bandas del usuario
  const userBands =
    user?.membersofBands
      ?.filter((membership) => membership.isActive)
      .map((membership) => membership.band) || [];

  return (
    <UIGuard isLoggedIn={true} isLoading={isLoading}>
      <div className="container mx-auto max-w-2xl px-4 py-8">
        {/* Crear Post Inline */}
        <div className="mb-6">
          <CreatePostInline
            onSubmit={handleCreatePost}
            isLoading={createPost.isPending}
            userBands={userBands}
            bandSongs={bandSongs || []}
            selectedBandId={selectedBandIdForPost || undefined}
            onBandChange={handleBandChange}
          />
        </div>

        {/* Loading inicial */}
        {isLoading && (
          <div className="flex justify-center py-12">
            <Spinner size="lg" />
          </div>
        )}

        {/* Posts */}
        {!isLoading && (
          <div className="space-y-4">
            {posts.length === 0 ? (
              <div className="py-12 text-center">
                <p className="text-foreground-500">
                  Aún no hay publicaciones en el feed. ¡Usa el formulario de
                  arriba para crear la primera publicación!
                </p>
              </div>
            ) : (
              posts.map((post) => (
                <div key={post.id} id={`post-${post.id}`}>
                  <PostCard
                    post={post}
                    onCopySong={
                      post.type === 'SONG_SHARE'
                        ? songActions.handleOpenCopySong
                        : undefined
                    }
                    onViewSong={
                      post.type === 'SONG_SHARE'
                        ? songActions.handleOpenViewSong
                        : undefined
                    }
                    userBands={userBands}
                    onCopySongFromComment={
                      songActions.handleCopySongFromCommentSimplified
                    }
                    onViewSongFromComment={
                      songActions.handleOpenViewSongFromComment
                    }
                  />
                </div>
              ))
            )}

            {/* Observer target para scroll infinito */}
            <div
              ref={observerTarget}
              className="flex h-10 items-center justify-center"
            >
              {isFetchingNextPage && <Spinner />}
            </div>
          </div>
        )}

        {/* Modal: Comentarios */}
        <Modal
          isOpen={modals.isCommentsOpen}
          onClose={modals.handleCloseComments}
          size="2xl"
          scrollBehavior="inside"
        >
          <ModalContent>
            <ModalHeader>Comentarios</ModalHeader>
            <ModalBody>
              <CommentSection
                comments={commentsData?.items || []}
                onSubmitComment={handleCreateComment}
                isLoadingComments={isLoadingComments}
                isSubmitting={createComment.isPending}
                post={
                  modals.selectedPostId
                    ? data?.pages
                      .flatMap((page) => page.items)
                      .find((p) => p.id === modals.selectedPostId)
                    : undefined
                }
                onViewSong={songActions.handleViewSongFromComment}
                onCopySong={songActions.handleCopySongFromComment}
              />
            </ModalBody>
          </ModalContent>
        </Modal>

        {/* Modal: Copiar/Compartir Canción */}
        {modals.selectedCopySong && (
          <CopySongModal
            isOpen={modals.isCopySongOpen}
            onClose={modals.handleCloseCopySong}
            onSubmit={handleCopySong}
            isLoading={copySong.isPending}
            userBands={userBands}
            songTitle={
              modals.selectedCopySong.type === 'SONG_REQUEST'
                ? modals.selectedCopySong.requestedSongTitle ||
                'Canción solicitada'
                : modals.selectedCopySong.sharedSong?.title || 'Canción'
            }
            currentKey={modals.selectedCopySong.sharedSong?.key || null}
            currentTempo={modals.selectedCopySong.sharedSong?.tempo || null}
            suggestedKey={modals.suggestedKey}
            suggestedTempo={modals.suggestedTempo}
          />
        )}

        {/* Modal: Vista Rápida de Canción */}
        {modals.selectedViewSong && (
          <SongQuickViewModal
            isOpen={modals.isViewSongOpen}
            onClose={modals.handleCloseViewSong}
            post={modals.selectedViewSong}
            onCopySong={songActions.handleOpenCopySong}
          />
        )}
      </div>
    </UIGuard>
  );
};
