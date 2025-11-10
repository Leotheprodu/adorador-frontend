'use client';

import { useEffect, useState } from 'react';
import { $PlayList } from '@stores/player';
import { UIGuard } from '@global/utils/UIGuard';
import { BackwardIcon } from '@global/icons/BackwardIcon';
import { SearchIcon } from '@global/icons';
import { getSongsOfBand } from '../_services/songsOfBandService';
import { SongTableRow } from './SongTableRow';
import { AddSongButton } from './AddSongButton';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { songTypes } from '@global/config/constants';

export const SongsOfBand = ({ params }: { params: { bandId: string } }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data, isLoading, status, refetch } = getSongsOfBand({
    bandId: params.bandId,
  });

  const [searchTerm, setSearchTerm] = useState('');
  const [songTypeFilter, setSongTypeFilter] = useState<
    'all' | 'worship' | 'praise'
  >('all');
  const [filteredSongs, setFilteredSongs] = useState(data);

  // Function to normalize text (remove accents and convert to lowercase)
  const normalizeText = (text: string) => {
    return text
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '');
  };

  useEffect(() => {
    const songsWithYoutubeLink = data?.filter((song) => song.youtubeLink);

    if (songsWithYoutubeLink && songsWithYoutubeLink.length > 0) {
      const songsToPlaylists = songsWithYoutubeLink.map((song) => ({
        id: song.id,
        youtubeLink: song.youtubeLink,
        name: song.title,
      }));
      $PlayList.set(
        songsToPlaylists.sort((a, b) => a.name.localeCompare(b.name)),
      );
    }
  }, [data]);

  // Filter and search logic
  useEffect(() => {
    let filtered = data;

    // Apply search filter
    if (searchTerm !== '') {
      const normalizedSearch = normalizeText(searchTerm);
      filtered = filtered?.filter(
        (song) =>
          normalizeText(song.title).includes(normalizedSearch) ||
          normalizeText(song.artist || '').includes(normalizedSearch) ||
          normalizeText(song.key || '').includes(normalizedSearch) ||
          normalizeText(songTypes[song.songType].es || '').includes(
            normalizedSearch,
          ),
      );
    }

    // Apply song type filter
    if (songTypeFilter !== 'all') {
      filtered = filtered?.filter((song) => song.songType === songTypeFilter);
    }

    // Sort alphabetically by title
    filtered = filtered?.sort((a, b) =>
      a.title.toLowerCase().localeCompare(b.title.toLowerCase()),
    );

    setFilteredSongs(filtered);
  }, [searchTerm, songTypeFilter, data]);

  const handleBackToGroup = () => {
    // Invalidar query del grupo para que se actualice con nuevas canciones
    queryClient.invalidateQueries({ queryKey: ['BandById', params.bandId] });
    // Usar router de Next.js para navegación sin recargar la página
    router.push(`/grupos/${params.bandId}`);
  };

  return (
    <UIGuard
      isLoggedIn={true}
      checkBandId={Number(params.bandId)}
      isLoading={isLoading}
    >
      {/* Header mejorado con gradiente */}
      <div className="mb-6 rounded-2xl bg-gradient-to-br from-brand-purple-50 via-white to-brand-blue-50 p-6 shadow-lg backdrop-blur-sm">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={handleBackToGroup}
                className="group flex items-center justify-center gap-2 rounded-xl bg-white/80 p-3 shadow-sm transition-all duration-200 hover:scale-105 hover:bg-brand-purple-50 hover:shadow-md active:scale-95"
              >
                <BackwardIcon />
                <small className="hidden text-xs font-medium text-brand-purple-700 sm:group-hover:block">
                  Volver al grupo
                </small>
              </button>
              <div>
                <h1 className="bg-gradient-to-r from-brand-purple-600 to-brand-blue-600 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl">
                  Repertorio Musical
                </h1>
                <p className="mt-1 text-sm text-slate-500">
                  {filteredSongs?.length || 0} de {data?.length || 0} canciones
                </p>
              </div>
            </div>

            {/* Botón de crear canción - Desktop */}
            <div className="hidden sm:block">
              <AddSongButton bandId={params.bandId} />
            </div>
          </div>

          {/* Buscador y filtros */}
          <div className="flex flex-col gap-3 sm:flex-row">
            {/* Search input */}
            <div className="relative flex-1">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <SearchIcon className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar por título, artista, tonalidad o tipo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full rounded-lg border-2 border-slate-200 bg-white/80 py-2 pl-10 pr-4 text-sm transition-all duration-200 focus:border-brand-purple-600 focus:outline-none focus:ring-2 focus:ring-brand-purple-200"
              />
            </div>

            {/* Filter buttons */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSongTypeFilter('all')}
                className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-200 ${
                  songTypeFilter === 'all'
                    ? 'bg-gradient-to-r from-brand-purple-600 to-brand-blue-600 text-white shadow-sm'
                    : 'border-2 border-slate-200 bg-white/80 text-slate-600 hover:border-brand-purple-300 hover:bg-slate-50'
                }`}
              >
                Todas
              </button>
              <button
                onClick={() => setSongTypeFilter('worship')}
                className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-200 ${
                  songTypeFilter === 'worship'
                    ? 'bg-gradient-to-r from-brand-purple-600 to-brand-blue-600 text-white shadow-sm'
                    : 'border-2 border-slate-200 bg-white/80 text-slate-600 hover:border-brand-purple-300 hover:bg-slate-50'
                }`}
              >
                🙏 Adoración
              </button>
              <button
                onClick={() => setSongTypeFilter('praise')}
                className={`whitespace-nowrap rounded-lg px-3 py-2 text-xs font-semibold transition-all duration-200 ${
                  songTypeFilter === 'praise'
                    ? 'bg-gradient-to-r from-brand-purple-600 to-brand-blue-600 text-white shadow-sm'
                    : 'border-2 border-slate-200 bg-white/80 text-slate-600 hover:border-brand-purple-300 hover:bg-slate-50'
                }`}
              >
                🎉 Alabanza
              </button>
            </div>
          </div>

          {/* Botón de crear canción - Mobile */}
          <div className="sm:hidden">
            <AddSongButton bandId={params.bandId} />
          </div>
        </div>
      </div>

      {/* Tabla única de canciones */}
      {filteredSongs && filteredSongs.length > 0 ? (
        <div className="mb-6 overflow-hidden rounded-2xl bg-white/80 shadow-lg ring-1 ring-slate-200/50 backdrop-blur-sm">
          <div className="max-w-full overflow-x-auto">
            <table className="w-full min-w-full">
              <thead className="hidden border-b border-slate-200 bg-slate-50/50 text-xs font-semibold uppercase tracking-wider text-slate-600 sm:table-header-group">
                <tr>
                  <th className="px-4 py-3 text-left">Título</th>
                  <th className="px-4 py-3 text-left">Artista</th>
                  <th className="px-4 py-3 text-left">Tonalidad</th>
                  <th className="px-4 py-3 text-left">Tipo</th>
                  <th className="px-4 py-3 text-center">Eventos</th>
                  <th className="px-4 py-3 text-left">Letra</th>
                  <th className="px-4 py-3 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {status === 'success' &&
                  filteredSongs.map((song) => (
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
        /* Estado vacío o sin resultados */
        <div className="flex flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-brand-purple-50/50 to-brand-blue-50/50 py-16">
          <div className="mb-4 text-6xl opacity-50">
            {searchTerm || songTypeFilter !== 'all' ? '🔍' : '🎵'}
          </div>
          <h3 className="mb-2 text-lg font-semibold text-slate-700">
            {searchTerm || songTypeFilter !== 'all'
              ? 'No se encontraron canciones'
              : 'No hay canciones aún'}
          </h3>
          <p className="mb-4 text-sm text-slate-500">
            {searchTerm || songTypeFilter !== 'all'
              ? 'Intenta con otros términos de búsqueda o filtros'
              : 'Comienza agregando canciones al repertorio'}
          </p>
          {!searchTerm && songTypeFilter === 'all' && (
            <AddSongButton bandId={params.bandId} />
          )}
        </div>
      )}
    </UIGuard>
  );
};
