import { useEffect } from 'react';
import { usePaginatedData } from '@global/hooks/usePaginatedData';
import { Server1API } from '@global/config/constants';
import { Comment as FeedComment } from '../_interfaces/feedInterface';
import { useCommentActions } from './useCommentActions';
import { useCommentNavigation } from './useCommentNavigation';
import { useCommentCopySong } from './useCommentCopySong';

/**
 * Hook principal para InlineComments
 * Orquesta la lógica de comentarios, paginación, navegación y acciones
 */
export const useInlineComments = ({
    postId,
    isVisible,
    onCopySong,
}: {
    postId: number;
    isVisible: boolean;
    onCopySong?: (songId: number, key?: string, tempo?: number) => void;
}) => {
    // Paginación de comentarios
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

    // Acciones de comentarios (crear, responder, compartir)
    const commentActions = useCommentActions({ postId });

    // Navegación automática a comentarios desde notificaciones
    useCommentNavigation({
        postId,
        isVisible,
        allComments,
        hasMore,
        loadMore,
    });

    // Lógica de copiar canciones desde comentarios
    const copySong = useCommentCopySong({ postId });

    // Resetear estado al cerrar comentarios
    useEffect(() => {
        if (!isVisible) {
            reset();
            commentActions.setNewComment('');
            commentActions.handleReply(null);
        }
    }, [isVisible, reset]);

    /**
     * Cargar más comentarios
     */
    const handleLoadMoreComments = () => {
        if (hasMore && !isLoadingComments) {
            loadMore();
        }
    };

    /**
     * Wrapper para handleSubmit que también resetea la paginación
     */
    const handleSubmitComment = () => {
        commentActions.handleSubmit(() => {
            reset();
        });
    };

    /**
     * Wrapper para handleShareFromSelector que también resetea la paginación
     */
    const handleShareSong = (songId: number, description: string) => {
        commentActions.handleShareFromSelector(songId, description, () => {
            reset();
        });
    };

    /**
     * Wrapper para handleCopySongConfirm con callback
     */
    const handleConfirmCopySong = (data: {
        targetBandId: number;
        newKey?: string;
        newTempo?: number;
    }) => {
        copySong.handleCopySongConfirm(data, onCopySong);
    };

    return {
        // Datos de comentarios
        allComments,
        isLoadingComments,
        isLoadingMore,
        hasMore,
        handleLoadMoreComments,

        // Acciones de comentarios
        ...commentActions,
        handleSubmit: handleSubmitComment,
        handleShareFromSelector: handleShareSong,

        // Copiar canciones
        ...copySong,
        handleCopySongConfirm: handleConfirmCopySong,
    };
};
