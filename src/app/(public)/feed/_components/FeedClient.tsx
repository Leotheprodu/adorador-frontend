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
import {
  CreatePostDto,
  CreateCommentDto,
  CopySongDto,
  Post,
} from '../_interfaces/feedInterface';
import { $user } from '@stores/users';
import { useStore } from '@nanostores/react';
import { UIGuard } from '@global/utils/UIGuard';

export const FeedClient = () => {
  const user = useStore($user);
  const queryClient = useQueryClient();
  const observerTarget = useRef<HTMLDivElement>(null);

  // States
  const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
  const [selectedCopySong, setSelectedCopySong] = useState<Post | null>(null);
  const [selectedViewSong, setSelectedViewSong] = useState<Post | null>(null);
  const [suggestedKey, setSuggestedKey] = useState<string | undefined>(
    undefined,
  );
  const [suggestedTempo, setSuggestedTempo] = useState<number | undefined>(
    undefined,
  );
  const [selectedBandIdForPost, setSelectedBandIdForPost] = useState<
    number | null
  >(null);
  const [commentPostId, setCommentPostId] = useState<number | null>(null);
  const [copySongPostId, setCopySongPostId] = useState<number | null>(null);
  const [copySongId, setCopySongId] = useState<number | null>(null);

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
  const {
    isOpen: isViewSongOpen,
    onOpen: onViewSongOpen,
    onClose: onViewSongClose,
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
  const createComment = createCommentService({ postId: commentPostId || 0 });
  const copySong = copySongService({ postId: copySongPostId || 0 });
  const copySongDirect = copySongDirectService({ songId: copySongId || 0 });

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

  const handleOpenCopySong = (
    postId: number,
    newSuggestedKey?: string,
    newSuggestedTempo?: number,
  ) => {
    // Si postId es 0, significa que es una vista desde comentario
    // Usar selectedViewSong directamente
    if (postId === 0 && selectedViewSong) {
      const tempPost = { ...selectedViewSong } as Post & {
        _isFromComment?: boolean;
      };
      tempPost._isFromComment = true;
      setSelectedCopySong(tempPost);
      setCopySongId(selectedViewSong.sharedSongId || 0);
      setSuggestedKey(newSuggestedKey);
      setSuggestedTempo(newSuggestedTempo);
      onCopySongOpen();
      return;
    }

    const post = data?.pages
      .flatMap((page) => page.items)
      .find((p) => p.id === postId);
    if (!post) return;

    setSelectedCopySong(post);
    setSuggestedKey(newSuggestedKey);
    setSuggestedTempo(newSuggestedTempo);
    onCopySongOpen();
  };

  const handleCloseCopySong = () => {
    setSelectedCopySong(null);
    setSuggestedKey(undefined);
    setSuggestedTempo(undefined);
    onCopySongClose();
  };

  const handleOpenViewSong = (postId: number) => {
    const post = data?.pages
      .flatMap((page) => page.items)
      .find((p) => p.id === postId);
    if (post && post.type === 'SONG_SHARE') {
      setSelectedViewSong(post);
      onViewSongOpen();
    }
  };

  const handleCloseViewSong = () => {
    setSelectedViewSong(null);
    onViewSongClose();
  };

  const handleViewSongFromComment = (songId: number, bandId: number) => {
    // Crear un objeto Post temporal para abrir el modal de vista rápida
    const tempPost: Post = {
      id: 0,
      type: 'SONG_SHARE',
      status: 'ACTIVE',
      title: '',
      description: null,
      requestedSongTitle: null,
      requestedArtist: null,
      requestedYoutubeUrl: null,
      authorId: 0,
      bandId: bandId,
      sharedSongId: songId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: { id: 0, name: '' },
      band: { id: bandId, name: '' },
      sharedSong: {
        id: songId,
        bandId: bandId,
        title: '',
        artist: null,
        key: null,
        tempo: null,
        songType: 'worship',
      },
      _count: { blessings: 0, comments: 0, songCopies: 0 },
      userBlessing: [],
    };
    setSelectedViewSong(tempPost);
    onViewSongOpen();
  };

  const handleCopySongFromComment = (
    postId: number,
    songId: number,
    bandId: number,
    key?: string | null,
    tempo?: number | null,
  ) => {
    // Crear un objeto Post temporal con la canción del comentario
    const tempPost: Post = {
      id: songId, // Usar songId como identificador temporal
      type: 'SONG_SHARE',
      status: 'ACTIVE',
      title: '',
      description: null,
      requestedSongTitle: null,
      requestedArtist: null,
      requestedYoutubeUrl: null,
      authorId: 0,
      bandId: bandId,
      sharedSongId: songId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      author: { id: 0, name: '' },
      band: { id: bandId, name: '' },
      sharedSong: {
        id: songId,
        bandId: bandId,
        title: '',
        artist: null,
        key: key || null,
        tempo: tempo || null,
        songType: 'worship',
      },
      _count: { blessings: 0, comments: 0, songCopies: 0 },
      userBlessing: [],
    } as Post & { _isFromComment?: boolean };

    (tempPost as Post & { _isFromComment?: boolean })._isFromComment = true;

    setSelectedCopySong(tempPost);
    setCopySongId(songId); // Guardar el songId para usar el servicio correcto
    onCopySongOpen();
  };

  const handleCopySong = async (copyData: CopySongDto) => {
    if (!selectedCopySong) return;

    // Verificar si es una copia desde comentario
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isFromComment = (selectedCopySong as any)._isFromComment;

    if (isFromComment) {
      // Usar el servicio directo para copiar por songId
      setCopySongId(selectedCopySong.sharedSongId!);
      copySongDirect.mutate(copyData, {
        onSuccess: () => {
          handleCloseCopySong();
          queryClient.invalidateQueries({ queryKey: ['feed-infinite'] });
          setCopySongId(null);
        },
      });
    } else {
      // Usar el servicio normal para copiar desde post
      setCopySongPostId(selectedCopySong.id);
      copySong.mutate(copyData, {
        onSuccess: () => {
          handleCloseCopySong();
          queryClient.invalidateQueries({ queryKey: ['feed-infinite'] });
          queryClient.invalidateQueries({
            queryKey: ['post', selectedCopySong.id.toString()],
          });
          setCopySongPostId(null);
        },
      });
    }
  };

  // Flatten posts from pages
  const posts = data?.pages.flatMap((page) => page.items) || [];

  // Obtener bandas del usuario desde membersofBands
  const userBands =
    user?.membersofBands
      ?.filter((membership) => membership.isActive)
      .map((membership) => membership.band) || [];

  return (
    <UIGuard isLoggedIn={true} isLoading={isLoading}>
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
                  onComment={handleOpenComments}
                  onCopySong={
                    post.type === 'SONG_SHARE' ? handleOpenCopySong : undefined
                  }
                  onViewSong={
                    post.type === 'SONG_SHARE' ? handleOpenViewSong : undefined
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
                onViewSong={handleViewSongFromComment}
                onCopySong={handleCopySongFromComment}
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
            suggestedKey={suggestedKey}
            suggestedTempo={suggestedTempo}
          />
        )}

        {/* Modal: Vista Rápida de Canción */}
        {selectedViewSong && (
          <SongQuickViewModal
            isOpen={isViewSongOpen}
            onClose={handleCloseViewSong}
            post={selectedViewSong}
            onCopySong={handleOpenCopySong}
          />
        )}
      </div>
    </UIGuard>
  );
};
