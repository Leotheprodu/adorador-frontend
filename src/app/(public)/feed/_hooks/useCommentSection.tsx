'use client';

import { useState } from 'react';
import { CreateCommentDto } from '../_interfaces/feedInterface';

interface UseCommentSectionProps {
    onSubmitComment: (data: CreateCommentDto) => void;
}

export const useCommentSection = ({ onSubmitComment }: UseCommentSectionProps) => {
    const [newComment, setNewComment] = useState('');
    const [replyingTo, setReplyingTo] = useState<number | null>(null);
    const [isShareSongModalOpen, setIsShareSongModalOpen] = useState(false);

    const handleSubmit = () => {
        if (!newComment.trim()) return;

        // Moderación de palabras prohibidas
        const forbidden = ['maldición']; // Puedes expandir esta lista
        const lowerComment = newComment.toLowerCase();
        if (forbidden.some((word) => lowerComment.includes(word))) {
            // Opcional: mostrar un toast o mensaje de error
            return;
        }

        const data: CreateCommentDto = {
            content: newComment.trim(),
        };

        if (replyingTo) {
            data.parentId = replyingTo;
        }

        onSubmitComment(data);
        setNewComment('');
        setReplyingTo(null);
    };

    const handleShareSong = (songId: number, description: string) => {
        const data: CreateCommentDto = {
            content: description || 'Te comparto esta canción 🎵',
            sharedSongId: songId,
        };

        onSubmitComment(data);
        setIsShareSongModalOpen(false);
    };

    const handleReply = (commentId: number) => {
        setReplyingTo(commentId);
    };

    const handleCancelReply = () => {
        setReplyingTo(null);
        setNewComment('');
    };

    const handleOpenShareSongModal = () => {
        setIsShareSongModalOpen(true);
    };

    const handleCloseShareSongModal = () => {
        setIsShareSongModalOpen(false);
    };

    return {
        newComment,
        setNewComment,
        replyingTo,
        isShareSongModalOpen,
        handleSubmit,
        handleShareSong,
        handleReply,
        handleCancelReply,
        handleOpenShareSongModal,
        handleCloseShareSongModal,
    };
};
