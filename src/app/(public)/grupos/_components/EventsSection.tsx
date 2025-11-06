import { Button } from '@nextui-org/react';
import Link from 'next/link';
import { AddEventButton } from './AddEventButton';
import { EventOfBandCard } from '@bands/[bandId]/eventos/_components/EventOfBandCard';

export const EventsSection = ({ data, bandId }) => {
  return (
    <div className="rounded-2xl bg-white/80 p-6 shadow-lg ring-1 ring-slate-200/50 backdrop-blur-sm">
      {/* Header de la sección */}
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-brand-pink-500 to-brand-purple-500 shadow-lg">
            <span className="text-2xl">📅</span>
          </div>
          <div>
            <h2 className="bg-gradient-to-r from-brand-pink-500 to-brand-purple-600 bg-clip-text text-xl font-bold text-transparent sm:text-2xl">
              Eventos
            </h2>
            {data && (
              <p className="text-sm text-slate-500">
                {data?._count?.events || 0} registrados
              </p>
            )}
          </div>
        </div>
        <AddEventButton bandId={bandId} />
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
        <div className="flex flex-col items-center justify-center rounded-xl bg-gradient-to-br from-brand-pink-50/50 to-brand-purple-50/50 py-12">
          <div className="mb-4 text-6xl opacity-50">📅</div>
          <h3 className="mb-2 text-lg font-semibold text-slate-700">
            No hay eventos programados
          </h3>
          <p className="mb-4 text-sm text-slate-500">
            Crea tu primer evento para comenzar a organizar
          </p>
        </div>
      )}

      {/* Botón ver todos */}
      {data && data?._count.events > 5 && (
        <div className="mt-6 flex justify-center">
          <Button
            as={Link}
            href={`/grupos/${bandId}/eventos`}
            className="bg-gradient-to-r from-brand-pink-500 to-brand-purple-600 font-semibold text-white shadow-lg transition-all duration-200 hover:scale-105 hover:shadow-xl active:scale-95"
          >
            Ver todos los eventos ({data?._count.events})
          </Button>
        </div>
      )}
    </div>
  );
};
