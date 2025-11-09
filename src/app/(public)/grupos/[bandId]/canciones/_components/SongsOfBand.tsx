'use client';

import { useEffect } from 'react';
import { $PlayList } from '@stores/player';
import { UIGuard } from '@global/utils/UIGuard';
import { BackwardIcon } from '@global/icons/BackwardIcon';
import { getSongsOfBand } from '../_services/songsOfBandService';
import { SongOfBandCard } from './SongOfBandCard';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';

export const SongsOfBand = ({ params }: { params: { bandId: string } }) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data, isLoading, status, refetch } = getSongsOfBand({
    bandId: params.bandId,
  });

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
  const worshipSongs =
    data
      ?.filter((song) => song.songType === 'worship')
      .sort((a, b) => a.title.localeCompare(b.title)) || [];
  const praiseSongs =
    data
      ?.filter((song) => song.songType === 'praise')
      .sort((a, b) => a.title.localeCompare(b.title)) || [];

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
                {data?.length || 0} canciones en total
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Sección de Adoración */}
      {worshipSongs.length > 0 && (
        <div className="mb-6 rounded-2xl bg-white/80 p-6 shadow-lg ring-1 ring-slate-200/50 backdrop-blur-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-teal-400 to-cyan-500 shadow-lg">
              <span className="text-2xl">🙏</span>
            </div>
            <div>
              <h2 className="bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-xl font-bold text-transparent sm:text-2xl">
                Adoración
              </h2>
              <p className="text-sm text-slate-500">
                {worshipSongs.length} canciones
              </p>
            </div>
          </div>
          <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {status === 'success' &&
              worshipSongs.map((song) => (
                <SongOfBandCard
                  key={song.id}
                  song={song}
                  bandId={params.bandId}
                  refetch={refetch}
                />
              ))}
          </section>
        </div>
      )}

      {/* Sección de Alabanza */}
      {praiseSongs.length > 0 && (
        <div className="mb-6 rounded-2xl bg-white/80 p-6 shadow-lg ring-1 ring-slate-200/50 backdrop-blur-sm">
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-amber-500 shadow-lg">
              <span className="text-2xl">🎉</span>
            </div>
            <div>
              <h2 className="bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-xl font-bold text-transparent sm:text-2xl">
                Alabanza
              </h2>
              <p className="text-sm text-slate-500">
                {praiseSongs.length} canciones
              </p>
            </div>
          </div>
          <section className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {status === 'success' &&
              praiseSongs.map((song) => (
                <SongOfBandCard
                  key={song.id}
                  song={song}
                  bandId={params.bandId}
                  refetch={refetch}
                />
              ))}
          </section>
        </div>
      )}

      {/* Estado vacío */}
      {status === 'success' && data?.length === 0 && (
        <div className="flex flex-col items-center justify-center rounded-2xl bg-gradient-to-br from-brand-purple-50/50 to-brand-blue-50/50 py-16">
          <div className="mb-4 text-6xl opacity-50">🎵</div>
          <h3 className="mb-2 text-lg font-semibold text-slate-700">
            No hay canciones aún
          </h3>
          <p className="text-sm text-slate-500">
            Comienza agregando canciones al repertorio
          </p>
        </div>
      )}
    </UIGuard>
  );
};
