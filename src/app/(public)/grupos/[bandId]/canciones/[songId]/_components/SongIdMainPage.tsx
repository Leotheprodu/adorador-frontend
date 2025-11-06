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
import { $chordPreferences } from '@stores/event';
import { LyricsProps } from '@bands/[bandId]/eventos/_interfaces/eventsInterface';
import { LyricsGroupedCard } from './LyricsGroupedCard';
import { BackwardIcon } from '@global/icons/BackwardIcon';
import { handleBackNavigation } from '@global/utils/navigationUtils';
import { StoredLyricsAlert } from './StoredLyricsAlert';
import { EditLyricsOptions } from './EditLyricsOptions';

export const SongIdMainPage = ({
  params,
}: {
  params: { bandId: string; songId: string };
}) => {
  const [lyricsSorted, setLyricsSorted] = useState<LyricsProps[]>([]);
  const [lyricsGrouped, setLyricsGrouped] = useState<[string, LyricsProps[]][]>(
    [],
  );

  const chordPreferences = useStore($chordPreferences);
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

        <section className="mb-10">
          <div className="mb-6 flex items-center gap-2">
            <button
              onClick={handleBackToSongs}
              className="group flex items-center justify-center gap-2 transition-all duration-150 hover:cursor-pointer hover:text-primary-500"
            >
              <BackwardIcon />
              <small className="hidden group-hover:block">
                Volver a canciones
              </small>
            </button>
            <h1 className="text-xl font-bold">Detalles de canción</h1>
          </div>
          <SongBasicInfo
            bandId={params.bandId}
            songId={params.songId}
            data={data}
            status={status}
            refetch={refetch}
          />
        </section>
        <section>
          <div className="relative flex w-screen flex-col items-center gap-4 overflow-x-auto px-4 xl:flex-row xl:items-start xl:px-10">
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
