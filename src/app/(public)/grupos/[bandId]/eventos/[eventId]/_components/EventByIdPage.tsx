'use client';
import { EventControls } from '@bands/[bandId]/eventos/[eventId]/_components/EventControls';
import { EventMainScreen } from '@bands/[bandId]/eventos/[eventId]/_components/EventMainScreen';
import { useEventByIdPage } from '@bands/[bandId]/eventos/[eventId]/_hooks/useEventByIdPage';
import { EventSimpleTitle } from '@bands/[bandId]/eventos/[eventId]/_components/EventSimpleTitle';
import { EditEventButton } from '@bands/[bandId]/eventos/[eventId]/_components/EditEventButton';
import Link from 'next/link';
import { BackwardIcon } from '@global/icons/BackwardIcon';

export const EventByIdPage = ({
  params,
}: {
  params: { bandId: string; eventId: string };
}) => {
  const { isLoading, refetch } = useEventByIdPage({
    params,
  });

  return (
    <div className="mb-40 flex h-full w-full flex-col items-center justify-center">
      <div className="flex w-full max-w-screen-md flex-col items-center">
        <div className="mb-6 flex items-center gap-2">
          <Link
            href={`/grupos/${params.bandId}`}
            className="group flex items-center justify-center gap-2 transition-all duration-150 hover:cursor-pointer hover:text-primary-500"
          >
            <BackwardIcon />
            <small className="hidden group-hover:block">Volver al grupo</small>
          </Link>
          <h1 className="text-xl font-bold">Evento</h1>
          <EditEventButton
            bandId={params.bandId}
            eventId={params.eventId}
            refetch={refetch}
          />
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
