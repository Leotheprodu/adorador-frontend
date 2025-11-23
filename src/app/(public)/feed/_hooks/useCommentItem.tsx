'use client';

import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toggleCommentBlessingService } from '../_services/feedService';

interface UseCommentItemProps {
    commentId: number;
    postId?: number;
}

export const useCommentItem = ({ commentId, postId }: UseCommentItemProps) => {
    const queryClient = useQueryClient();
    const [blessingCommentId, setBlessingCommentId] = useState<number | null>(null);

    const toggleBlessing = toggleCommentBlessingService({
        commentId: blessingCommentId || 0,
    });

    const handleToggleBlessing = () => {
        setBlessingCommentId(commentId);
        toggleBlessing.mutate(null, {
            onSuccess: () => {
                if (postId) {
                    queryClient.invalidateQueries({
                        queryKey: ['comments', postId.toString()],
                    });
                }
                setBlessingCommentId(null);
            },
        });
    };

    return {
        handleToggleBlessing,
        isBlessingLoading: toggleBlessing.isPending && blessingCommentId === commentId,
    };
};
