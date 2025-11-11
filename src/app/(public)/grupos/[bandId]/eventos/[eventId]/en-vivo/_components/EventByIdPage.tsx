'use client';
import { useEffect, useMemo } from 'react';
import { EventControls } from '@bands/[bandId]/eventos/[eventId]/en-vivo/_components/EventControls';
import { EventMainScreen } from '@bands/[bandId]/eventos/[eventId]/en-vivo/_components/EventMainScreen';
import { useEventByIdPage } from '@bands/[bandId]/eventos/[eventId]/en-vivo/_hooks/useEventByIdPage';
import { EventSimpleTitle } from '@bands/[bandId]/eventos/[eventId]/en-vivo/_components/EventSimpleTitle';
import { EditEventButton } from '@bands/[bandId]/eventos/[eventId]/en-vivo/_components/EditEventButton';
import { DeleteEventButton } from '@bands/[bandId]/eventos/[eventId]/en-vivo/_components/DeleteEventButton';
import { BackwardIcon } from '@global/icons/BackwardIcon';
import { EventConnectedUsers } from '@bands/[bandId]/eventos/[eventId]/en-vivo/_components/EventConnectedUsers';
import { useStore } from '@nanostores/react';
import { $user } from '@stores/users';
import { $event } from '@stores/event';
import { userRoles } from '@global/config/constants';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';

export const EventByIdPage = ({
  params,
}: {
  params: { bandId: string; eventId: string };
}) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { isLoading, refetch } = useEventByIdPage({
    params,
  });

  // NOTA: La conexión WebSocket se inicializa dentro de useEventByIdPage
  // No llamar useEventWSConexion aquí para evitar conexiones duplicadas

  const user = useStore($user);
  const event = useStore($event);

  // Verificar si es administrador de la app O administrador específico del evento
  const isAdminEvent = useMemo(() => {
    // Si es admin de la app, siempre tiene acceso
    if (user?.isLoggedIn && user?.roles.includes(userRoles.admin.id)) {
      return true;
    }

    // Si no es admin, verificar si es admin de la banda (NO event manager)
    if (user?.isLoggedIn && user?.membersofBands) {
      return user.membersofBands.some(
        (band) => band.band.id === event?.bandId && band.isAdmin,
      );
    }

    return false;
  }, [user, event]);

  // Verificar si es event manager (para mostrar botones deshabilitados)
  const isEventManager = useMemo(() => {
    if (user?.isLoggedIn && user?.membersofBands) {
      const bandMembership = user.membersofBands.find(
        (band) => band.band.id === event?.bandId,
      );
      return Boolean(
        bandMembership &&
          bandMembership.isEventManager &&
          !bandMembership.isAdmin,
      );
    }
    return false;
  }, [user, event]);

  // Determinar si mostrar botones (admin o event manager)
  const showActionButtons = isAdminEvent || isEventManager;

  // Escuchar cambios en las canciones del evento para hacer refetch automático
  // con debounce para evitar múltiples refetches
  useEffect(() => {
    let refetchTimeout: NodeJS.Timeout | null = null;

    const handleEventSongsUpdated = (event: CustomEvent) => {
      const { eventId, changeType } = event.detail;

      if (eventId === params.eventId) {
        console.log(
          `[EventByIdPage] Evento recibido: ${changeType}. Programando refetch...`,
        );

        // Limpiar timeout anterior si existe
        if (refetchTimeout) {
          clearTimeout(refetchTimeout);
        }

        // Debounce de 300ms para agrupar múltiples eventos
        refetchTimeout = setTimeout(() => {
          console.log(
            `[EventByIdPage] Ejecutando refetch por cambio: ${changeType}`,
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
  }, [params.eventId, refetch]);

  const handleBackToEvents = () => {
    // Invalidar queries relacionadas con eventos para que se actualicen los datos
    queryClient.invalidateQueries({
      queryKey: ['EventsOfBand', params.bandId],
    });
    queryClient.invalidateQueries({
      queryKey: ['EventById', params.eventId],
    });
    // Regresar a la página de administración del evento
    router.push(`/grupos/${params.bandId}/eventos/${params.eventId}`);
  };

  return (
    <div className="mb-40 flex h-full w-full flex-col items-center justify-center px-3 sm:px-4">
      <div className="flex w-full max-w-screen-md flex-col items-center">
        {/* Header mejorado con gradiente sutil y glassmorphism */}
        <div className="mb-4 w-full rounded-2xl bg-gradient-to-br from-brand-purple-50 via-white to-brand-blue-50 p-4 shadow-sm backdrop-blur-sm sm:mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={handleBackToEvents}
                className="group flex items-center justify-center gap-2 rounded-lg bg-white/80 p-2 shadow-sm transition-all duration-200 hover:scale-105 hover:bg-brand-purple-50 hover:shadow-md active:scale-95"
                aria-label="Volver a eventos"
              >
                <BackwardIcon />
                <small className="hidden text-xs font-medium text-brand-purple-700 sm:group-hover:block">
                  Volver
                </small>
              </button>
              <div>
                <h1 className="bg-gradient-to-r from-brand-purple-600 to-brand-blue-600 bg-clip-text text-xl font-bold text-transparent sm:text-2xl">
                  Evento en Vivo
                </h1>
                <p className="text-xs text-slate-500">
                  Panel de control musical
                </p>
              </div>
            </div>

            {/* Botones de admin con mejor diseño */}
            {showActionButtons && (
              <div className="flex items-center gap-2">
                <EditEventButton
                  bandId={params.bandId}
                  eventId={params.eventId}
                  refetch={refetch}
                  isAdminEvent={isAdminEvent}
                />
                <DeleteEventButton
                  bandId={params.bandId}
                  eventId={params.eventId}
                  isAdminEvent={isAdminEvent}
                />
              </div>
            )}
          </div>
        </div>

        {/* Pantalla principal con mejor sombra y bordes */}
        <div className="w-full">
          <EventMainScreen />
        </div>

        {/* Título del evento */}
        <div className="w-full">
          <EventSimpleTitle />
        </div>

        {/* Usuarios conectados con mejor diseño */}
        <div className="w-full">
          <EventConnectedUsers params={params} />
        </div>

        {/* Controles con diseño mejorado */}
        <div className="w-full">
          <EventControls
            refetch={refetch}
            params={params}
            isLoading={isLoading}
          />
        </div>
      </div>
    </div>
  );
};
