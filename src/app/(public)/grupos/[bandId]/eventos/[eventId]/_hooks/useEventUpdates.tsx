import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';

interface UseEventUpdatesProps {
    bandId: string;
    eventId: string;
    refetch: () => void;
}

export const useEventUpdates = ({ bandId, eventId, refetch }: UseEventUpdatesProps) => {
    const queryClient = useQueryClient();

    useEffect(() => {
        const handleInvalidateQueries = () => {
            console.log('[EventAdminPage] Invalidando queries del evento...');
            // Invalidar la query para forzar refetch
            queryClient.invalidateQueries({
                queryKey: ['Event', bandId, eventId],
            });
            // También hacer refetch directo
            refetch();
        };

        // Escuchar el evento global que se dispara cuando se agregan canciones
        window.addEventListener(
            'eventSongsUpdated',
            handleInvalidateQueries as EventListener,
        );

        return () => {
            window.removeEventListener(
                'eventSongsUpdated',
                handleInvalidateQueries as EventListener,
            );
        };
    }, [bandId, eventId, queryClient, refetch]);
};
