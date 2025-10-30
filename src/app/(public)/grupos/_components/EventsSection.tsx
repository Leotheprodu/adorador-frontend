import { formatDate, formatTime } from '@global/utils/dataFormat';
import { Button } from '@nextui-org/react';
import Link from 'next/link';
import { AddEventButton } from './AddEventButton';

export const EventsSection = ({ data, bandId }) => {
  const currentDate = new Date();
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
            <li className="flex flex-wrap" key={event.id}>
              <Link href={`/grupos/${bandId}/eventos/${event.id}`}>
                <div
                  className={`${currentDate < new Date(event.date) ? 'border-success-500' : 'border-gray-100'} rounded-md border p-2 hover:cursor-pointer hover:bg-gray-100`}
                >
                  <h3>{event.title}</h3>
                  <div className="border-b border-t border-gray-200">
                    <div className="flex w-full justify-center bg-slate-100">
                      {currentDate < new Date(event.date) ? (
                        <small className="text-primary-400">Próximamente</small>
                      ) : (
                        <small className="text-secondary-400">Ya pasó</small>
                      )}
                    </div>
                    <div className="flex flex-col items-center">
                      <p>{formatDate(event.date)}</p>
                      <p>{formatTime(event.date)}</p>
                    </div>
                  </div>
                </div>
              </Link>
            </li>
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
