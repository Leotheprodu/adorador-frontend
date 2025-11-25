import { renderHook } from '@testing-library/react';
import { useFeedSongActions } from '../useFeedSongActions';
import { Post } from '../../_interfaces/feedInterface';

describe('useFeedSongActions', () => {
    const mockSetSelectedCopySong = jest.fn();
    const mockSetSelectedViewSong = jest.fn();
    const mockSetSuggestedKey = jest.fn();
    const mockSetSuggestedTempo = jest.fn();
    const mockSetCopySongId = jest.fn();
    const mockOnCopySongOpen = jest.fn();
    const mockOnViewSongOpen = jest.fn();

    const mockPost: Post = {
        id: 1,
        type: 'SONG_SHARE',
        status: 'ACTIVE',
        title: 'Test Post',
        description: null,
        requestedSongTitle: null,
        requestedArtist: null,
        requestedYoutubeUrl: null,
        authorId: 1,
        bandId: 1,
        sharedSongId: 10,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        author: { id: 1, name: 'Test User' },
        band: { id: 1, name: 'Test Band' },
        sharedSong: {
            id: 10,
            bandId: 1,
            title: 'Test Song',
            artist: 'Test Artist',
            key: 'C',
            tempo: 120,
            songType: 'worship',
        },
        _count: { blessings: 0, comments: 0, songCopies: 0 },
        userBlessing: [],
    };

    const mockData = {
        pages: [{ items: [mockPost] }],
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('abre modal de copiar canción desde post', () => {
        const { result } = renderHook(() =>
            useFeedSongActions({
                data: mockData,
                selectedViewSong: null,
                setSelectedCopySong: mockSetSelectedCopySong,
                setSelectedViewSong: mockSetSelectedViewSong,
                setSuggestedKey: mockSetSuggestedKey,
                setSuggestedTempo: mockSetSuggestedTempo,
                setCopySongId: mockSetCopySongId,
                onCopySongOpen: mockOnCopySongOpen,
                onViewSongOpen: mockOnViewSongOpen,
            }),
        );

        result.current.handleOpenCopySong(1, 'D', 140);

        expect(mockSetSelectedCopySong).toHaveBeenCalledWith(mockPost);
        expect(mockSetSuggestedKey).toHaveBeenCalledWith('D');
        expect(mockSetSuggestedTempo).toHaveBeenCalledWith(140);
        expect(mockOnCopySongOpen).toHaveBeenCalled();
    });

    it('abre modal de ver canción', () => {
        const { result } = renderHook(() =>
            useFeedSongActions({
                data: mockData,
                selectedViewSong: null,
                setSelectedCopySong: mockSetSelectedCopySong,
                setSelectedViewSong: mockSetSelectedViewSong,
                setSuggestedKey: mockSetSuggestedKey,
                setSuggestedTempo: mockSetSuggestedTempo,
                setCopySongId: mockSetCopySongId,
                onCopySongOpen: mockOnCopySongOpen,
                onViewSongOpen: mockOnViewSongOpen,
            }),
        );

        result.current.handleOpenViewSong(1);

        expect(mockSetSelectedViewSong).toHaveBeenCalledWith(mockPost);
        expect(mockOnViewSongOpen).toHaveBeenCalled();
    });

    it('crea post temporal para ver canción desde comentario', () => {
        const { result } = renderHook(() =>
            useFeedSongActions({
                data: mockData,
                selectedViewSong: null,
                setSelectedCopySong: mockSetSelectedCopySong,
                setSelectedViewSong: mockSetSelectedViewSong,
                setSuggestedKey: mockSetSuggestedKey,
                setSuggestedTempo: mockSetSuggestedTempo,
                setCopySongId: mockSetCopySongId,
                onCopySongOpen: mockOnCopySongOpen,
                onViewSongOpen: mockOnViewSongOpen,
            }),
        );

        result.current.handleViewSongFromComment(10, 1, 5);

        expect(mockSetSelectedViewSong).toHaveBeenCalled();
        expect(mockOnViewSongOpen).toHaveBeenCalled();

        const calledPost = mockSetSelectedViewSong.mock.calls[0][0];
        expect(calledPost.sharedSongId).toBe(10);
        expect(calledPost.bandId).toBe(1);
        expect(calledPost._commentId).toBe(5);
    });

    it('crea post temporal para copiar canción desde comentario', () => {
        const { result } = renderHook(() =>
            useFeedSongActions({
                data: mockData,
                selectedViewSong: null,
                setSelectedCopySong: mockSetSelectedCopySong,
                setSelectedViewSong: mockSetSelectedViewSong,
                setSuggestedKey: mockSetSuggestedKey,
                setSuggestedTempo: mockSetSuggestedTempo,
                setCopySongId: mockSetCopySongId,
                onCopySongOpen: mockOnCopySongOpen,
                onViewSongOpen: mockOnViewSongOpen,
            }),
        );

        result.current.handleCopySongFromComment(1, 10, 1, 5, 'D', 140);

        expect(mockSetSelectedCopySong).toHaveBeenCalled();
        expect(mockSetCopySongId).toHaveBeenCalledWith(10);
        expect(mockOnCopySongOpen).toHaveBeenCalled();

        const calledPost = mockSetSelectedCopySong.mock.calls[0][0];
        expect(calledPost._isFromComment).toBe(true);
        expect(calledPost._commentId).toBe(5);
    });
});
