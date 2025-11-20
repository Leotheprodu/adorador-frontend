'use client';
import { useEventAdminPage } from '@bands/[bandId]/eventos/[eventId]/_hooks/useEventAdminPage';
import { useEventTimeLeft } from '@global/hooks/useEventTimeLeft';
import { formatDate, formatTime } from '@global/utils/dataFormat';
import { CalendarIcon, ClockIcon, PlayIcon, UsersIcon } from '@global/icons';
import Link from 'next/link';
import { EditEventButton } from '@bands/[bandId]/eventos/[eventId]/en-vivo/_components/EditEventButton';
import { DeleteEventButton } from '@bands/[bandId]/eventos/[eventId]/en-vivo/_components/DeleteEventButton';
import { BackwardIcon } from '@global/icons/BackwardIcon';
import { useRouter } from 'next/navigation';
import { useStore } from '@nanostores/react';
import { $user } from '@stores/users';
import { userRoles } from '@global/config/constants';
import { useEffect, useMemo } from 'react';
import { $event } from '@stores/event';
import { SongListDisplay } from './SongListDisplay';
import { useQueryClient } from '@tanstack/react-query';

export const EventAdminPage = ({
  params,
}: {
  params: { bandId: string; eventId: string };
}) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { event, isLoading, refetch } = useEventAdminPage({ params });
  const { eventTimeLeft } = useEventTimeLeft(event?.date || '');
  const user = useStore($user);
  const eventStore = useStore($event);

  const isAdminEvent = useMemo(() => {
    if (user?.isLoggedIn && user?.roles.includes(userRoles.admin.id)) {
      return true;
    }

    if (user?.isLoggedIn && user?.membersofBands) {
      return user.membersofBands.some(
        (band) => band.band.id === eventStore?.bandId && band.isAdmin,
      );
    }

    return false;
  }, [user, eventStore]);

  // Verificar si es event manager (para mostrar botones deshabilitados)
  const isEventManager = useMemo(() => {
    if (user?.isLoggedIn && user?.membersofBands) {
      const bandMembership = user.membersofBands.find(
        (band) => band.band.id === eventStore?.bandId,
      );
      return Boolean(
        bandMembership &&
          bandMembership.isEventManager &&
          !bandMembership.isAdmin,
      );
    }
    return false;
  }, [user, eventStore]);

  // Determinar si mostrar botones (admin o event manager)
  const showActionButtons = isAdminEvent || isEventManager;

  // Escuchar eventos de actualización de canciones y hacer refetch
  useEffect(() => {
    const handleInvalidateQueries = () => {
      console.log('[EventAdminPage] Invalidando queries del evento...');
      // Invalidar la query para forzar refetch
      queryClient.invalidateQueries({
        queryKey: ['Event', params.bandId, params.eventId],
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
  }, [params.bandId, params.eventId, queryClient, refetch]);

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
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push(`/grupos/${params.bandId}/eventos`)}
          className="flex items-center gap-2 text-slate-600 transition-colors hover:text-brand-purple-600 dark:text-slate-200 dark:hover:text-brand-purple-300"
        >
          <BackwardIcon className="h-5 w-5" />
          <span>Volver a eventos</span>
        </button>

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

      {/* Información del evento */}
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-purple-800 dark:bg-black/80">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {event.title}
          </h1>
          <div
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold ${
              isUpcoming
                ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300'
                : 'bg-slate-100 text-slate-600 dark:bg-gray-900/60 dark:text-slate-300'
            }`}
          >
            {isUpcoming ? (
              <>
                <div className="h-2 w-2 rounded-full bg-emerald-500 dark:bg-emerald-300"></div>
                <span>Próximo</span>
              </>
            ) : (
              <span>Finalizado</span>
            )}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-4 dark:bg-gray-900/60">
            <CalendarIcon className="h-5 w-5 text-slate-500 dark:text-slate-300" />
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-300">
                Fecha
              </p>
              <p className="font-semibold text-slate-900 dark:text-slate-100">
                {formatDate(event.date, true)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-4 dark:bg-gray-900/60">
            <ClockIcon className="h-5 w-5 text-slate-500 dark:text-slate-300" />
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-300">Hora</p>
              <p className="font-semibold text-slate-900 dark:text-slate-100">
                {formatTime(event.date)}
              </p>
            </div>
          </div>
        </div>

        {isUpcoming && eventTimeLeft && (
          <div className="mt-4 rounded-lg bg-gradient-to-r from-brand-purple-50 to-brand-blue-50 p-4 ring-1 ring-brand-purple-200/50 dark:from-brand-purple-900 dark:to-brand-blue-900 dark:ring-purple-800">
            <p className="text-center text-sm font-semibold text-brand-purple-700 dark:text-slate-100">
              ⏱️ Tiempo restante: {eventTimeLeft}
            </p>
          </div>
        )}
      </div>

      {/* Acciones rápidas */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {/* Ir al evento en vivo */}
        <Link
          href={`/grupos/${params.bandId}/eventos/${params.eventId}/en-vivo`}
          className="group relative overflow-hidden rounded-lg border border-brand-purple-200 bg-gradient-to-br from-brand-purple-50 to-brand-blue-50 p-6 shadow-sm transition-all duration-200 hover:shadow-md active:scale-[0.98] dark:border-purple-800 dark:from-brand-purple-900 dark:to-brand-blue-900"
        >
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-brand-purple-100 p-3 dark:bg-brand-purple-900/60">
              <PlayIcon className="h-6 w-6 text-brand-purple-600 dark:text-brand-purple-200" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 group-hover:text-brand-purple-600 dark:text-slate-100 dark:group-hover:text-brand-purple-300">
                Evento en Vivo
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-300">
                Ver y controlar el evento
              </p>
            </div>
          </div>
        </Link>

        {/* Participantes (próximamente) */}
        <div className="group relative overflow-hidden rounded-lg border border-slate-200 bg-white p-6 opacity-60 shadow-sm dark:border-purple-800 dark:bg-gray-900/60">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-slate-100 p-3 dark:bg-gray-800">
              <UsersIcon className="h-6 w-6 text-slate-500 dark:text-slate-300" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-700 dark:text-slate-100">
                Participantes
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-300">
                Próximamente
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Listado de canciones del evento */}
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-purple-800 dark:bg-black/80">
        <SongListDisplay
          songs={event.songs || []}
          params={params}
          refetch={refetch}
          isAdminEvent={isAdminEvent}
        />
      </div>

      {/* Estadísticas del evento */}
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm dark:border-purple-800 dark:bg-black/80">
        <h2 className="mb-4 text-lg font-semibold text-slate-900 dark:text-slate-100">
          Información del Evento
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg bg-slate-50 p-4 dark:bg-gray-900/60">
            <p className="text-sm text-slate-500 dark:text-slate-300">
              Canciones
            </p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {event.songs?.length || 0}
            </p>
          </div>
          <div className="rounded-lg bg-slate-50 p-4 dark:bg-gray-900/60">
            <p className="text-sm text-slate-500 dark:text-slate-300">Estado</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {isUpcoming ? '🟢 Activo' : '⚪ Finalizado'}
            </p>
          </div>
          <div className="rounded-lg bg-slate-50 p-4 dark:bg-gray-900/60">
            <p className="text-sm text-slate-500 dark:text-slate-300">
              ID del Evento
            </p>
            <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">
              #{event.id}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
