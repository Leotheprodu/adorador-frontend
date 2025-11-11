'use client';
import { useEventAdminPage } from '@bands/[bandId]/eventos/[eventId]/_hooks/useEventAdminPage';
import { useEventTimeLeft } from '@global/hooks/useEventTimeLeft';
import { formatDate, formatTime } from '@global/utils/dataFormat';
import {
  CalendarIcon,
  ClockIcon,
  PlayIcon,
  GearIcon,
  UsersIcon,
} from '@global/icons';
import Link from 'next/link';
import { EditEventButton } from '@bands/[bandId]/eventos/[eventId]/en-vivo/_components/EditEventButton';
import { DeleteEventButton } from '@bands/[bandId]/eventos/[eventId]/en-vivo/_components/DeleteEventButton';
import { BackwardIcon } from '@global/icons/BackwardIcon';
import { useRouter } from 'next/navigation';
import { useStore } from '@nanostores/react';
import { $user } from '@stores/users';
import { userRoles } from '@global/config/constants';
import { useMemo } from 'react';
import { $event } from '@stores/event';

export const EventAdminPage = ({
  params,
}: {
  params: { bandId: string; eventId: string };
}) => {
  const router = useRouter();
  const { event, isLoading } = useEventAdminPage({ params });
  const { eventTimeLeft } = useEventTimeLeft(event?.date || '');
  const user = useStore($user);
  const eventStore = useStore($event);

  const isAdminEvent = useMemo(() => {
    if (user?.isLoggedIn && user?.roles.includes(userRoles.admin.id)) {
      return true;
    }

    if (user?.isLoggedIn && user?.membersofBands) {
      return user.membersofBands.some(
        (band) => band.band.id === eventStore?.bandId && band.isEventManager,
      );
    }

    return false;
  }, [user, eventStore]);

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
        <p className="text-lg text-slate-600">Evento no encontrado</p>
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

  // Mock refetch function
  const mockRefetch = () => {
    console.log('Refetch called from admin page');
  };

  return (
    <div className="flex h-full w-full flex-col gap-6">
      {/* Header con navegación */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push(`/grupos/${params.bandId}/eventos`)}
          className="flex items-center gap-2 text-slate-600 transition-colors hover:text-brand-purple-600"
        >
          <BackwardIcon className="h-5 w-5" />
          <span>Volver a eventos</span>
        </button>

        <div className="flex items-center gap-2">
          {isAdminEvent && (
            <>
              <EditEventButton
                bandId={params.bandId}
                eventId={params.eventId}
                refetch={mockRefetch}
              />
              <DeleteEventButton
                bandId={params.bandId}
                eventId={params.eventId}
              />
            </>
          )}
        </div>
      </div>

      {/* Información del evento */}
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">{event.title}</h1>
          <div
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-semibold ${
              isUpcoming
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            {isUpcoming ? (
              <>
                <div className="h-2 w-2 rounded-full bg-emerald-500"></div>
                <span>Próximo</span>
              </>
            ) : (
              <span>Finalizado</span>
            )}
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-4">
            <CalendarIcon className="h-5 w-5 text-slate-500" />
            <div>
              <p className="text-xs text-slate-500">Fecha</p>
              <p className="font-semibold text-slate-900">
                {formatDate(event.date, true)}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-lg bg-slate-50 p-4">
            <ClockIcon className="h-5 w-5 text-slate-500" />
            <div>
              <p className="text-xs text-slate-500">Hora</p>
              <p className="font-semibold text-slate-900">
                {formatTime(event.date)}
              </p>
            </div>
          </div>
        </div>

        {isUpcoming && eventTimeLeft && (
          <div className="mt-4 rounded-lg bg-gradient-to-r from-brand-purple-50 to-brand-blue-50 p-4 ring-1 ring-brand-purple-200/50">
            <p className="text-center text-sm font-semibold text-brand-purple-700">
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
          className="group relative overflow-hidden rounded-lg border border-brand-purple-200 bg-gradient-to-br from-brand-purple-50 to-brand-blue-50 p-6 shadow-sm transition-all duration-200 hover:shadow-md active:scale-[0.98]"
        >
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-brand-purple-100 p-3">
              <PlayIcon className="h-6 w-6 text-brand-purple-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 group-hover:text-brand-purple-600">
                Evento en Vivo
              </h3>
              <p className="text-sm text-slate-600">
                Ver y controlar el evento
              </p>
            </div>
          </div>
        </Link>

        {/* Gestionar canciones (próximamente) */}
        <div className="group relative overflow-hidden rounded-lg border border-slate-200 bg-white p-6 opacity-60 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-slate-100 p-3">
              <GearIcon className="h-6 w-6 text-slate-500" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-700">
                Gestionar Canciones
              </h3>
              <p className="text-sm text-slate-500">Próximamente</p>
            </div>
          </div>
        </div>

        {/* Participantes (próximamente) */}
        <div className="group relative overflow-hidden rounded-lg border border-slate-200 bg-white p-6 opacity-60 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="rounded-full bg-slate-100 p-3">
              <UsersIcon className="h-6 w-6 text-slate-500" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-700">Participantes</h3>
              <p className="text-sm text-slate-500">Próximamente</p>
            </div>
          </div>
        </div>
      </div>

      {/* Estadísticas del evento */}
      <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-slate-900">
          Información del Evento
        </h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Canciones</p>
            <p className="text-2xl font-bold text-slate-900">
              {event.songs?.length || 0}
            </p>
          </div>
          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-sm text-slate-500">Estado</p>
            <p className="text-2xl font-bold text-slate-900">
              {isUpcoming ? '🟢 Activo' : '⚪ Finalizado'}
            </p>
          </div>
          <div className="rounded-lg bg-slate-50 p-4">
            <p className="text-sm text-slate-500">ID del Evento</p>
            <p className="text-lg font-semibold text-slate-900">#{event.id}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
