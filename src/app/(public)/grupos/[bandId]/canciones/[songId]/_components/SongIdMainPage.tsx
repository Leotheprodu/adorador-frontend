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
import { handleBackNavigation } from '@global/utils/navigationUtils';
import { StoredLyricsAlert } from './StoredLyricsAlert';
import { EditLyricsOptions } from './EditLyricsOptions';
import { SongViewControls } from './SongViewControls';

export const SongIdMainPage = ({
  params,
}: {
  params: { bandId: string; songId: string };
}) => {
  const [lyricsSorted, setLyricsSorted] = useState<LyricsProps[]>([]);
  const [lyricsGrouped, setLyricsGrouped] = useState<[string, LyricsProps[]][]>(
    [],
  );

  // Transpose específico de esta canción
  const [transpose, setTranspose] = useState(0);

  const chordPreferences = useStore($chordPreferences);
  const eventConfig = useStore($eventConfig);

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
    handleBackNavigation(`/grupos/${params.bandId}/canciones`);
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
              className="group flex items-center justify-center gap-2 rounded-xl bg-gradient-to-br from-slate-100 to-slate-200 px-4 py-2 transition-all duration-200 hover:scale-105 hover:from-brand-purple-100 hover:to-brand-pink-100 hover:shadow-md active:scale-95"
            >
              <BackwardIcon className="h-4 w-4 text-brand-purple-600" />
              <small className="font-semibold text-brand-purple-600">
                Volver a canciones
              </small>
            </button>
            <h1 className="text-2xl font-bold text-slate-800">
              🎵 Detalles de canción
            </h1>
          </div>
          <SongBasicInfo
            bandId={params.bandId}
            songId={params.songId}
            data={data}
            status={status}
            refetch={refetch}
          />
        </section>

        {/* Controls Section - Only show when lyrics exist */}
        {LyricsOfCurrentSong && LyricsOfCurrentSong.length > 0 && (
          <section className="mb-6 w-full px-4">
            <SongViewControls songId={params.songId} />
          </section>
        )}

        {/* Lyrics Section - Vertical Layout */}
        <section className="w-full px-4">
          <div className="mx-auto flex max-w-4xl flex-col gap-6">
            {LyricsOfCurrentSong && LyricsOfCurrentSong.length > 0 ? (
              <>
                {lyricsGrouped?.map(([structure, lyrics], groupIndex) => (
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
                  />
                ))}
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

        {/* Edit/Replace Lyrics Options - Available even when lyrics exist */}
        {LyricsOfCurrentSong && LyricsOfCurrentSong.length > 0 && (
          <section className="mt-8 flex w-full justify-center px-4">
            <EditLyricsOptions
              params={params}
              songTitle={data?.title}
              refetchLyricsOfCurrentSong={refetchLyricsOfCurrentSong}
              mutateUploadLyricsByFile={mutateUploadLyricsByFile}
              existingLyrics={LyricsOfCurrentSong}
            />
          </section>
        )}
      </div>
    </UIGuard>
  );
};
