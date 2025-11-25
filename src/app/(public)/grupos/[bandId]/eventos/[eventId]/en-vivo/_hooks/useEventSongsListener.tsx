import { useEffect } from 'react';
import { UseEventSongsListenerProps } from '../_interfaces/liveEventInterfaces';

export const useEventSongsListener = ({
    eventId,
    refetch,
}: UseEventSongsListenerProps) => {
    useEffect(() => {
        let refetchTimeout: NodeJS.Timeout | null = null;

        const handleEventSongsUpdated = (event: CustomEvent) => {
            const { eventId: updatedEventId, changeType } = event.detail;

            if (updatedEventId === eventId) {
                console.log(
                    `[EventSongsListener] Evento recibido: ${changeType}. Programando refetch...`,
                );

                // Limpiar timeout anterior si existe
                if (refetchTimeout) {
                    clearTimeout(refetchTimeout);
                }

                // Debounce de 300ms para agrupar múltiples eventos
                refetchTimeout = setTimeout(() => {
                    console.log(
                        `[EventSongsListener] Ejecutando refetch por cambio: ${changeType}`,
                    );
                    refetch();
                }, 300);
            }
        };

        window.addEventListener(
            'eventSongsUpdated',
            handleEventSongsUpdated as EventListener,
        );

        return () => {
            if (refetchTimeout) {
                clearTimeout(refetchTimeout);
            }
            window.removeEventListener(
                'eventSongsUpdated',
                handleEventSongsUpdated as EventListener,
            );
        };
    }, [eventId, refetch]);
};
