'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useStore } from '@nanostores/react';
import { $feedNavigation } from '@stores/feedNavigation';

interface UseFeedNavigationProps {
    isCommentsOpen: boolean;
    selectedPostId: number | null;
    onCommentsOpen: () => void;
    setSelectedPostId: (id: number | null) => void;
    setCommentPostId: (id: number | null) => void;
}

export const useFeedNavigation = ({
    isCommentsOpen,
    selectedPostId,
    onCommentsOpen,
    setSelectedPostId,
    setCommentPostId,
}: UseFeedNavigationProps) => {
    const searchParams = useSearchParams();
    const feedNavigation = useStore($feedNavigation);

    // Abrir modal de comentarios automáticamente si hay postId en URL
    useEffect(() => {
        const postIdParam = searchParams.get('postId');

        if (postIdParam) {
            const postIdNum = parseInt(postIdParam);
            if (!isNaN(postIdNum)) {
                setSelectedPostId(postIdNum);
                setCommentPostId(postIdNum);
                if (!isCommentsOpen) {
                    onCommentsOpen();
                }
            }
        }
    }, [
        searchParams,
        isCommentsOpen,
        onCommentsOpen,
        setSelectedPostId,
        setCommentPostId,
    ]);

    // Manejar navegación desde notificaciones usando el store
    useEffect(() => {
        if (feedNavigation.isNavigating && feedNavigation.targetPostId) {
            setTimeout(() => {
                const element = document.querySelector(
                    `#post-${feedNavigation.targetPostId}`,
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
            }, 500);
        }
    }, [feedNavigation]);

    // Scroll automático al comentario si hay hash en la URL
    useEffect(() => {
        if (typeof window === 'undefined') return;

        const hash = window.location.hash;

        // Scroll a comentario (solo si el modal está abierto)
        if (hash && hash.startsWith('#comment-') && isCommentsOpen) {
            setTimeout(() => {
                const element = document.querySelector(hash);
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
            }, 500);
        }

        // Scroll a post (sin necesidad de modal)
        if (hash && hash.startsWith('#post-')) {
            setTimeout(() => {
                const element = document.querySelector(hash);
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
            }, 300);
        }
    }, [isCommentsOpen, selectedPostId]);
};
