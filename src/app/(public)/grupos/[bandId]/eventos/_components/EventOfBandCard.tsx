import { formatDate, formatTime } from '@global/utils/dataFormat';
import Link from 'next/link';
import { EventsProps } from '../_interfaces/eventsInterface';
import { CalendarIcon, ClockIcon, CheckIcon } from '@global/icons';

export const EventOfBandCard = ({
  event,
  bandId,
}: {
  event: EventsProps;
  bandId: string;
}) => {
  const currentDate = new Date();
  const isUpcoming = currentDate < new Date(event.date);

  return (
    <li className="flex">
      <Link href={`/grupos/${bandId}/eventos/${event.id}`} className="w-full">
        <div
          className={`group relative h-full overflow-hidden rounded-lg border p-4 shadow-sm transition-all duration-200 hover:shadow-md active:scale-[0.98] ${
            isUpcoming
              ? 'border-emerald-200 bg-emerald-50/50 hover:border-emerald-300'
              : 'border-slate-200 bg-white hover:border-slate-300'
          }`}
        >
          {/* Badge de estado */}
          <div className="mb-3 flex items-center justify-between">
            <div
              className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
                isUpcoming
                  ? 'bg-emerald-100 text-emerald-700'
                  : 'bg-slate-100 text-slate-600'
              }`}
            >
              {isUpcoming ? (
                <>
                  <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
                  <span>Próximo</span>
                </>
              ) : (
                <>
                  <CheckIcon className="h-3 w-3" />
                  <span>Finalizado</span>
                </>
              )}
            </div>
          </div>

          {/* Título del evento */}
          <h3 className="mb-3 font-semibold text-slate-900 group-hover:text-brand-purple-600">
            {event.title}
          </h3>

          {/* Información de fecha/hora */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <CalendarIcon className="h-4 w-4 text-slate-400" />
              <span>{formatDate(event.date)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <ClockIcon className="h-4 w-4 text-slate-400" />
              <span>{formatTime(event.date)}</span>
            </div>
          </div>
        </div>
      </Link>
    </li>
  );
};
