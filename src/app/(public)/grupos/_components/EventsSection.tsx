import { Button } from '@nextui-org/react';
import Link from 'next/link';
import { AddEventButton } from './AddEventButton';
import { EventOfBandCard } from '@bands/[bandId]/eventos/_components/EventOfBandCard';

export const EventsSection = ({ data, bandId }) => {
  return (
    <div className="my-4 flex flex-col justify-center">
      <div className="my-6 flex items-center">
        <h2 className="text-lg">Eventos</h2>
        <AddEventButton bandId={bandId} />
      </div>
      <ul className="flex flex-wrap justify-center gap-3">
        {data?.events
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
          )
          .map((event) => (
            <EventOfBandCard key={event.id} event={event} bandId={bandId} />
          ))}
      </ul>
      {data && data?._count.events > 5 && (
        <div className="flex justify-center">
          <Button
            color="primary"
            variant="ghost"
            as={Link}
            href={`/grupos/${bandId}/eventos`}
            className="mt-4 w-48"
          >
            Ver todos los eventos ({data?._count.events})
          </Button>
        </div>
      )}
    </div>
  );
};
