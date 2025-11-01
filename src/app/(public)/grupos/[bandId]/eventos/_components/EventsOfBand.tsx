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
      <div className="mb-6 flex items-center gap-2">
        <button
          onClick={handleBackToGroup}
          className="group flex items-center justify-center gap-2 transition-all duration-150 hover:cursor-pointer hover:text-primary-500"
        >
          <BackwardIcon />
          <small className="hidden group-hover:block">Volver al grupo</small>
        </button>
        <h1 className="text-xl font-bold">Eventos</h1>
        <AddEventButton bandId={params.bandId} />
      </div>

      {/* Eventos próximos */}
      {upcomingEvents.length > 0 && (
        <div className="my-6 border-l-2 border-success-500 p-2">
          <h2 className="my-4 text-lg font-semibold text-success-600">
            Próximos eventos
          </h2>
          <ul className="flex flex-wrap gap-3">
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
        <div className="my-6 border-l-2 border-gray-300 p-2">
          <h2 className="my-4 text-lg font-semibold text-gray-600">
            Eventos pasados
          </h2>
          <ul className="flex flex-wrap gap-3">
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

      {/* Sin eventos */}
      {status === 'success' && data?.length === 0 && (
        <div className="flex flex-col items-center justify-center py-10">
          <p className="text-gray-500">
            No hay eventos registrados para este grupo
          </p>
        </div>
      )}
    </UIGuard>
  );
};
