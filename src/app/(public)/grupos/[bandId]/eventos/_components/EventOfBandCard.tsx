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
  const isUpcoming = currentDate < new Date(event.date);

  return (
    <li className="flex">
      <Link href={`/grupos/${bandId}/eventos/${event.id}`} className="w-full">
        <div
          className={`group relative h-full overflow-hidden rounded-xl border-2 p-5 shadow-md transition-all duration-200 hover:scale-105 hover:shadow-xl active:scale-95 ${
            isUpcoming
              ? 'border-emerald-300 bg-gradient-to-br from-emerald-50 via-white to-green-50'
              : 'border-slate-200 bg-gradient-to-br from-slate-50 via-white to-slate-50'
          }`}
        >
          {/* Badge de estado */}
          <div className="mb-3 flex items-center justify-between">
            <div
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold shadow-sm ${
                isUpcoming
                  ? 'bg-gradient-to-r from-emerald-500 to-green-500 text-white'
                  : 'bg-gradient-to-r from-slate-400 to-slate-500 text-white'
              }`}
            >
              <span>{isUpcoming ? '🎯' : '✓'}</span>
              <span>{isUpcoming ? 'Próximamente' : 'Finalizado'}</span>
            </div>

            {/* Indicador de acción */}
            <div className="text-brand-pink-400 opacity-0 transition-opacity duration-200 group-hover:opacity-100">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </div>
          </div>

          {/* Título del evento */}
          <h3 className="mb-3 text-lg font-bold text-slate-800 group-hover:text-brand-pink-600">
            {event.title}
          </h3>

          {/* Información de fecha/hora */}
          <div className="space-y-2 rounded-lg bg-white/60 p-3 backdrop-blur-sm">
            <div className="flex items-center gap-2 text-sm">
              <span className="text-lg">📅</span>
              <span className="font-medium text-slate-700">
                {formatDate(event.date)}
              </span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="text-lg">⏰</span>
              <span className="font-medium text-slate-700">
                {formatTime(event.date)}
              </span>
            </div>
          </div>

          {/* Efecto decorativo en hover */}
          <div
            className={`absolute -right-10 -top-10 h-32 w-32 rounded-full opacity-0 blur-3xl transition-opacity duration-200 group-hover:opacity-100 ${
              isUpcoming
                ? 'bg-gradient-to-br from-emerald-300 to-green-300'
                : 'bg-gradient-to-br from-slate-300 to-slate-400'
            }`}
          ></div>
        </div>
      </Link>
    </li>
  );
};
