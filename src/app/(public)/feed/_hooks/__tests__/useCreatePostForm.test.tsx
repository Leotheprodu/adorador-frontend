import { renderHook, act } from '@testing-library/react';
import { useCreatePostForm } from '../useCreatePostForm';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const createWrapper = () => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false },
        },
    });
    const Wrapper = ({ children }: { children: React.ReactNode }) => (
        <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
    Wrapper.displayName = 'QueryClientWrapper';
    return Wrapper;
};

describe('useCreatePostForm', () => {
    const mockOnSubmit = jest.fn();
    const userBands = [
        { id: 1, name: 'Banda 1' },
        { id: 2, name: 'Banda 2' },
    ];
    const bandSongs = [
        { id: 10, title: 'Canción 1', artist: 'Artista 1' },
        { id: 20, title: 'Canción 2', artist: null },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('inicializa con valores por defecto', () => {
        const { result } = renderHook(
            () =>
                useCreatePostForm({
                    onSubmit: mockOnSubmit,
                    userBands,
                    bandSongs,
                }),
            { wrapper: createWrapper() },
        );

        expect(result.current.isExpanded).toBe(false);
        expect(result.current.postType).toBe('SONG_SHARE');
        expect(result.current.content).toBe('');
        expect(result.current.sharedSongId).toBe('');
    });

    it('expande y colapsa el formulario', () => {
        const { result } = renderHook(
            () =>
                useCreatePostForm({
                    onSubmit: mockOnSubmit,
                    userBands,
                    bandSongs,
                }),
            { wrapper: createWrapper() },
        );

        act(() => {
            result.current.handleExpand();
        });
        expect(result.current.isExpanded).toBe(true);

        act(() => {
            result.current.handleCollapse();
        });
        expect(result.current.isExpanded).toBe(false);
    });

    it('valida correctamente para SONG_SHARE', () => {
        const { result } = renderHook(
            () =>
                useCreatePostForm({
                    onSubmit: mockOnSubmit,
                    userBands: [{ id: 1, name: 'Banda 1' }],
                    bandSongs,
                }),
            { wrapper: createWrapper() },
        );

        expect(result.current.isValid()).toBe(false);

        act(() => {
            result.current.setSharedSongId('10');
        });
        expect(result.current.isValid()).toBe(true);
    });

    it('valida correctamente para SONG_REQUEST', () => {
        const { result } = renderHook(
            () =>
                useCreatePostForm({
                    onSubmit: mockOnSubmit,
                    userBands: [{ id: 1, name: 'Banda 1' }],
                    bandSongs,
                }),
            { wrapper: createWrapper() },
        );

        act(() => {
            result.current.setPostType('SONG_REQUEST');
        });

        expect(result.current.isValid()).toBe(false);

        act(() => {
            result.current.setRequestedSongTitle('Nueva Canción');
        });
        expect(result.current.isValid()).toBe(true);
    });

    it('envía formulario con datos de SONG_SHARE', () => {
        const { result } = renderHook(
            () =>
                useCreatePostForm({
                    onSubmit: mockOnSubmit,
                    userBands: [{ id: 1, name: 'Banda 1' }],
                    bandSongs,
                }),
            { wrapper: createWrapper() },
        );

        act(() => {
            result.current.setSharedSongId('10');
            result.current.handleContentChange('Descripción de la canción');
        });

        act(() => {
            result.current.handleSubmit();
        });

        expect(mockOnSubmit).toHaveBeenCalledWith({
            type: 'SONG_SHARE',
            bandId: 1,
            title: 'Canción 1',
            description: 'Descripción de la canción',
            sharedSongId: 10,
        });
    });

    it('resetea el formulario al colapsar', () => {
        const { result } = renderHook(
            () =>
                useCreatePostForm({
                    onSubmit: mockOnSubmit,
                    userBands: [{ id: 1, name: 'Banda 1' }],
                    bandSongs,
                }),
            { wrapper: createWrapper() },
        );

        act(() => {
            result.current.setSharedSongId('10');
            result.current.handleContentChange('Contenido');
            result.current.handleCollapse();
        });

        expect(result.current.sharedSongId).toBe('');
        expect(result.current.content).toBe('');
        expect(result.current.postType).toBe('SONG_SHARE');
    });
});
