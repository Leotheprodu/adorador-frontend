import { renderHook, act } from '@testing-library/react';
import { useCommentActions } from '../useCommentActions';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as feedService from '../../_services/feedService';

// Mock del servicio
jest.mock('../../_services/feedService', () => ({
    createCommentService: jest.fn(),
}));

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

describe('useCommentActions', () => {
    const mockMutate = jest.fn();
    const mockCreateComment = {
        mutate: mockMutate,
        isPending: false,
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (feedService.createCommentService as jest.Mock).mockReturnValue(
            mockCreateComment,
        );
    });

    it('inicializa con valores por defecto', () => {
        const { result } = renderHook(() => useCommentActions({ postId: 1 }), {
            wrapper: createWrapper(),
        });

        expect(result.current.newComment).toBe('');
        expect(result.current.replyingTo).toBeNull();
        expect(result.current.isShareSongModalOpen).toBe(false);
        expect(result.current.isSubmitting).toBe(false);
    });

    it('actualiza el comentario nuevo', () => {
        const { result } = renderHook(() => useCommentActions({ postId: 1 }), {
            wrapper: createWrapper(),
        });

        act(() => {
            result.current.setNewComment('Nuevo comentario');
        });

        expect(result.current.newComment).toBe('Nuevo comentario');
    });

    it('maneja el inicio de respuesta', () => {
        const { result } = renderHook(() => useCommentActions({ postId: 1 }), {
            wrapper: createWrapper(),
        });

        act(() => {
            result.current.handleReply(5);
        });

        expect(result.current.replyingTo).toBe(5);
    });

    it('limpia el comentario al cancelar respuesta', () => {
        const { result } = renderHook(() => useCommentActions({ postId: 1 }), {
            wrapper: createWrapper(),
        });

        act(() => {
            result.current.setNewComment('Texto de respuesta');
            result.current.handleReply(5);
        });

        act(() => {
            result.current.handleReply(null);
        });

        expect(result.current.replyingTo).toBeNull();
    });

    it('abre y cierra el modal de compartir canción', () => {
        const { result } = renderHook(() => useCommentActions({ postId: 1 }), {
            wrapper: createWrapper(),
        });

        act(() => {
            result.current.openShareSongModal();
        });
        expect(result.current.isShareSongModalOpen).toBe(true);

        act(() => {
            result.current.closeShareSongModal();
        });
        expect(result.current.isShareSongModalOpen).toBe(false);
    });

    it('no envía comentario si está vacío', () => {
        const { result } = renderHook(() => useCommentActions({ postId: 1 }), {
            wrapper: createWrapper(),
        });

        act(() => {
            result.current.handleSubmit();
        });

        expect(mockMutate).not.toHaveBeenCalled();
    });

    it('envía comentario con contenido', () => {
        const { result } = renderHook(() => useCommentActions({ postId: 1 }), {
            wrapper: createWrapper(),
        });

        act(() => {
            result.current.setNewComment('Mi comentario');
        });

        act(() => {
            result.current.handleSubmit();
        });

        expect(mockMutate).toHaveBeenCalledWith(
            {
                content: 'Mi comentario',
                parentId: undefined,
            },
            expect.any(Object),
        );
    });

    it('envía respuesta con parentId', () => {
        const { result } = renderHook(() => useCommentActions({ postId: 1 }), {
            wrapper: createWrapper(),
        });

        act(() => {
            result.current.setNewComment('Mi respuesta');
            result.current.handleReply(3);
        });

        act(() => {
            result.current.handleSubmit();
        });

        expect(mockMutate).toHaveBeenCalledWith(
            {
                content: 'Mi respuesta',
                parentId: 3,
            },
            expect.any(Object),
        );
    });

    it('comparte canción en comentario', () => {
        const { result } = renderHook(() => useCommentActions({ postId: 1 }), {
            wrapper: createWrapper(),
        });

        act(() => {
            result.current.handleShareFromSelector(10, 'Descripción de la canción');
        });

        expect(mockMutate).toHaveBeenCalledWith(
            {
                content: 'Descripción de la canción',
                parentId: undefined,
                sharedSongId: 10,
            },
            expect.any(Object),
        );
    });

    it('maneja Ctrl+Enter para enviar', () => {
        const { result } = renderHook(() => useCommentActions({ postId: 1 }), {
            wrapper: createWrapper(),
        });

        const mockEvent = {
            key: 'Enter',
            ctrlKey: true,
            preventDefault: jest.fn(),
        } as unknown as React.KeyboardEvent;

        act(() => {
            result.current.setNewComment('Comentario rápido');
        });

        act(() => {
            result.current.handleKeyPress(mockEvent);
        });

        expect(mockEvent.preventDefault).toHaveBeenCalled();
        expect(mockMutate).toHaveBeenCalled();
    });
});
