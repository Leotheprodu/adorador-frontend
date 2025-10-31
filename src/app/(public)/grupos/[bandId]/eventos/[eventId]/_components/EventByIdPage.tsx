'use client';
import { EventControls } from '@bands/[bandId]/eventos/[eventId]/_components/EventControls';
import { EventMainScreen } from '@bands/[bandId]/eventos/[eventId]/_components/EventMainScreen';
import { useEventByIdPage } from '@bands/[bandId]/eventos/[eventId]/_hooks/useEventByIdPage';
import { EventSimpleTitle } from '@bands/[bandId]/eventos/[eventId]/_components/EventSimpleTitle';
import { EditEventButton } from '@bands/[bandId]/eventos/[eventId]/_components/EditEventButton';
import { DeleteEventButton } from '@bands/[bandId]/eventos/[eventId]/_components/DeleteEventButton';
import { BackwardIcon } from '@global/icons/BackwardIcon';
import { handleBackNavigation } from '@global/utils/navigationUtils';

export const EventByIdPage = ({
  params,
}: {
  params: { bandId: string; eventId: string };
}) => {
  const { isLoading, refetch } = useEventByIdPage({
    params,
  });

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
          <EditEventButton
            bandId={params.bandId}
            eventId={params.eventId}
            refetch={refetch}
          />
          <DeleteEventButton bandId={params.bandId} eventId={params.eventId} />
        </div>
        <EventMainScreen />

        <EventSimpleTitle />

        <EventControls
          refetch={refetch}
          params={params}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};
