import { renderHook } from '@testing-library/react';
import { useCommentCopySong } from '../useCommentCopySong';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import * as feedService from '../../_services/feedService';
import toast from 'react-hot-toast';

// Mock del servicio y toast
jest.mock('../../_services/feedService', () => ({
    copySongDirectService: jest.fn(),
}));

jest.mock('react-hot-toast', () => ({
    success: jest.fn(),
    error: jest.fn(),
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

describe('useCommentCopySong', () => {
    const mockMutate = jest.fn();
    const mockCopySongDirect = {
        mutate: mockMutate,
        isPending: false,
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (feedService.copySongDirectService as jest.Mock).mockReturnValue(
            mockCopySongDirect,
        );
    });

    it('inicializa sin datos de canción', () => {
        const { result } = renderHook(() => useCommentCopySong({ postId: 1 }), {
            wrapper: createWrapper(),
        });

        expect(result.current.copySongData).toBeNull();
        expect(result.current.isLoading).toBe(false);
    });

    it('abre modal con datos de canción', () => {
        const { result } = renderHook(() => useCommentCopySong({ postId: 1 }), {
            wrapper: createWrapper(),
        });

        result.current.handleCopySongFromComment(10, 'Canción Test', 'C', 120, 5);

        expect(result.current.copySongData).toEqual({
            songId: 10,
            title: 'Canción Test',
            key: 'C',
            tempo: 120,
            commentId: 5,
        });
    });

    it('cierra modal y limpia datos', () => {
        const { result } = renderHook(() => useCommentCopySong({ postId: 1 }), {
            wrapper: createWrapper(),
        });

        result.current.handleCopySongFromComment(10, 'Canción Test');
        result.current.handleCloseCopySong();

        expect(result.current.copySongData).toBeNull();
    });

    it('confirma copia con commentId', () => {
        const { result } = renderHook(() => useCommentCopySong({ postId: 1 }), {
            wrapper: createWrapper(),
        });

        result.current.handleCopySongFromComment(10, 'Canción Test', 'C', 120, 5);

        result.current.handleCopySongConfirm({
            targetBandId: 2,
            newKey: 'D',
            newTempo: 130,
        });

        expect(mockMutate).toHaveBeenCalledWith(
            {
                targetBandId: 2,
                newKey: 'D',
                newTempo: 130,
                commentId: 5,
            },
            expect.any(Object),
        );
    });

    it('muestra toast de éxito al copiar', () => {
        const { result } = renderHook(() => useCommentCopySong({ postId: 1 }), {
            wrapper: createWrapper(),
        });

        result.current.handleCopySongFromComment(10, 'Canción Test');

        // Simular éxito de la mutación
        const onSuccessCallback = (mockMutate as jest.Mock).mock.calls[0]?.[1]
            ?.onSuccess;
        if (onSuccessCallback) {
            onSuccessCallback();
        }

        expect(toast.success).toHaveBeenCalledWith('¡Canción copiada exitosamente!');
    });

    it('llama callback del padre al copiar exitosamente', () => {
        const onCopySongCallback = jest.fn();
        const { result } = renderHook(() => useCommentCopySong({ postId: 1 }), {
            wrapper: createWrapper(),
        });

        result.current.handleCopySongFromComment(10, 'Canción Test', 'C', 120);

        result.current.handleCopySongConfirm(
            { targetBandId: 2 },
            onCopySongCallback,
        );

        // Simular éxito
        const onSuccessCallback = (mockMutate as jest.Mock).mock.calls[0]?.[1]
            ?.onSuccess;
        if (onSuccessCallback) {
            onSuccessCallback();
        }

        expect(onCopySongCallback).toHaveBeenCalledWith(10, 'C', 120);
    });
});
