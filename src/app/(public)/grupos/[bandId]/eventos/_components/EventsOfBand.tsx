'use client';

import { UIGuard } from '@global/utils/UIGuard';
import { BackwardIcon } from '@global/icons/BackwardIcon';
import { handleBackNavigation } from '@global/utils/navigationUtils';
import { getEventsOfBand } from '../_services/eventsOfBandService';
import { EventOfBandCard } from './EventOfBandCard';
import { AddEventButton } from '@bands/_components/AddEventButton';

export const EventsOfBand = ({ params }: { params: { bandId: string } }) => {
  const { data, isLoading, status } = getEventsOfBand({
    bandId: params.bandId,
  });

  const handleBackToGroup = () => {
    handleBackNavigation(`/grupos/${params.bandId}`);
  };

  // Separar eventos pasados y próximos
  const currentDate = new Date();
  const upcomingEvents =
    data
      ?.filter((event) => new Date(event.date) >= currentDate)
      .sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
      ) || [];

  const pastEvents =
    data
      ?.filter((event) => new Date(event.date) < currentDate)
      .sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      ) || [];

  return (
    <UIGuard
      isLoggedIn={true}
      checkBandId={Number(params.bandId)}
      isLoading={isLoading}
    >
      {/* Header mejorado con gradiente */}
      <div className="mb-6 rounded-2xl bg-gradient-to-br from-brand-pink-50 via-white to-brand-purple-50 p-6 shadow-lg backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBackToGroup}
              className="group flex items-center justify-center gap-2 rounded-xl bg-white/80 p-3 shadow-sm transition-all duration-200 hover:scale-105 hover:bg-brand-pink-50 hover:shadow-md active:scale-95"
            >
              <BackwardIcon />
              <small className="hidden text-xs font-medium text-brand-pink-700 sm:group-hover:block">
                Volver al grupo
              </small>
            </button>
            <div>
              <h1 className="bg-gradient-to-r from-brand-pink-500 to-brand-purple-600 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl">
                Calendario de Eventos
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                {data?.length || 0} eventos registrados
              </p>
            </div>
          </div>
          <div className="hidden sm:block">
            <AddEventButton bandId={params.bandId} />
          </div>
        </div>
        <div className="mt-4 sm:hidden">
          <AddEventButton bandId={params.bandId} />
        </div>
      </div>

      {/* Eventos próximos */}
      {upcomingEvents.length > 0 && (
        <div className="mb-6 rounded-2xl bg-white/80 p-6 shadow-lg ring-1 ring-slate-200/50 backdrop-blur-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-green-500 shadow-lg">
              <span className="text-2xl">🎯</span>
            </div>
            <div>
              <h2 className="bg-gradient-to-r from-emerald-600 to-green-600 bg-clip-text text-xl font-bold text-transparent sm:text-2xl">
                Próximos Eventos
              </h2>
              <p className="text-sm text-slate-500">
                {upcomingEvents.length}{' '}
                {upcomingEvents.length === 1 ? 'evento' : 'eventos'} programados
              </p>
            </div>
          </div>
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {status === 'success' &&
              upcomingEvents.map((event) => (
                <EventOfBandCard
                  key={event.id}
                  event={event}
                  bandId={params.bandId}
                />
              ))}
          </ul>
        </div>
      )}

      {/* Eventos pasados */}
      {pastEvents.length > 0 && (
        <div className="mb-6 rounded-2xl bg-white/80 p-6 shadow-lg ring-1 ring-slate-200/50 backdrop-blur-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-slate-400 to-slate-500 shadow-lg">
              <span className="text-2xl">✓</span>
            </div>
            <div>
              <h2 className="bg-gradient-to-r from-slate-600 to-slate-700 bg-clip-text text-xl font-bold text-transparent sm:text-2xl">
                Eventos Pasados
              </h2>
              <p className="text-sm text-slate-500">
                {pastEvents.length}{' '}
                {pastEvents.length === 1 ? 'evento' : 'eventos'} finalizados
              </p>
            </div>
          </div>
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {status === 'success' &&
              pastEvents.map((event) => (
                <EventOfBandCard
                  key={event.id}
                  event={event}
                  bandId={params.bandId}
                />
              ))}
          </ul>
        </div>
      )}

      {/* Estado vacío */}
      {status === 'success' && data?.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-brand-pink-50/50 to-brand-purple-50/50 py-16">
          <div className="mb-4 text-6xl opacity-50">📅</div>
          <h3 className="mb-2 text-lg font-semibold text-slate-700">
            No hay eventos registrados
          </h3>
          <p className="mb-4 text-sm text-slate-500">
            Crea tu primer evento para comenzar
          </p>
          <AddEventButton bandId={params.bandId} />
        </div>
      )}
    </UIGuard>
  );
};
