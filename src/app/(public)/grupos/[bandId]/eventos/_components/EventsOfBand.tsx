'use client';

import { UIGuard } from '@global/utils/UIGuard';
import { getEventsOfBand } from '../_services/eventsOfBandService';
import { EventTableRow } from './EventTableRow';
import { AddEventButton } from '@bands/_components/AddEventButton';
import { useListFilter } from '@global/hooks/useListFilter';
import { useBackNavigation } from '@global/hooks/useBackNavigation';
import { useEventsFilter } from '../_hooks/useEventsFilter';
import { ListHeader } from '@global/components/ListHeader';
import { SearchAndFilter } from '@global/components/SearchAndFilter';
import { EmptyState } from '@global/components/EmptyState';

export const EventsOfBand = ({ params }: { params: { bandId: string } }) => {
  const { data, isLoading, status, refetch } = getEventsOfBand({
    bandId: params.bandId,
  });

  const { statusFilter, setStatusFilter, filterPredicate, sortComparator } =
    useEventsFilter();


  const { searchTerm, setSearchTerm, filteredData } = useListFilter({
    data,
    searchFields: (event) => [event.title],
    filterPredicate,
    sortComparator,
  });

  const { handleBack } = useBackNavigation({
    bandId: params.bandId,
    targetPath: `/grupos/${params.bandId}`,
  });

  const filterButtons = (
    <>
      <button
        onClick={() => setStatusFilter('all')}
        className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-200 ${statusFilter === 'all'
          ? 'bg-gradient-to-r from-brand-pink-600 to-brand-purple-600 text-white shadow-sm dark:from-brand-pink-500 dark:to-brand-purple-700'
          : 'border-2 border-slate-200 bg-white/80 text-slate-600 hover:border-brand-pink-300 hover:bg-slate-50 dark:border-purple-800 dark:bg-gray-900/80 dark:text-slate-100 dark:hover:bg-purple-900/60'
          }`}
      >
        Todos
      </button>
      <button
        onClick={() => setStatusFilter('upcoming')}
        className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-200 ${statusFilter === 'upcoming'
          ? 'bg-gradient-to-r from-brand-pink-600 to-brand-purple-600 text-white shadow-sm dark:from-brand-pink-500 dark:to-brand-purple-700'
          : 'border-2 border-slate-200 bg-white/80 text-slate-600 hover:border-brand-pink-300 hover:bg-slate-50 dark:border-purple-800 dark:bg-gray-900/80 dark:text-slate-100 dark:hover:bg-purple-900/60'
          }`}
      >
        🎯 Próximos
      </button>
      <button
        onClick={() => setStatusFilter('past')}
        className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-200 ${statusFilter === 'past'
          ? 'bg-gradient-to-r from-brand-pink-600 to-brand-purple-600 text-white shadow-sm dark:from-brand-pink-500 dark:to-brand-purple-700'
          : 'border-2 border-slate-200 bg-white/80 text-slate-600 hover:border-brand-pink-300 hover:bg-slate-50 dark:border-purple-800 dark:bg-gray-900/80 dark:text-slate-100 dark:hover:bg-purple-900/60'
          }`}
      >
        ✓ Pasados
      </button>
    </>
  );

  return (
    <UIGuard
      isLoggedIn={true}
      checkBandId={Number(params.bandId)}
      isLoading={isLoading}
    >
      <div className="mb-6 rounded-2xl bg-gradient-to-br from-brand-pink-50 via-white to-brand-purple-50 p-6 shadow-lg backdrop-blur-sm dark:border dark:border-purple-800 dark:bg-gradient-to-br dark:from-black dark:via-gray-900 dark:to-purple-950">
        <div className="flex flex-col gap-4">
          <ListHeader
            title="Calendario de Eventos"
            subtitle={`${filteredData?.length || 0} de ${data?.length || 0} eventos`}
            onBack={handleBack}
            actionButton={<AddEventButton bandId={params.bandId} />}
            gradientFrom="from-brand-pink-500"
            gradientTo="to-brand-purple-600"
          />

          <SearchAndFilter
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="Buscar eventos por título..."
            filterButtons={filterButtons}
          />

          <div className="sm:hidden">
            <AddEventButton bandId={params.bandId} />
          </div>
        </div>
      </div>

      {filteredData && filteredData.length > 0 ? (
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
                  filteredData.map((event, idx) => (
                    <EventTableRow
                      key={event.id}
                      event={event}
                      bandId={params.bandId}
                      refetch={refetch}
                      rowClassName={`transition-colors duration-150 ${idx % 2 === 0
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
        <EmptyState
          icon={searchTerm || statusFilter !== 'all' ? '🔍' : '📅'}
          title={
            searchTerm || statusFilter !== 'all'
              ? 'No se encontraron eventos'
              : 'No hay eventos registrados'
          }
          description={
            searchTerm || statusFilter !== 'all'
              ? 'Intenta con otros términos de búsqueda o filtros'
              : 'Crea tu primer evento para comenzar'
          }
          actionButton={
            !searchTerm && statusFilter === 'all' ? (
              <AddEventButton bandId={params.bandId} />
            ) : undefined
          }
        />
      )}
    </UIGuard>
  );
};
