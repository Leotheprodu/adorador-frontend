'use client';
import { UIGuard } from '@global/utils/UIGuard';
import {
  getSongData,
  getSongLyrics,
  uploadSongLyrics,
} from '../_services/songIdServices';
import { SongBasicInfo } from './SongBasicInfo';
import { useEffect, useState } from 'react';
import { NoLyricsSong } from './NoLyricsSong';
import { useStore } from '@nanostores/react';
import { $chordPreferences, $eventConfig } from '@stores/event';
import { LyricsProps } from '@bands/[bandId]/eventos/_interfaces/eventsInterface';
import { LyricsGroupedCard } from './LyricsGroupedCard';
import { BackwardIcon } from '@global/icons/BackwardIcon';
import { StoredLyricsAlert } from './StoredLyricsAlert';
import { EditLyricsOptions } from './EditLyricsOptions';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { hasTempLyrics } from '../_utils/lyricsStorage';

export const SongIdMainPage = ({
  params,
}: {
  params: { bandId: string; songId: string };
}) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const [lyricsSorted, setLyricsSorted] = useState<LyricsProps[]>([]);
  const [lyricsGrouped, setLyricsGrouped] = useState<[string, LyricsProps[]][]>(
    [],
  );
  const [isEditMode, setIsEditMode] = useState(false);
  const [isPracticeMode, setIsPracticeMode] = useState(true); // Por defecto en modo práctica

  // Transpose específico de esta canción
  const [transpose, setTranspose] = useState(0);

  const chordPreferences = useStore($chordPreferences);
  const eventConfig = useStore($eventConfig);

  // Detectar si hay letra guardada en localStorage y activar modo edición automáticamente
  useEffect(() => {
    // Solo al montar el componente, verificar si hay letra guardada
    const hasStored = hasTempLyrics(params.bandId, params.songId);
    if (hasStored) {
      setIsEditMode(true);
      setIsPracticeMode(false); // Cambiar a modo edición si hay letra guardada
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.bandId, params.songId]);

  // Escuchar cambios en el storage (cuando se elimina la letra guardada)
  useEffect(() => {
    const handleLyricsStorageChange = () => {
      const hasStored = hasTempLyrics(params.bandId, params.songId);
      // Solo salir del modo edición si se eliminó la letra guardada
      if (!hasStored && isEditMode) {
        setIsEditMode(false);
        setIsPracticeMode(true); // Volver a modo práctica cuando se elimina la letra guardada
      }
    };

    window.addEventListener('lyricsStorageChange', handleLyricsStorageChange);
    window.addEventListener('storage', handleLyricsStorageChange);

    return () => {
      window.removeEventListener(
        'lyricsStorageChange',
        handleLyricsStorageChange,
      );
      window.removeEventListener('storage', handleLyricsStorageChange);
    };
  }, [params.bandId, params.songId, isEditMode]);

  // Cargar transposición específica de esta canción
  useEffect(() => {
    const storageKey = `songTranspose_${params.songId}`;
    const loadTranspose = () => {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        setTranspose(parseInt(stored));
      } else {
        setTranspose(0);
      }
    };

    loadTranspose();

    // Listener para cambios en localStorage (desde otro componente)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === storageKey) {
        loadTranspose();
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Polling interval para detectar cambios locales
    const interval = setInterval(loadTranspose, 500);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(interval);
    };
  }, [params.songId]);
  const { data, isLoading, status, refetch } = getSongData({ params });
  const {
    data: LyricsOfCurrentSong,
    refetch: refetchLyricsOfCurrentSong,
    status: statusOfLyricsOfCurrentSong,
  } = getSongLyrics({ params });

  // Refetch cuando cambie el songId
  useEffect(() => {
    refetch();
    refetchLyricsOfCurrentSong();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [params.songId]);

  useEffect(() => {
    if (LyricsOfCurrentSong && statusOfLyricsOfCurrentSong === 'success') {
      setLyricsSorted(
        LyricsOfCurrentSong.sort((a, b) => a.position - b.position),
      );
    }
  }, [LyricsOfCurrentSong, statusOfLyricsOfCurrentSong]);

  const { mutate: mutateUploadLyricsByFile, status: statusUploadLyricsByFile } =
    uploadSongLyrics({ params });
  useEffect(() => {
    if (statusUploadLyricsByFile === 'success') {
      refetchLyricsOfCurrentSong();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusUploadLyricsByFile]);
  useEffect(() => {
    if (!lyricsSorted) return;
    const array =
      lyricsSorted.reduce(
        (acc, lyric) => {
          const lastGroup = acc[acc.length - 1];
          if (lastGroup && lastGroup[0] === lyric.structure.title) {
            lastGroup[1].push(lyric);
          } else {
            acc.push([lyric.structure.title, [lyric]]);
          }
          return acc;
        },
        [] as [string, LyricsProps[]][],
      ) || [];

    setLyricsGrouped(array);
  }, [lyricsSorted]);

  const handleBackToSongs = () => {
    // Invalidar queries relacionadas con canciones para que se actualicen los datos
    queryClient.invalidateQueries({ queryKey: ['SongsOfBand', params.bandId] });
    // También invalidar BandById para que se actualice la vista del grupo
    queryClient.invalidateQueries({ queryKey: ['BandById', params.bandId] });
    // Usar router de Next.js para navegación sin recargar la página
    router.push(`/grupos/${params.bandId}/canciones`);
  };

  return (
    <UIGuard
      isLoggedIn
      checkBandId={parseInt(params.bandId)}
      isLoading={isLoading}
    >
      <div className="flex flex-col items-center overflow-hidden">
        {/* Alert for stored lyrics */}
        <StoredLyricsAlert />

        {/* Header Section */}
        <section className="mb-6 w-full max-w-4xl px-4">
          <div className="mb-4 flex items-center gap-3">
            <button
              onClick={handleBackToSongs}
              className="group flex items-center justify-center gap-2 rounded-xl bg-white/80 p-3 shadow-sm transition-all duration-200 hover:scale-105 hover:bg-brand-purple-50 hover:shadow-md active:scale-95"
            >
              <BackwardIcon />
              <small className="hidden text-xs font-medium text-brand-purple-700 sm:group-hover:block">
                Volver a canciones
              </small>
            </button>
            <h1 className="bg-gradient-to-r from-brand-purple-600 to-brand-blue-600 bg-clip-text text-2xl font-bold text-transparent sm:text-3xl">
              Detalles de Canción
            </h1>
          </div>
          <SongBasicInfo
            bandId={params.bandId}
            songId={params.songId}
            data={data}
            status={status}
            refetch={refetch}
            lyrics={LyricsOfCurrentSong}
            refetchLyricsOfCurrentSong={refetchLyricsOfCurrentSong}
            onEditModeChange={setIsEditMode}
            isEditMode={isEditMode}
            isPracticeMode={isPracticeMode}
            onPracticeModeChange={setIsPracticeMode}
          />
        </section>

        {/* Lyrics Section - Vertical Layout */}
        <section className="px-4">
          <div className="mx-auto flex max-w-4xl flex-col gap-6">
            {LyricsOfCurrentSong && LyricsOfCurrentSong.length > 0 ? (
              <>
                {/* Show editor if in edit mode, otherwise show lyrics */}
                {isEditMode ? (
                  <EditLyricsOptions
                    params={params}
                    songTitle={data?.title}
                    refetchLyricsOfCurrentSong={refetchLyricsOfCurrentSong}
                    mutateUploadLyricsByFile={mutateUploadLyricsByFile}
                    existingLyrics={LyricsOfCurrentSong}
                    isExpanded={true}
                    onClose={() => setIsEditMode(false)}
                  />
                ) : (
                  lyricsGrouped?.map(([structure, lyrics], groupIndex) => (
                    <LyricsGroupedCard
                      key={groupIndex}
                      structure={structure}
                      lyrics={lyrics}
                      refetchLyricsOfCurrentSong={refetchLyricsOfCurrentSong}
                      params={params}
                      chordPreferences={chordPreferences}
                      lyricsOfCurrentSong={LyricsOfCurrentSong}
                      transpose={transpose}
                      showChords={eventConfig.showChords}
                      lyricsScale={eventConfig.lyricsScale}
                      isPracticeMode={isPracticeMode}
                    />
                  ))
                )}
              </>
            ) : (
              <NoLyricsSong
                mutateUploadLyricsByFile={mutateUploadLyricsByFile}
                refetchLyricsOfCurrentSong={refetchLyricsOfCurrentSong}
                LyricsOfCurrentSong={LyricsOfCurrentSong ?? []}
                params={params}
                songTitle={data?.title}
              />
            )}
          </div>
        </section>
      </div>
    </UIGuard>
  );
};
