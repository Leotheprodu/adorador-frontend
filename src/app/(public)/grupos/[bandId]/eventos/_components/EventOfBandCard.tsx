import { formatDate, formatTime } from '@global/utils/dataFormat';
import Link from 'next/link';
import { EventsProps } from '../_interfaces/eventsInterface';

export const EventOfBandCard = ({
  event,
  bandId,
}: {
  event: EventsProps;
  bandId: string;
}) => {
  const currentDate = new Date();

  return (
    <li className="flex flex-wrap">
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
  );
};
