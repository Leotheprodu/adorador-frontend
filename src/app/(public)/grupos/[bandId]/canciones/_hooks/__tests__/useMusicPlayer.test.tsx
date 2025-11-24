import { renderHook, act } from '@testing-library/react';
import { useMusicPlayer } from '../useMusicPlayer';
import { $PlayList, $SelectedSong } from '@stores/player';

// Mock de stores
jest.mock('@stores/player', () => ({
    $PlayList: {
        get: jest.fn(),
    },
    $SelectedSong: {
        get: jest.fn(),
        set: jest.fn(),
    },
}));

// Mock de nanostores
jest.mock('@nanostores/react', () => ({
    useStore: jest.fn((store) => {
        if (store === $PlayList) {
            return mockPlaylist;
        }
        if (store === $SelectedSong) {
            return mockSelectedBeat;
        }
        return null;
    }),
}));

let mockPlaylist: Array<{ id: number; name: string; youtubeLink: string }> = [];
let mockSelectedBeat: { id: number; name: string; youtubeLink: string } | null =
    null;

describe('useMusicPlayer', () => {
    beforeEach(() => {
        jest.clearAllMocks();
        mockPlaylist = [
            { id: 1, name: 'Song 1', youtubeLink: 'abc123' },
            { id: 2, name: 'Song 2', youtubeLink: 'def456' },
            { id: 3, name: 'Song 3', youtubeLink: 'ghi789' },
        ];
        mockSelectedBeat = mockPlaylist[0];
    });

    it('inicializa con valores por defecto', () => {
        const { result } = renderHook(() => useMusicPlayer());

        expect(result.current.playing).toBe(true);
        expect(result.current.progress).toBe(0);
        expect(result.current.volume).toBe(0.5);
        expect(result.current.progressDuration).toBe('0:00');
        expect(result.current.duration).toBe('0:00');
    });

    it('maneja play/pause correctamente', () => {
        const { result } = renderHook(() => useMusicPlayer());

        act(() => {
            result.current.handlePlayButtonClick({
                preventDefault: jest.fn(),
            } as unknown as React.MouseEvent<HTMLButtonElement>);
        });

        expect(result.current.playing).toBe(false);

        act(() => {
            result.current.handlePlayButtonClick({
                preventDefault: jest.fn(),
            } as unknown as React.MouseEvent<HTMLButtonElement>);
        });

        expect(result.current.playing).toBe(true);
    });

    it('avanza a la siguiente canción', () => {
        const { result } = renderHook(() => useMusicPlayer());

        act(() => {
            result.current.handleNextSong();
        });

        expect($SelectedSong.set).toHaveBeenCalledWith(mockPlaylist[1]);
    });

    it('retrocede a la canción anterior', () => {
        mockSelectedBeat = mockPlaylist[1];
        const { result } = renderHook(() => useMusicPlayer());

        act(() => {
            result.current.handlePrevSong();
        });

        expect($SelectedSong.set).toHaveBeenCalledWith(mockPlaylist[0]);
    });

    it('vuelve al inicio al avanzar desde la última canción', () => {
        mockSelectedBeat = mockPlaylist[2];
        const { result } = renderHook(() => useMusicPlayer());

        act(() => {
            result.current.handleNextSong();
        });

        expect($SelectedSong.set).toHaveBeenCalledWith(mockPlaylist[0]);
    });

    it('va al final al retroceder desde la primera canción', () => {
        mockSelectedBeat = mockPlaylist[0];
        const { result } = renderHook(() => useMusicPlayer());

        act(() => {
            result.current.handlePrevSong();
        });

        expect($SelectedSong.set).toHaveBeenCalledWith(mockPlaylist[2]);
    });

    it('actualiza el volumen', () => {
        const { result } = renderHook(() => useMusicPlayer());

        act(() => {
            result.current.setVolume(0.8);
        });

        expect(result.current.volume).toBe(0.8);
    });

    it('maneja el progreso correctamente', () => {
        const { result } = renderHook(() => useMusicPlayer());

        act(() => {
            result.current.handleProgress({
                played: 0.5,
                playedSeconds: 60,
            });
        });

        expect(result.current.progress).toBe(0.5);
        expect(result.current.progressDuration).toBe('1:00');
    });

    it('maneja la duración correctamente', () => {
        const { result } = renderHook(() => useMusicPlayer());

        act(() => {
            result.current.handleDuration(180);
        });

        expect(result.current.duration).toBe('2:59');
    });
});
