'use client';

import { useState, useRef, useEffect } from 'react';
import { CreatePostDto, PostType } from '../_interfaces/feedInterface';
import { extractYouTubeId } from '@global/utils/formUtils';

interface UseCreatePostFormProps {
    onSubmit: (data: CreatePostDto) => void;
    isLoading?: boolean;
    userBands: Array<{ id: number; name: string }>;
    bandSongs?: Array<{ id: number; title: string; artist: string | null }>;
    selectedBandId?: number;
    onBandChange?: (bandId: number) => void;
}

export const useCreatePostForm = ({
    onSubmit,
    userBands,
    bandSongs = [],
    selectedBandId,
    onBandChange,
}: UseCreatePostFormProps) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    // Estados del formulario
    const [isExpanded, setIsExpanded] = useState(false);
    const [postType, setPostType] = useState<PostType>('SONG_SHARE');
    const [bandId, setBandId] = useState<string>(
        selectedBandId?.toString() ||
        (userBands.length === 1 ? userBands[0].id.toString() : ''),
    );
    const [content, setContent] = useState('');
    const [sharedSongId, setSharedSongId] = useState('');
    const [requestedSongTitle, setRequestedSongTitle] = useState('');
    const [requestedSongArtist, setRequestedSongArtist] = useState('');
    const [requestedYoutubeUrl, setRequestedYoutubeUrl] = useState('');

    // Auto-focus cuando se expande
    useEffect(() => {
        if (isExpanded && textareaRef.current) {
            textareaRef.current.focus();
        }
    }, [isExpanded]);

    // Auto-seleccionar primera banda si solo hay una
    useEffect(() => {
        if (userBands.length === 1 && !bandId) {
            const firstBandId = userBands[0].id.toString();
            setBandId(firstBandId);
            if (onBandChange) {
                onBandChange(userBands[0].id);
            }
        }
    }, [userBands, bandId, onBandChange]);

    const processEscapeCharacters = (text: string) => {
        return text
            .replace(/\\n/g, '\n')
            .replace(/\\t/g, '\t')
            .replace(/\\r/g, '\r');
    };

    const resetForm = () => {
        setPostType('SONG_SHARE');
        setContent('');
        setSharedSongId('');
        setRequestedSongTitle('');
        setRequestedSongArtist('');
        setRequestedYoutubeUrl('');
    };

    const handleExpand = () => {
        setIsExpanded(true);
    };

    const handleCollapse = () => {
        setIsExpanded(false);
        resetForm();
    };

    const handleYouTubeChange = (value: string) => {
        const videoId = extractYouTubeId(value);
        setRequestedYoutubeUrl(videoId);
    };

    const handleBandChange = (newBandId: string) => {
        setBandId(newBandId);
        if (newBandId && onBandChange) {
            onBandChange(parseInt(newBandId));
        }
    };

    const handleContentChange = (value: string) => {
        const processedValue = processEscapeCharacters(value);
        setContent(processedValue);
    };

    const handleSubmit = () => {
        let title = '';

        // Generar título según el tipo de post
        if (postType === 'SONG_SHARE' && sharedSongId) {
            const selectedSong = bandSongs.find(
                (song) => song.id === parseInt(sharedSongId),
            );
            title = selectedSong ? selectedSong.title : 'Canción compartida';
        } else if (postType === 'SONG_REQUEST' && requestedSongTitle) {
            title = requestedSongTitle;
        }

        const data: CreatePostDto = {
            type: postType,
            bandId: parseInt(bandId),
            title,
        };

        if (content.trim()) {
            data.description = content.trim();
        }

        if (postType === 'SONG_SHARE' && sharedSongId) {
            data.sharedSongId = parseInt(sharedSongId);
        }

        if (postType === 'SONG_REQUEST') {
            data.requestedSongTitle = requestedSongTitle;
            if (requestedSongArtist.trim()) {
                data.requestedArtist = requestedSongArtist.trim();
            }
            if (requestedYoutubeUrl.trim()) {
                data.requestedYoutubeUrl = requestedYoutubeUrl.trim();
            }
        }

        onSubmit(data);
        resetForm();
        setIsExpanded(false);
    };

    const isValid = () => {
        if (!bandId) return false;

        if (postType === 'SONG_SHARE') {
            return !!sharedSongId;
        }

        if (postType === 'SONG_REQUEST') {
            return requestedSongTitle.trim().length > 0;
        }

        return false;
    };

    const getSelectedBandName = () => {
        const band = userBands.find((b) => b.id.toString() === bandId);
        return band ? band.name : 'Seleccionar banda';
    };

    const getSelectedSongInfo = () => {
        if (!sharedSongId) return null;
        const song = bandSongs.find((s) => s.id.toString() === sharedSongId);
        return song;
    };

    return {
        // Refs
        textareaRef,

        // Estados
        isExpanded,
        postType,
        bandId,
        content,
        sharedSongId,
        requestedSongTitle,
        requestedSongArtist,
        requestedYoutubeUrl,

        // Setters
        setPostType,
        setSharedSongId,
        setRequestedSongTitle,
        setRequestedSongArtist,

        // Handlers
        handleExpand,
        handleCollapse,
        handleSubmit,
        handleYouTubeChange,
        handleBandChange,
        handleContentChange,

        // Helpers
        isValid,
        getSelectedBandName,
        getSelectedSongInfo,
    };
};
