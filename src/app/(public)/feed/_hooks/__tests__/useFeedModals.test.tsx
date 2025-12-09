import { renderHook, act } from '@testing-library/react';
import { useFeedModals } from '../useFeedModals';
import { Post } from '../../_interfaces/feedInterface';

// Mock de NextUI useDisclosure
jest.mock('@heroui/react', () => ({
    useDisclosure: jest.fn(() => {
        let isOpen = false;
        return {
            isOpen,
            onOpen: jest.fn(() => {
                isOpen = true;
            }),
            onClose: jest.fn(() => {
                isOpen = false;
            }),
        };
    }),
}));

describe('useFeedModals', () => {
    it('inicializa con valores por defecto', () => {
        const { result } = renderHook(() => useFeedModals());

        expect(result.current.selectedPostId).toBeNull();
        expect(result.current.selectedCopySong).toBeNull();
        expect(result.current.selectedViewSong).toBeNull();
    });

    it('gestiona estados de post seleccionado', () => {
        const { result } = renderHook(() => useFeedModals());

        act(() => {
            result.current.openCommentsModal(123);
        });

        expect(result.current.selectedPostId).toBe(123);
        expect(result.current.commentPostId).toBe(123);

        act(() => {
            result.current.handleCloseComments();
        });

        expect(result.current.selectedPostId).toBeNull();
        expect(result.current.commentPostId).toBeNull();
    });

    it('gestiona canción seleccionada para copiar', () => {
        const { result } = renderHook(() => useFeedModals());

        const mockPost: Post = {
            id: 1,
            type: 'SONG_SHARE',
            status: 'ACTIVE',
            title: 'Test',
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
                artist: null,
                key: 'C',
                tempo: 120,
                songType: 'worship',
            },
            _count: { blessings: 0, comments: 0, songCopies: 0 },
            userBlessing: [],
        };

        act(() => {
            result.current.setSelectedCopySong(mockPost);
        });

        expect(result.current.selectedCopySong).toEqual(mockPost);

        act(() => {
            result.current.handleCloseCopySong();
        });

        expect(result.current.selectedCopySong).toBeNull();
    });

    it('gestiona sugerencias de key y tempo', () => {
        const { result } = renderHook(() => useFeedModals());

        act(() => {
            result.current.setSuggestedKey('D');
            result.current.setSuggestedTempo(140);
        });

        expect(result.current.suggestedKey).toBe('D');
        expect(result.current.suggestedTempo).toBe(140);

        act(() => {
            result.current.handleCloseCopySong();
        });

        expect(result.current.suggestedKey).toBeUndefined();
        expect(result.current.suggestedTempo).toBeUndefined();
    });
});
