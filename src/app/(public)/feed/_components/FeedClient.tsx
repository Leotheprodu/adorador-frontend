'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import {
  Button,
  Spinner,
  useDisclosure,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
} from '@nextui-org/react';
import { PlusIcon } from '@global/icons';
import { useFeedInfinite } from '../_hooks/useFeedInfinite';
import { useFeedWebSocket } from '../_hooks/useFeedWebSocket';
import { PostCard } from './PostCard';
import { CreatePostModal } from './CreatePostModal';
import { CommentSection } from './CommentSection';
import { CopySongModal } from './CopySongModal';
import {
  createPostService,
  toggleBlessingService,
  getCommentsService,
  createCommentService,
  copySongService,
  getSongsOfBandForFeed,
} from '../_services/feedService';
import { useQueryClient } from '@tanstack/react-query';
import {
  CreatePostDto,
  CreateCommentDto,
  CopySongDto,
  Post,
} from '../_interfaces/feedInterface';
import { $user } from '@stores/users';
import { useStore } from '@nanostores/react';

export const FeedClient = () => {
  const user = useStore($user);
  const queryClient = useQueryClient();
  const observerTarget = useRef<HTMLDivElement>(null);

  // States
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [selectedCopySong, setSelectedCopySong] = useState<Post | null>(null);
  const [selectedBandIdForPost, setSelectedBandIdForPost] = useState<
    number | null
  >(null);
  const [blessingPostId, setBlessingPostId] = useState<number | null>(null);
  const [commentPostId, setCommentPostId] = useState<number | null>(null);

  // Modals
  const {
    isOpen: isCreatePostOpen,
    onOpen: onCreatePostOpen,
    onClose: onCreatePostClose,
  } = useDisclosure();
  const {
    isOpen: isCommentsOpen,
    onOpen: onCommentsOpen,
    onClose: onCommentsClose,
  } = useDisclosure();
  const {
    isOpen: isCopySongOpen,
    onOpen: onCopySongOpen,
    onClose: onCopySongClose,
  } = useDisclosure();

  // Queries
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useFeedInfinite({ limit: 10 });

  // Obtener comentarios (solo si hay postId seleccionado)
  const { data: commentsData, isLoading: isLoadingComments } =
    getCommentsService({
      postId: selectedPostId || 0,
      isEnabled: !!selectedPostId,
    });

  // Obtener canciones de la banda seleccionada (solo si hay bandId)
  const { data: bandSongs } = getSongsOfBandForFeed(
    selectedBandIdForPost || 0,
    !!selectedBandIdForPost,
  );

  // Mutations
  const createPost = createPostService();
  const copySong = copySongService({ postId: selectedCopySong?.id || 0 });
  const toggleBlessing = toggleBlessingService({ postId: blessingPostId });
  const createComment = createCommentService({ postId: commentPostId || 0 });

  // WebSocket
  useFeedWebSocket({
    enabled: true,
    onNewPost: () => {
      // Refetch para mostrar el nuevo post
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
    onCreatePostClose();
    setSelectedBandIdForPost(null); // Reset al cerrar
    queryClient.invalidateQueries({ queryKey: ['feed-infinite'] });
  };

  const handleBandChange = (bandId: number) => {
    setSelectedBandIdForPost(bandId);
  };

  const handleCloseCreatePost = () => {
    setSelectedBandIdForPost(null);
    onCreatePostClose();
  };

  const handleToggleBlessing = (postId: number) => {
    setBlessingPostId(postId);
    toggleBlessing.mutate(null, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['feed-infinite'] });
        queryClient.invalidateQueries({
          queryKey: ['post', postId.toString()],
        });
        setBlessingPostId(null);
      },
    });
  };

  const handleOpenComments = (postId: number) => {
    setSelectedPostId(postId);
    setCommentPostId(postId);
    onCommentsOpen();
  };

  const handleCloseComments = () => {
    setSelectedPostId(null);
    setCommentPostId(null);
    onCommentsClose();
  };

  const handleCreateComment = (data: CreateCommentDto) => {
    if (!commentPostId) return;
    createComment.mutate(data, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ['comments', commentPostId.toString()],
        });
        queryClient.invalidateQueries({ queryKey: ['feed-infinite'] });
      },
    });
  };

  const handleOpenCopySong = (postId: number) => {
    const post = data?.pages
      .flatMap((page) => page.items)
      .find((p) => p.id === postId);
    if (post) {
      setSelectedCopySong(post);
      onCopySongOpen();
    }
  };

  const handleShareSongToRequest = (postId: number) => {
    // Encontrar el post de la solicitud
    const post = data?.pages
      .flatMap((page) => page.items)
      .find((p) => p.id === postId);
    if (post && post.type === 'SONG_REQUEST') {
      // Cerrar modal de comentarios y abrir modal de copiar canción
      // pero en este caso es para "compartir" en respuesta a la solicitud
      setSelectedCopySong(post);
      handleCloseComments();
      onCopySongOpen();
    }
  };

  const handleCloseCopySong = () => {
    setSelectedCopySong(null);
    onCopySongClose();
  };

  const handleCopySong = async (copyData: CopySongDto) => {
    if (!selectedCopySong) return;
    await copySong.mutateAsync(copyData);
    handleCloseCopySong();
    queryClient.invalidateQueries({ queryKey: ['feed-infinite'] });
  };

  // Flatten posts from pages
  const posts = data?.pages.flatMap((page) => page.items) || [];

  // Obtener bandas del usuario desde membersofBands
  const userBands =
    user?.membersofBands
      ?.filter((membership) => membership.isActive)
      .map((membership) => membership.band) || [];

  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <Button
          color="primary"
          onPress={onCreatePostOpen}
          startContent={<PlusIcon className="h-5 w-5" />}
          className="ml-auto"
        >
          Crear Post
        </Button>
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
              <p className="mb-4 text-default-500">
                Aún no hay publicaciones en el feed
              </p>
              <Button color="primary" onPress={onCreatePostOpen}>
                Crear la primera publicación
              </Button>
            </div>
          ) : (
            posts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                onToggleBlessing={handleToggleBlessing}
                onComment={handleOpenComments}
                onCopySong={
                  post.type === 'SONG_SHARE' ? handleOpenCopySong : undefined
                }
              />
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

      {/* Modal: Crear Post */}
      <CreatePostModal
        isOpen={isCreatePostOpen}
        onClose={handleCloseCreatePost}
        onSubmit={handleCreatePost}
        isLoading={createPost.isPending}
        userBands={userBands}
        bandSongs={bandSongs || []}
        onBandChange={handleBandChange}
      />

      {/* Modal: Comentarios */}
      <Modal
        isOpen={isCommentsOpen}
        onClose={handleCloseComments}
        size="2xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          <ModalHeader>Comentarios</ModalHeader>
          <ModalBody>
            <CommentSection
              comments={commentsData || []}
              onSubmitComment={handleCreateComment}
              isLoadingComments={isLoadingComments}
              isSubmitting={createComment.isPending}
              post={
                selectedPostId
                  ? data?.pages
                      .flatMap((page) => page.items)
                      .find((p) => p.id === selectedPostId)
                  : undefined
              }
              onShareSongToRequest={handleShareSongToRequest}
            />
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Modal: Copiar/Compartir Canción */}
      {selectedCopySong && (
        <CopySongModal
          isOpen={isCopySongOpen}
          onClose={handleCloseCopySong}
          onSubmit={handleCopySong}
          isLoading={copySong.isPending}
          userBands={userBands}
          songTitle={
            selectedCopySong.type === 'SONG_REQUEST'
              ? selectedCopySong.requestedSongTitle || 'Canción solicitada'
              : selectedCopySong.sharedSong?.title || 'Canción'
          }
          currentKey={selectedCopySong.sharedSong?.key || null}
          currentTempo={selectedCopySong.sharedSong?.tempo || null}
        />
      )}
    </div>
  );
};
