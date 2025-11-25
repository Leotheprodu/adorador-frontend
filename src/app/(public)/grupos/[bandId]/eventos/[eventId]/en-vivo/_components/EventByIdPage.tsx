'use client';
import { useMemo, useCallback } from 'react';
import { EventControls } from '@bands/[bandId]/eventos/[eventId]/en-vivo/_components/EventControls';
import { EventMainScreen } from '@bands/[bandId]/eventos/[eventId]/en-vivo/_components/EventMainScreen';
import { useEventByIdPage } from '@bands/[bandId]/eventos/[eventId]/en-vivo/_hooks/useEventByIdPage';
import { EventSimpleTitle } from '@bands/[bandId]/eventos/[eventId]/en-vivo/_components/EventSimpleTitle';
import { EventConnectedUsers } from '@bands/[bandId]/eventos/[eventId]/en-vivo/_components/EventConnectedUsers';
import { useEventPermissions } from '@bands/[bandId]/eventos/[eventId]/en-vivo/_hooks/useEventPermissions';
import { useEventNavigation } from '@bands/[bandId]/eventos/[eventId]/en-vivo/_hooks/useEventNavigation';
import { useEventSongsListener } from '@bands/[bandId]/eventos/[eventId]/en-vivo/_hooks/useEventSongsListener';
import { EventPageHeader } from '@bands/[bandId]/eventos/[eventId]/en-vivo/_components/EventPageHeader';

export const EventByIdPage = ({
  params,
}: {
  params: { bandId: string; eventId: string };
}) => {
  // Memoizar params para evitar re-renders innecesarios
  const memoizedParams = useMemo(
    () => ({
      bandId: params.bandId,
      eventId: params.eventId,
    }),
    [params.bandId, params.eventId],
  );

  const { isLoading, refetch } = useEventByIdPage({
    params: memoizedParams,
  });

  const memoizedRefetch = useCallback(() => {
    refetch();
  }, [refetch]);

  // Hooks compartidos
  const { isAdminEvent, showActionButtons } = useEventPermissions();
  const { handleBackToEvents } = useEventNavigation(memoizedParams);

  // Event listener para actualizaciones de canciones
  useEventSongsListener({
    eventId: params.eventId,
    refetch: memoizedRefetch,
  });

  return (
    <div className="mb-40 flex h-full w-full flex-col items-center justify-center px-3 sm:px-4">
      <div className="flex w-full max-w-screen-md flex-col items-center">
        {/* Header mejorado */}
        <EventPageHeader
          bandId={memoizedParams.bandId}
          eventId={memoizedParams.eventId}
          onBack={handleBackToEvents}
          showActionButtons={showActionButtons}
          isAdminEvent={isAdminEvent}
          refetch={memoizedRefetch}
        />

        {/* Pantalla principal */}
        <div className="w-full">
          <EventMainScreen />
        </div>

        {/* Título del evento */}
        <div className="w-full">
          <EventSimpleTitle />
        </div>

        {/* Usuarios conectados */}
        <div className="w-full">
          <EventConnectedUsers params={params} />
        </div>

        {/* Controles */}
        <div className="w-full">
          <EventControls
            refetch={memoizedRefetch}
            params={memoizedParams}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};
