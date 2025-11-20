import { Button } from '@nextui-org/react';
import Link from 'next/link';
import { AddEventButton } from './AddEventButton';
import { EventOfBandCard } from '@bands/[bandId]/eventos/_components/EventOfBandCard';
import { CalendarIcon } from '@global/icons';

export const EventsSection = ({ data, bandId }) => {
  const hasMany = data && data?._count.events > 5;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-brand-purple-800 dark:bg-black">
      {/* Header de la sección */}
      <div className="mb-6 flex flex-col gap-3 border-b border-slate-100 pb-4 dark:border-brand-purple-800 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg bg-brand-purple-600">
            <CalendarIcon className="h-5 w-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-slate-100">
              Eventos
            </h2>
            {data && (
              <p className="text-sm text-slate-500 dark:text-slate-200">
                {data?._count?.events || 0} registrados
              </p>
            )}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {hasMany && (
            <Button
              as={Link}
              href={`/grupos/${bandId}/eventos`}
              size="sm"
              className="border-2 border-slate-200 bg-white font-semibold text-slate-700 transition-all hover:border-brand-purple-300 hover:bg-brand-purple-50 dark:bg-brand-purple-800 dark:text-slate-100 dark:hover:border-brand-purple-800 dark:hover:bg-brand-purple-950"
            >
              <span className="whitespace-nowrap">
                Ver todos ({data?._count.events})
              </span>
            </Button>
          )}
          <AddEventButton bandId={bandId} />
        </div>
      </div>

      {/* Grid de eventos o estado vacío */}
      {data && data.events && data.events.length > 0 ? (
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {data.events
            .sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
            )
            .map((event) => (
              <EventOfBandCard key={event.id} event={event} bandId={bandId} />
            ))}
        </ul>
      ) : (
        <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 py-12">
          <CalendarIcon className="mb-4 h-12 w-12 text-slate-300" />
          <h3 className="mb-2 text-lg font-semibold text-slate-700 dark:text-slate-100">
            No hay eventos programados
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-200">
            Crea tu primer evento para comenzar a organizar
          </p>
        </div>
      )}
    </div>
  );
};
