'use client';

import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useStore } from '@nanostores/react';
import { $feedNavigation } from '@stores/feedNavigation';
import { toggleBlessingService } from '../_services/feedService';

interface UsePostCardProps {
    postId: number;
}

export const usePostCard = ({ postId }: UsePostCardProps) => {
    const queryClient = useQueryClient();
    const feedNavigation = useStore($feedNavigation);
    const [blessingPostId, setBlessingPostId] = useState<number | null>(null);
    const [showComments, setShowComments] = useState(false);

    const toggleBlessing = toggleBlessingService({ postId: blessingPostId || 0 });

    const handleToggleBlessing = () => {
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

    const handleToggleComments = () => {
        setShowComments(!showComments);
    };

    // Detectar si este post es el objetivo de navegación desde notificaciones
    useEffect(() => {
        if (
            feedNavigation.isNavigating &&
            feedNavigation.targetPostId === postId &&
            feedNavigation.targetCommentId
        ) {
            setShowComments(true);
        }
    }, [feedNavigation, postId]);

    return {
        showComments,
        handleToggleBlessing,
        handleToggleComments,
        isBlessingLoading: toggleBlessing.isPending && blessingPostId === postId,
    };
};
