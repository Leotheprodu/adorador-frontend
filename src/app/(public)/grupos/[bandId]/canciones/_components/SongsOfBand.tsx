'use client';

import { UIGuard } from '@global/utils/UIGuard';
import { getSongsOfBand } from '../_services/songsOfBandService';
import { SongTableRow } from './SongTableRow';
import { AddSongButton } from './AddSongButton';
import { useListFilter } from '@global/hooks/useListFilter';
import { useBackNavigation } from '@global/hooks/useBackNavigation';
import { useSongsFilter } from '../_hooks/useSongsFilter';
import { ListHeader } from '@global/components/ListHeader';
import { SearchAndFilter } from '@global/components/SearchAndFilter';
import { EmptyState } from '@global/components/EmptyState';
import { useBandSongsWebSocket } from '@global/hooks/useBandSongsWebSocket';

export const SongsOfBand = ({ params }: { params: { bandId: string } }) => {
  const { data, isLoading, status, refetch } = getSongsOfBand({
    bandId: params.bandId,
  });

  // WebSocket for real-time updates
  useBandSongsWebSocket({
    bandId: parseInt(params.bandId),
    enabled: true,
  });

  const {
    typeFilter,
    setTypeFilter,
    filterPredicate,
    sortComparator,
    getSearchFields,
  } = useSongsFilter(data);

  const { searchTerm, setSearchTerm, filteredData } = useListFilter({
    data,
    searchFields: getSearchFields,
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
        onClick={() => setTypeFilter('all')}
        className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-200 ${
          typeFilter === 'all'
            ? 'bg-gradient-to-r from-brand-purple-600 to-brand-blue-600 text-white shadow-sm dark:from-brand-purple-400 dark:to-brand-blue-400'
            : 'border-2 border-slate-200 bg-white/80 text-slate-600 hover:border-brand-purple-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-gray-900 dark:text-slate-200 dark:hover:border-brand-purple-400 dark:hover:bg-gray-800'
        }`}
      >
        Todas
      </button>
      <button
        onClick={() => setTypeFilter('worship')}
        className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-200 ${
          typeFilter === 'worship'
            ? 'bg-gradient-to-r from-brand-purple-600 to-brand-blue-600 text-white shadow-sm dark:from-brand-purple-400 dark:to-brand-blue-400'
            : 'border-2 border-slate-200 bg-white/80 text-slate-600 hover:border-brand-purple-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-gray-900 dark:text-slate-200 dark:hover:border-brand-purple-400 dark:hover:bg-gray-800'
        }`}
      >
        🙏 Adoración
      </button>
      <button
        onClick={() => setTypeFilter('praise')}
        className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-200 ${
          typeFilter === 'praise'
            ? 'bg-gradient-to-r from-brand-purple-600 to-brand-blue-600 text-white shadow-sm dark:from-brand-purple-400 dark:to-brand-blue-400'
            : 'border-2 border-slate-200 bg-white/80 text-slate-600 hover:border-brand-purple-300 hover:bg-slate-50 dark:border-slate-700 dark:bg-gray-900 dark:text-slate-200 dark:hover:border-brand-purple-400 dark:hover:bg-gray-800'
        }`}
      >
        🎉 Alabanza
      </button>
    </>
  );

  return (
    <UIGuard
      isLoggedIn={true}
      checkBandId={Number(params.bandId)}
      isLoading={isLoading}
    >
      <div className="mb-6 rounded-2xl bg-gradient-to-br from-brand-purple-50 via-white to-brand-blue-50 p-6 shadow-lg backdrop-blur-sm dark:bg-gray-900 dark:bg-none dark:shadow-none">
        <div className="flex flex-col gap-4">
          <ListHeader
            title="Repertorio Musical"
            subtitle={`${filteredData?.length || 0} de ${data?.length || 0} canciones`}
            onBack={handleBack}
            actionButton={<AddSongButton bandId={params.bandId} />}
            gradientFrom="from-brand-purple-600"
            gradientTo="to-brand-blue-600"
          />

          <SearchAndFilter
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            searchPlaceholder="Buscar por título, artista, tonalidad o tipo..."
            filterButtons={filterButtons}
          />

          <div className="sm:hidden">
            <AddSongButton bandId={params.bandId} />
          </div>
        </div>
      </div>

      {filteredData && filteredData.length > 0 ? (
        <div className="mb-6 overflow-hidden rounded-2xl bg-white/80 shadow-lg ring-1 ring-slate-200/50 backdrop-blur-sm dark:bg-gray-950 dark:shadow-none dark:ring-slate-800">
          <div className="max-w-full overflow-x-auto">
            <table className="w-full min-w-full">
              <thead className="hidden border-b border-slate-200 bg-slate-50/50 text-xs font-semibold uppercase tracking-wider text-slate-600 dark:border-slate-800 dark:bg-gray-900 dark:text-slate-300 sm:table-header-group">
                <tr>
                  <th className="px-4 py-3 text-left">Título</th>
                  <th className="px-4 py-3 text-left">Artista</th>
                  <th className="px-4 py-3 text-left">Tonalidad</th>
                  <th className="px-4 py-3 text-left">Tipo</th>
                  <th className="px-4 py-3 text-center">Eventos</th>
                  <th className="px-4 py-3 text-left">Letra</th>
                  <th className="px-4 py-3 text-left">Video Lyrics</th>
                  <th className="px-4 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {status === 'success' &&
                  filteredData.map((song) => (
                    <SongTableRow
                      key={song.id}
                      song={song}
                      bandId={params.bandId}
                      refetch={refetch}
                    />
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <EmptyState
          icon={searchTerm || typeFilter !== 'all' ? '🔍' : '🎵'}
          title={
            searchTerm || typeFilter !== 'all'
              ? 'No se encontraron canciones'
              : 'No hay canciones aún'
          }
          description={
            searchTerm || typeFilter !== 'all'
              ? 'Intenta con otros términos de búsqueda o filtros'
              : 'Comienza agregando canciones al repertorio'
          }
          actionButton={
            !searchTerm && typeFilter === 'all' ? (
              <AddSongButton bandId={params.bandId} />
            ) : undefined
          }
        />
      )}
    </UIGuard>
  );
};
