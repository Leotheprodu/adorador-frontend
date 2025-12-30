'use client';

import { OFFICIAL_BAND_ID } from '@global/config/constants';
import { getSongsOfBand } from '@/app/(public)/grupos/[bandId]/canciones/_services/songsOfBandService';
import { OfficialSongsSlider } from './OfficialSongsSlider';
import { SearchAndFilter } from '@global/components/SearchAndFilter';
import { useSongsFilter } from '@/app/(public)/grupos/[bandId]/canciones/_hooks/useSongsFilter';
import { useListFilter } from '@global/hooks/useListFilter';

export const OfficialSongsFeed = () => {
  const { data, isLoading } = getSongsOfBand({
    bandId: String(OFFICIAL_BAND_ID),
  });

  const {
    typeFilter,
    setTypeFilter,
    filterPredicate,
    sortComparator,
    getSearchFields,
  } = useSongsFilter(data, String(OFFICIAL_BAND_ID));

  const { searchTerm, setSearchTerm, filteredData } = useListFilter({
    data,
    searchFields: getSearchFields,
    filterPredicate,
    sortComparator,
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
    <section className="mb-12 overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-gray-200 dark:bg-gray-900 dark:ring-gray-800">
      <div className="border-b border-gray-200 bg-gray-50/50 p-6 dark:border-gray-800 dark:bg-gray-800/50">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              Canciones Recomendadas
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Selección oficial para tu repertorio
            </p>
          </div>

          <div className="flex-1 md:max-w-xl">
            <SearchAndFilter
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              searchPlaceholder="Buscar en canciones recomendadas..."
              filterButtons={filterButtons}
            />
          </div>
        </div>
      </div>

      <div className="p-6">
        <div className="flex flex-col gap-6">
          <OfficialSongsSlider songs={filteredData || []} />

          {(!filteredData || filteredData.length === 0) && !isLoading && (
            <div className="rounded-xl border border-dashed border-gray-300 p-12 text-center text-gray-500 dark:border-gray-700 dark:text-gray-400">
              <p className="text-lg font-medium">No se encontraron canciones</p>
              <p className="text-sm">
                Intenta con otros filtros o términos de búsqueda
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
