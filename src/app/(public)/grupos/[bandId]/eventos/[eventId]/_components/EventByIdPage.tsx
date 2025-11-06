'use client';
import { useEffect, useMemo } from 'react';
import { EventControls } from '@bands/[bandId]/eventos/[eventId]/_components/EventControls';
import { EventMainScreen } from '@bands/[bandId]/eventos/[eventId]/_components/EventMainScreen';
import { useEventByIdPage } from '@bands/[bandId]/eventos/[eventId]/_hooks/useEventByIdPage';
import { useEventWSConexion } from '@bands/[bandId]/eventos/[eventId]/_hooks/useEventWSConexion';
import { EventSimpleTitle } from '@bands/[bandId]/eventos/[eventId]/_components/EventSimpleTitle';
import { EditEventButton } from '@bands/[bandId]/eventos/[eventId]/_components/EditEventButton';
import { DeleteEventButton } from '@bands/[bandId]/eventos/[eventId]/_components/DeleteEventButton';
import { BackwardIcon } from '@global/icons/BackwardIcon';
import { handleBackNavigation } from '@global/utils/navigationUtils';
import { EventConnectedUsers } from '@bands/[bandId]/eventos/[eventId]/_components/EventConnectedUsers';
import { useStore } from '@nanostores/react';
import { $user } from '@stores/users';
import { $event } from '@stores/event';
import { userRoles } from '@global/config/constants';

export const EventByIdPage = ({
  params,
}: {
  params: { bandId: string; eventId: string };
}) => {
  const { isLoading, refetch } = useEventByIdPage({
    params,
  });

  // Inicializar conexión WebSocket con autenticación
  useEventWSConexion({
    params,
  });

  const user = useStore($user);
  const event = useStore($event);

  // Verificar si es administrador de la app O administrador específico del evento
  const isAdminEvent = useMemo(() => {
    // Si es admin de la app, siempre tiene acceso
    if (user?.isLoggedIn && user?.roles.includes(userRoles.admin.id)) {
      return true;
    }

    // Si no es admin, verificar si es event manager
    if (user?.isLoggedIn && user?.membersofBands) {
      return user.membersofBands.some(
        (band) => band.band.id === event?.bandId && band.isEventManager,
      );
    }

    return false;
  }, [user, event]);

  // Escuchar cambios en las canciones del evento para hacer refetch automático
  useEffect(() => {
    const handleEventSongsUpdated = (event: CustomEvent) => {
      const { eventId, changeType } = event.detail;

      if (eventId === params.eventId) {
        console.log(
          `[EventByIdPage] Refrescando evento por cambio: ${changeType}`,
        );
        refetch();
      }
    };

    window.addEventListener(
      'eventSongsUpdated',
      handleEventSongsUpdated as EventListener,
    );

    return () => {
      window.removeEventListener(
        'eventSongsUpdated',
        handleEventSongsUpdated as EventListener,
      );
    };
  }, [params.eventId, refetch]);

  const handleBackToEvents = () => {
    handleBackNavigation(`/grupos/${params.bandId}/eventos`);
  };

  return (
    <div className="mb-40 flex h-full w-full flex-col items-center justify-center">
      <div className="flex w-full max-w-screen-md flex-col items-center">
        <div className="mb-6 flex items-center gap-2">
          <button
            onClick={handleBackToEvents}
            className="group flex items-center justify-center gap-2 transition-all duration-150 hover:cursor-pointer hover:text-primary-500"
          >
            <BackwardIcon />
            <small className="hidden group-hover:block">Volver a eventos</small>
          </button>
          <h1 className="text-xl font-bold">Evento</h1>
          {isAdminEvent && (
            <>
              <EditEventButton
                bandId={params.bandId}
                eventId={params.eventId}
                refetch={refetch}
              />
              <DeleteEventButton
                bandId={params.bandId}
                eventId={params.eventId}
              />
            </>
          )}
        </div>
        <EventMainScreen />

        <EventSimpleTitle />

        <EventConnectedUsers params={params} />

        <EventControls
          refetch={refetch}
          params={params}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};
