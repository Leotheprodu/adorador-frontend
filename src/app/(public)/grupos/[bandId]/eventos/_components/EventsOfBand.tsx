'use client';

import { useState, useEffect } from 'react';
import { UIGuard } from '@global/utils/UIGuard';
import { BackwardIcon } from '@global/icons/BackwardIcon';
import { SearchIcon } from '@global/icons';
import { getEventsOfBand } from '../_services/eventsOfBandService';
import { EventTableRow } from './EventTableRow';
import { AddEventButton } from '@bands/_components/AddEventButton';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';

export const EventsOfBand = ({ params }: { params: { bandId: string } }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data, isLoading, status, refetch } = getEventsOfBand({
    bandId: params.bandId,
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [eventStatusFilter, setEventStatusFilter] = useState<
    'all' | 'upcoming' | 'past'
  >('all');
  const [filteredEvents, setFilteredEvents] = useState(data);

  // Function to normalize text
  const normalizeText = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  };

  const handleBackToGroup = () => {
    // Invalidar queries relacionadas con el grupo para que se actualicen los datos
    queryClient.invalidateQueries({ queryKey: ['BandById', params.bandId] });
    // Usar router de Next.js para navegación sin recargar la página
    router.push(`/grupos/${params.bandId}`);
  };

  // Filter and search logic
  useEffect(() => {
    let filtered = data;
    const currentDate = new Date();

    // Apply search filter
    if (searchTerm !== '') {
      const normalizedSearch = normalizeText(searchTerm);
      filtered = filtered?.filter((event) =>
        normalizeText(event.title).includes(normalizedSearch),
      );
    }

    // Apply status filter
    if (eventStatusFilter === 'upcoming') {
      filtered = filtered?.filter(
        (event) => new Date(event.date) >= currentDate,
      );
    } else if (eventStatusFilter === 'past') {
      filtered = filtered?.filter(
        (event) => new Date(event.date) < currentDate,
      );
    }

    // Sort: upcoming events ascending, past events descending
    filtered = filtered?.sort((a, b) => {
      const aDate = new Date(a.date).getTime();
      const bDate = new Date(b.date).getTime();
      const aIsUpcoming = new Date(a.date) >= currentDate;
      const bIsUpcoming = new Date(b.date) >= currentDate;

      // If filtering by specific status, sort accordingly
      if (eventStatusFilter === 'upcoming') {
        return aDate - bDate; // Ascending for upcoming
      } else if (eventStatusFilter === 'past') {
        return bDate - aDate; // Descending for past
      }

      // When showing all, prioritize upcoming events first
      if (aIsUpcoming && !bIsUpcoming) return -1;
      if (!aIsUpcoming && bIsUpcoming) return 1;
      // Within same category, upcoming ascending, past descending
      return aIsUpcoming ? aDate - bDate : bDate - aDate;
    });

    setFilteredEvents(filtered);
  }, [searchTerm, eventStatusFilter, data]);

  return (
    <UIGuard
      isLoggedIn={true}
      checkBandId={Number(params.bandId)}
      isLoading={isLoading}
    >
      {/* Header mejorado con gradiente y dark mode */}
      <div className="mb-6 rounded-2xl bg-gradient-to-br from-brand-pink-50 via-white to-brand-purple-50 p-6 shadow-lg backdrop-blur-sm dark:border dark:border-purple-800 dark:bg-gradient-to-br dark:from-black dark:via-gray-900 dark:to-purple-950">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBackToGroup}
                className="group flex items-center justify-center gap-2 rounded-xl bg-white/80 p-3 shadow-sm transition-all duration-200 hover:scale-105 hover:bg-brand-pink-50 hover:shadow-md active:scale-95 dark:border dark:border-purple-800 dark:bg-gray-900/80 dark:hover:bg-purple-900/60"
              >
                <BackwardIcon />
                <small className="hidden text-xs font-medium text-brand-pink-700 sm:group-hover:block">
                  Volver al grupo
                </small>
              </button>
              <div>
                <h1 className="bg-gradient-to-r from-brand-pink-500 to-brand-purple-600 bg-clip-text text-2xl font-bold text-transparent dark:from-brand-pink-400 dark:to-brand-purple-400 sm:text-3xl">
                  Calendario de Eventos
                </h1>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-200">
                  {filteredEvents?.length || 0} de {data?.length || 0} eventos
                </p>
              </div>
            </div>
            <div className="hidden sm:block">
              <AddEventButton bandId={params.bandId} />
            </div>
          </div>

          {/* Buscador y filtros */}
          <div className="flex flex-col gap-3 sm:flex-row">
            {/* Search input */}
            <div className="relative flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <SearchIcon className="h-5 w-5 text-slate-400 dark:text-slate-300" />
              </div>
              <input
                type="text"
                placeholder="Buscar eventos por título..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border-2 border-slate-200 bg-white/80 py-2 pl-10 pr-4 text-sm transition-all duration-200 focus:border-brand-pink-600 focus:outline-none focus:ring-2 focus:ring-brand-pink-200 dark:border-purple-800 dark:bg-gray-900/80 dark:text-slate-100 dark:placeholder:text-slate-400"
              />
            </div>

            {/* Filter buttons */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setEventStatusFilter('all')}
                className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-200 ${
                  eventStatusFilter === 'all'
                    ? 'bg-gradient-to-r from-brand-pink-600 to-brand-purple-600 text-white shadow-sm dark:from-brand-pink-500 dark:to-brand-purple-700'
                    : 'border-2 border-slate-200 bg-white/80 text-slate-600 hover:border-brand-pink-300 hover:bg-slate-50 dark:border-purple-800 dark:bg-gray-900/80 dark:text-slate-100 dark:hover:bg-purple-900/60'
                }`}
              >
                Todos
              </button>
              <button
                onClick={() => setEventStatusFilter('upcoming')}
                className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-200 ${
                  eventStatusFilter === 'upcoming'
                    ? 'bg-gradient-to-r from-brand-pink-600 to-brand-purple-600 text-white shadow-sm dark:from-brand-pink-500 dark:to-brand-purple-700'
                    : 'border-2 border-slate-200 bg-white/80 text-slate-600 hover:border-brand-pink-300 hover:bg-slate-50 dark:border-purple-800 dark:bg-gray-900/80 dark:text-slate-100 dark:hover:bg-purple-900/60'
                }`}
              >
                🎯 Próximos
              </button>
              <button
                onClick={() => setEventStatusFilter('past')}
                className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-200 ${
                  eventStatusFilter === 'past'
                    ? 'bg-gradient-to-r from-brand-pink-600 to-brand-purple-600 text-white shadow-sm dark:from-brand-pink-500 dark:to-brand-purple-700'
                    : 'border-2 border-slate-200 bg-white/80 text-slate-600 hover:border-brand-pink-300 hover:bg-slate-50 dark:border-purple-800 dark:bg-gray-900/80 dark:text-slate-100 dark:hover:bg-purple-900/60'
                }`}
              >
                ✓ Pasados
              </button>
            </div>
          </div>

          <div className="sm:hidden">
            <AddEventButton bandId={params.bandId} />
          </div>
        </div>
      </div>

      {/* Tabla única de eventos */}
      {filteredEvents && filteredEvents.length > 0 ? (
        <div className="mb-6 overflow-hidden rounded-2xl bg-white/80 shadow-lg ring-1 ring-slate-200/50 backdrop-blur-sm dark:bg-black/80 dark:ring-purple-800">
          <div className="max-w-full overflow-x-auto">
            <table className="w-full min-w-full border-separate border-spacing-0">
              <thead className="hidden border-b border-slate-200 bg-slate-50/50 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:border-purple-800 dark:bg-gray-900/80 dark:text-slate-100 sm:table-header-group">
                <tr>
                  <th className="rounded-tl-2xl bg-slate-50 px-4 py-3 text-left dark:bg-gray-900/80 dark:text-slate-100">
                    Estado
                  </th>
                  <th className="bg-slate-50 px-4 py-3 text-left dark:bg-gray-900/80 dark:text-slate-100">
                    Evento
                  </th>
                  <th className="bg-slate-50 px-4 py-3 text-left dark:bg-gray-900/80 dark:text-slate-100">
                    Fecha
                  </th>
                  <th className="bg-slate-50 px-4 py-3 text-left dark:bg-gray-900/80 dark:text-slate-100">
                    Hora
                  </th>
                  <th className="bg-slate-50 px-4 py-3 text-left dark:bg-gray-900/80 dark:text-slate-100">
                    Tiempo restante
                  </th>
                  <th className="rounded-tr-2xl bg-slate-50 px-4 py-3 text-right dark:bg-gray-900/80 dark:text-slate-100">
                    Acción
                  </th>
                </tr>
              </thead>
              <tbody>
                {status === 'success' &&
                  filteredEvents.map((event, idx) => (
                    <EventTableRow
                      key={event.id}
                      event={event}
                      bandId={params.bandId}
                      refetch={refetch}
                      rowClassName={`transition-colors duration-150 ${
                        idx % 2 === 0
                          ? 'bg-white dark:bg-black/60'
                          : 'bg-slate-50 dark:bg-gray-900/60'
                      } hover:bg-brand-purple-50/60 hover:dark:bg-purple-900/40 border-b border-slate-100 dark:border-purple-900`}
                    />
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* Estado vacío o sin resultados */
        <div className="flex flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-brand-pink-50/50 to-brand-purple-50/50 py-16 dark:bg-gradient-to-br dark:from-black/80 dark:to-purple-950/80">
          <div className="mb-4 text-6xl opacity-50">
            {searchTerm || eventStatusFilter !== 'all' ? '🔍' : '📅'}
          </div>
          <h3 className="mb-2 text-lg font-semibold text-slate-700 dark:text-slate-100">
            {searchTerm || eventStatusFilter !== 'all'
              ? 'No se encontraron eventos'
              : 'No hay eventos registrados'}
          </h3>
          <p className="mb-4 text-sm text-slate-500 dark:text-slate-300">
            {searchTerm || eventStatusFilter !== 'all'
              ? 'Intenta con otros términos de búsqueda o filtros'
              : 'Crea tu primer evento para comenzar'}
          </p>
          {!searchTerm && eventStatusFilter === 'all' && (
            <AddEventButton bandId={params.bandId} />
          )}
        </div>
      )}
    </UIGuard>
  );
};
