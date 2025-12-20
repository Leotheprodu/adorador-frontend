'use client';
import { useEventAdminPage } from '@bands/[bandId]/eventos/[eventId]/_hooks/useEventAdminPage';
import { useEventTimeLeft } from '@global/hooks/useEventTimeLeft';
import { useRouter } from 'next/navigation';
import { SongListDisplay } from './SongListDisplay';
import { useEventPermissions } from '../_hooks/useEventPermissions';
import { useEventUpdates } from '../_hooks/useEventUpdates';
import { useEventAdminWebSocket } from '../_hooks/useEventAdminWebSocket';
import { EventAdminHeader } from './EventAdminHeader';
import { EventInfoCard } from './EventInfoCard';
import { EventQuickActions } from './EventQuickActions';
import { EventStatsCard } from './EventStatsCard';
import { EventAdminPageProps } from '../_interfaces/eventAdminInterfaces';
import { useEventPlaylist } from '../_hooks/useEventPlaylist';

export const EventAdminPage = ({ params }: EventAdminPageProps) => {
  const router = useRouter();
  const { event, isLoading, refetch } = useEventAdminPage({ params });
  const { eventTimeLeft } = useEventTimeLeft(event?.date || '');

  // Sync event songs with global playlist
  useEventPlaylist(event?.songs);

  // Custom hooks for logic
  const { isAdminEvent, showActionButtons } = useEventPermissions();

  // Initialize WebSocket for participants and real-time updates
  useEventAdminWebSocket({ params });

  useEventUpdates({
    bandId: params.bandId,
    eventId: params.eventId,
    refetch,
  });

  if (isLoading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-brand-purple-200 border-t-brand-purple-600"></div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex h-full w-full flex-col items-center justify-center gap-4">
        <p className="text-lg text-slate-600 dark:text-slate-200">
          Evento no encontrado
        </p>
        <button
          onClick={() => router.push(`/grupos/${params.bandId}/eventos`)}
          className="rounded-lg bg-brand-purple-600 px-4 py-2 text-white hover:bg-brand-purple-700"
        >
          Volver a eventos
        </button>
      </div>
    );
  }

  const currentDate = new Date();
  const isUpcoming = currentDate < new Date(event.date);

  return (
    <div className="flex h-full w-full flex-col gap-6">
      {/* Header con navegación */}
      <EventAdminHeader
        bandId={params.bandId}
        eventId={params.eventId}
        showActionButtons={showActionButtons}
        isAdminEvent={isAdminEvent}
        refetch={refetch}
      />

      {/* Información del evento */}
      <EventInfoCard
        event={event}
        isUpcoming={isUpcoming}
        eventTimeLeft={eventTimeLeft}
      />

      {/* Acciones rápidas */}
      <EventQuickActions bandId={params.bandId} eventId={params.eventId} />

      {/* Listado de canciones del evento */}
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-purple-800 dark:bg-black/80">
        <SongListDisplay
          songs={event.songs || []}
          params={params}
          refetch={refetch}
          isAdminEvent={isAdminEvent}
          event={event}
        />
      </div>

      {/* Estadísticas del evento */}
      <EventStatsCard event={event} isUpcoming={isUpcoming} />
    </div>
  );
};
