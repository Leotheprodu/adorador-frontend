'use client';

import { Post } from '../_interfaces/feedInterface';

interface UseFeedSongActionsProps {
    data?: { pages: Array<{ items: Post[] }> };
    selectedViewSong: Post | null;
    setSelectedCopySong: (post: Post | null) => void;
    setSelectedViewSong: (post: Post | null) => void;
    setSuggestedKey: (key: string | undefined) => void;
    setSuggestedTempo: (tempo: number | undefined) => void;
    setCopySongId: (id: number | null) => void;
    onCopySongOpen: () => void;
    onViewSongOpen: () => void;
}

export const useFeedSongActions = ({
    data,
    selectedViewSong,
    setSelectedCopySong,
    setSelectedViewSong,
    setSuggestedKey,
    setSuggestedTempo,
    setCopySongId,
    onCopySongOpen,
    onViewSongOpen,
}: UseFeedSongActionsProps) => {
    const handleOpenCopySong = (
        postId: number,
        newSuggestedKey?: string,
        newSuggestedTempo?: number,
    ) => {
        // Si postId es 0, significa que es una vista desde comentario
        if (postId === 0 && selectedViewSong) {
            const tempPost = {
                ...selectedViewSong,
            } as Post & {
                _isFromComment?: boolean;
                _commentId?: number;
            };
            tempPost._isFromComment = true;
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            tempPost._commentId = (selectedViewSong as any)._commentId;
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

    const handleOpenViewSong = (postId: number) => {
        const post = data?.pages
            .flatMap((page) => page.items)
            .find((p) => p.id === postId);
        if (post && post.type === 'SONG_SHARE') {
            setSelectedViewSong(post);
            onViewSongOpen();
        }
    };

    const handleViewSongFromComment = (
        songId: number,
        bandId: number,
        commentId?: number,
    ) => {
        const tempPost: Post & { _commentId?: number } = {
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
            _commentId: commentId,
        };
        setSelectedViewSong(tempPost);
        onViewSongOpen();
    };

    const handleOpenViewSongFromComment = (songId: number, bandId: number) => {
        handleViewSongFromComment(songId, bandId);
    };

    const handleCopySongFromComment = (
        postId: number,
        songId: number,
        bandId: number,
        commentId: number,
        key?: string | null,
        tempo?: number | null,
    ) => {
        const tempPost: Post & { _isFromComment?: boolean; _commentId?: number } = {
            id: songId,
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
            _isFromComment: true,
            _commentId: commentId,
        };

        setSelectedCopySong(tempPost);
        setCopySongId(songId);
        onCopySongOpen();
    };

    const handleCopySongFromCommentSimplified = (
        songId: number,
        key?: string,
        tempo?: number,
    ) => {
        console.log('Canción copiada desde comentario:', { songId, key, tempo });
    };

    return {
        handleOpenCopySong,
        handleOpenViewSong,
        handleViewSongFromComment,
        handleOpenViewSongFromComment,
        handleCopySongFromComment,
        handleCopySongFromCommentSimplified,
    };
};
