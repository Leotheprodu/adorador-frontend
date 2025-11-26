import { useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { copySongDirectService } from '../_services/feedService';
import { useInvalidateSubscriptionLimits } from '@bands/[bandId]/suscripcion/_hooks/useInvalidateSubscriptionLimits';

interface CopySongData {
    songId: number;
    title: string;
    key?: string | null;
    tempo?: number | null;
    commentId?: number;
}

/**
 * Hook para manejar la copia de canciones desde comentarios
 */
export const useCommentCopySong = ({ postId }: { postId: number }) => {
    const queryClient = useQueryClient();
    const { invalidateLimits } = useInvalidateSubscriptionLimits();
    const [copySongData, setCopySongData] = useState<CopySongData | null>(null);

    // Hook del servicio para copiar canción (usa el songId del copySongData actual)
    const copySongDirect = copySongDirectService({
        songId: copySongData?.songId || 0,
    });

    /**
     * Abrir modal de copiar canción
     */
    const handleCopySongFromComment = (
        songId: number,
        title: string,
        key?: string | null,
        tempo?: number | null,
        commentId?: number,
    ) => {
        setCopySongData({ songId, title, key, tempo, commentId });
    };

    /**
     * Confirmar copia de canción
     */
    const handleCopySongConfirm = (
        data: {
            targetBandId: number;
            newKey?: string;
            newTempo?: number;
        },
        onCopySongCallback?: (
            songId: number,
            key?: string,
            tempo?: number,
        ) => void,
    ) => {
        if (!copySongData) return;

        // Incluir el commentId si está disponible
        const copyData = {
            ...data,
            ...(copySongData.commentId && { commentId: copySongData.commentId }),
        };

        copySongDirect.mutate(copyData, {
            onSuccess: () => {
                setCopySongData(null);

                // Mostrar toast de éxito
                toast.success('¡Canción copiada exitosamente!');

                // Invalidar consultas inmediatamente
                queryClient.invalidateQueries({
                    queryKey: ['comments', postId.toString()],
                });
                queryClient.invalidateQueries({ queryKey: ['feed-infinite'] });

                // Invalidar límites de suscripción de la banda destino (currentSongs aumentó)
                invalidateLimits(data.targetBandId.toString());

                // Forzar refetch después de un pequeño delay para asegurar actualización
                setTimeout(() => {
                    queryClient.refetchQueries({
                        queryKey: ['comments', postId.toString()],
                    });
                }, 100);

                // Llamar callback opcional para notificar al componente padre
                if (onCopySongCallback) {
                    onCopySongCallback(
                        copySongData.songId,
                        copySongData.key || undefined,
                        copySongData.tempo || undefined,
                    );
                }
            },
            onError: (error) => {
                console.error('Error copiando canción:', error);
                toast.error('Error al copiar la canción');
            },
        });
    };

    /**
     * Cerrar modal de copiar canción
     */
    const handleCloseCopySong = () => {
        setCopySongData(null);
    };

    return {
        copySongData,
        isLoading: copySongDirect.isPending,
        handleCopySongFromComment,
        handleCopySongConfirm,
        handleCloseCopySong,
    };
};
