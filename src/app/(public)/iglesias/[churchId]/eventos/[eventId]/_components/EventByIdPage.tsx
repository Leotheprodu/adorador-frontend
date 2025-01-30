'use client';
import { EventControls } from '@iglesias/[churchId]/eventos/[eventId]/_components/EventControls';
import { EventMainScreen } from '@iglesias/[churchId]/eventos/[eventId]/_components/EventMainScreen';
import { useEventByIdPage } from '@iglesias/[churchId]/eventos/[eventId]/_hooks/useEventByIdPage';
import { EventSimpleTitle } from '@iglesias/[churchId]/eventos/[eventId]/_components/EventSimpleTitle';
import Link from 'next/link';
import { BackwardIcon } from '@global/icons/BackwardIcon';

export const EventByIdPage = ({
  params,
}: {
  params: { churchId: string; eventId: string };
}) => {
  const { isLoading, refetch } = useEventByIdPage({
    params,
  });

  return (
    <div className="flex h-full w-full flex-col items-center justify-center">
      <div className="flex w-full max-w-screen-md flex-col items-center">
        <div className="mb-6 flex items-center gap-2">
          <Link
            href={`/iglesias/${params.churchId}`}
            className="group flex items-center justify-center gap-2 transition-all duration-150 hover:cursor-pointer hover:text-primary-500"
          >
            <BackwardIcon />
            <small className="hidden group-hover:block">Volver a iglesia</small>
          </Link>
          <h1 className="text-xl font-bold">Evento</h1>
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
