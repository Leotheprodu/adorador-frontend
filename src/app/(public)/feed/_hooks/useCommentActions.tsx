import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { createCommentService } from '../_services/feedService';

/**
 * Hook para manejar acciones de comentarios: crear, responder, compartir canción
 */
export const useCommentActions = ({ postId }: { postId: number }) => {
    const queryClient = useQueryClient();
    const [newComment, setNewComment] = useState('');
    const [replyingTo, setReplyingTo] = useState<number | null>(null);
    const [isShareSongModalOpen, setIsShareSongModalOpen] = useState(false);

    const createComment = createCommentService({ postId });

    /**
     * Enviar comentario o respuesta
     */
    const handleSubmit = (onSuccess?: () => void) => {
        if (!newComment.trim()) return;

        createComment.mutate(
            {
                content: newComment.trim(),
                parentId: replyingTo || undefined,
            },
            {
                onSuccess: () => {
                    setNewComment('');
                    setReplyingTo(null);
                    queryClient.invalidateQueries({
                        queryKey: ['comments', postId.toString()],
                    });
                    queryClient.invalidateQueries({ queryKey: ['feed-infinite'] });
                    onSuccess?.();
                },
            },
        );
    };

    /**
     * Compartir canción en comentario
     */
    const handleShareFromSelector = (
        songId: number,
        description: string,
        onSuccess?: () => void,
    ) => {
        createComment.mutate(
            {
                content: description || '',
                parentId: replyingTo || undefined,
                sharedSongId: songId,
            },
            {
                onSuccess: () => {
                    setNewComment('');
                    setReplyingTo(null);
                    setIsShareSongModalOpen(false);
                    queryClient.invalidateQueries({
                        queryKey: ['comments', postId.toString()],
                    });
                    queryClient.invalidateQueries({ queryKey: ['feed-infinite'] });
                    onSuccess?.();
                },
            },
        );
    };

    /**
     * Manejar tecla Enter para enviar
     */
    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && e.ctrlKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    /**
     * Iniciar respuesta a un comentario
     */
    const handleReply = (commentId: number | null) => {
        setReplyingTo(commentId);
        if (commentId === null) {
            setNewComment('');
        }
    };

    /**
     * Abrir modal de compartir canción
     */
    const openShareSongModal = () => {
        setIsShareSongModalOpen(true);
    };

    /**
     * Cerrar modal de compartir canción
     */
    const closeShareSongModal = () => {
        setIsShareSongModalOpen(false);
    };

    return {
        // Estados
        newComment,
        setNewComment,
        replyingTo,
        isShareSongModalOpen,
        isSubmitting: createComment.isPending,

        // Acciones
        handleSubmit,
        handleShareFromSelector,
        handleKeyPress,
        handleReply,
        openShareSongModal,
        closeShareSongModal,
    };
};
