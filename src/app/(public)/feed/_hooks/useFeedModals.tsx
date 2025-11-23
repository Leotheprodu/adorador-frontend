'use client';

import { useState } from 'react';
import { useDisclosure } from '@nextui-org/react';
import { Post } from '../_interfaces/feedInterface';

export const useFeedModals = () => {
    // Estados para los modales
    const [selectedPostId, setSelectedPostId] = useState<number | null>(null);
    const [selectedCopySong, setSelectedCopySong] = useState<Post | null>(null);
    const [selectedViewSong, setSelectedViewSong] = useState<Post | null>(null);
    const [suggestedKey, setSuggestedKey] = useState<string | undefined>(
        undefined,
    );
    const [suggestedTempo, setSuggestedTempo] = useState<number | undefined>(
        undefined,
    );
    const [commentPostId, setCommentPostId] = useState<number | null>(null);
    const [copySongPostId, setCopySongPostId] = useState<number | null>(null);
    const [copySongId, setCopySongId] = useState<number | null>(null);

    // Disclosures
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

    // Handlers para cerrar modales
    const handleCloseComments = () => {
        setSelectedPostId(null);
        setCommentPostId(null);
        onCommentsClose();

        // Limpiar los parámetros de la URL si existen
        if (typeof window !== 'undefined') {
            const url = new URL(window.location.href);
            if (url.searchParams.has('postId')) {
                url.searchParams.delete('postId');
                url.hash = '';
                window.history.replaceState({}, '', url.pathname + url.search);
            }
        }
    };

    const handleCloseCopySong = () => {
        setSelectedCopySong(null);
        setSuggestedKey(undefined);
        setSuggestedTempo(undefined);
        onCopySongClose();
    };

    const handleCloseViewSong = () => {
        setSelectedViewSong(null);
        onViewSongClose();
    };

    // Handlers para abrir modales de comentarios
    const openCommentsModal = (postId: number) => {
        setSelectedPostId(postId);
        setCommentPostId(postId);
        onCommentsOpen();
    };

    return {
        // Estados
        selectedPostId,
        selectedCopySong,
        selectedViewSong,
        suggestedKey,
        suggestedTempo,
        commentPostId,
        copySongPostId,
        copySongId,

        // Setters
        setSelectedPostId,
        setSelectedCopySong,
        setSelectedViewSong,
        setSuggestedKey,
        setSuggestedTempo,
        setCommentPostId,
        setCopySongPostId,
        setCopySongId,

        // Disclosure states
        isCommentsOpen,
        isCopySongOpen,
        isViewSongOpen,

        // Disclosure actions
        onCommentsOpen,
        onCopySongOpen,
        onViewSongOpen,

        // Handlers
        handleCloseComments,
        handleCloseCopySong,
        handleCloseViewSong,
        openCommentsModal,
    };
};
