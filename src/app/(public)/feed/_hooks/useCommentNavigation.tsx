import { useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { $feedNavigation, clearFeedNavigation } from '@stores/feedNavigation';
import { Comment as FeedComment } from '../_interfaces/feedInterface';

/**
 * Hook para manejar navegación y scroll automático a comentarios
 * desde notificaciones
 */
export const useCommentNavigation = ({
    postId,
    isVisible,
    allComments,
    hasMore,
    loadMore,
}: {
    postId: number;
    isVisible: boolean;
    allComments: FeedComment[];
    hasMore: boolean;
    loadMore: () => void;
}) => {
    const feedNavigation = useStore($feedNavigation);

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
};
