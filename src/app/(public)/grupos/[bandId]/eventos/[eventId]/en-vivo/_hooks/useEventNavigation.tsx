import { useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { UseEventNavigationProps } from '../_interfaces/liveEventInterfaces';

export const useEventNavigation = ({
    bandId,
    eventId,
}: UseEventNavigationProps) => {
    const router = useRouter();
    const queryClient = useQueryClient();

    const handleBackToEvents = useCallback(() => {
        // Invalidar queries relacionadas con eventos para que se actualicen los datos
        queryClient.invalidateQueries({
            queryKey: ['EventsOfBand', bandId],
        });
        queryClient.invalidateQueries({
            queryKey: ['EventById', eventId],
        });
        // Regresar a la página de administración del evento
        router.push(`/grupos/${bandId}/eventos/${eventId}`);
    }, [bandId, eventId, queryClient, router]);

    return { handleBackToEvents };
};
