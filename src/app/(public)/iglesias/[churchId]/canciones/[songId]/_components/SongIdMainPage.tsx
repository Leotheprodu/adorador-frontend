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
import { LyricsCard } from './LyricsCard';
import { AddNewLyricForm } from './AddNewLyricForm';
import { AddSongIcon } from '@global/icons/AddSongIcon';
import { useStore } from '@nanostores/react';
import { $chordPreferences } from '@stores/event';
import { LyricsProps } from '@iglesias/[churchId]/eventos/_interfaces/eventsInterface';
import { structureLib } from '@global/config/constants';

export const SongIdMainPage = ({
  params,
}: {
  params: { churchId: string; songId: string };
}) => {
  const [lyricsGrouped, setLyricsGrouped] = useState<[string, LyricsProps[]][]>(
    [],
  );
  const structureColors: { [key: string]: string } = {
    intro: '#CCFFDD', // slightly darker green
    verse: '#FFE6E6', // light red
    'pre-chorus': '#FFE6F2', // light pink
    chorus: '#FFEED6', // light orange
    bridge: '#FFFFE6', // light yellow
    outro: '#E6F2FF', // light blue
    preChorus: '#F2E6FF', // light purple
    interlude: '#FFE6FF', // light magenta
    solo: '#B3FFB3', // darker lime
    // Add more structures and colors as needed
  };

  const chordPreferences = useStore($chordPreferences);
  const { data, isLoading, status } = getSongData({ params });
  const { data: LyricsOfCurrentSong, refetch: refetchLyricsOfCurrentSong } =
    getSongLyrics({ params });
  const { mutate: mutateUploadLyricsByFile, status: statusUploadLyricsByFile } =
    uploadSongLyrics({ params });
  const [addNewLyric, setAddNewLyric] = useState(false);
  useEffect(() => {
    if (statusUploadLyricsByFile === 'success') {
      refetchLyricsOfCurrentSong();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusUploadLyricsByFile]);
  useEffect(() => {
    if (!LyricsOfCurrentSong) return;
    const array =
      LyricsOfCurrentSong.sort((a, b) => a.position - b.position).reduce(
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
  }, [LyricsOfCurrentSong]);

  return (
    <UIGuard
      isLoggedIn
      checkChurchId={parseInt(params.churchId)}
      isLoading={isLoading}
    >
      <section>
        <SongBasicInfo churchId={params.churchId} data={data} status={status} />
      </section>
      <section>
        <div className="relative flex w-full flex-col">
          {LyricsOfCurrentSong && LyricsOfCurrentSong.length > 0 ? (
            <>
              {lyricsGrouped?.map(([structure, lyrics], groupIndex) => (
                <div
                  style={{
                    backgroundColor: structureColors[structure],
                  }}
                  className="my-5 rounded-lg p-4"
                  key={groupIndex}
                >
                  <h2 className="text-center text-lg text-slate-600">
                    {structureLib[structure].es}
                  </h2>
                  {lyrics.map((lyric) => (
                    <LyricsCard
                      key={lyric.id}
                      lyric={lyric}
                      refetchLyricsOfCurrentSong={refetchLyricsOfCurrentSong}
                      params={params}
                      chordPreferences={chordPreferences}
                    />
                  ))}
                </div>
              ))}

              <div className="mt-5">
                {addNewLyric ? (
                  <AddNewLyricForm
                    LyricsOfCurrentSong={LyricsOfCurrentSong}
                    params={params}
                    refetchLyricsOfCurrentSong={refetchLyricsOfCurrentSong}
                    setAddNewLyric={setAddNewLyric}
                  />
                ) : (
                  <button
                    onClick={() => setAddNewLyric(true)}
                    className="flex items-center gap-2 border-primary-500 duration-200 hover:scale-105 hover:border-b-1"
                  >
                    <AddSongIcon /> Agregar Letra
                  </button>
                )}
              </div>
            </>
          ) : (
            <NoLyricsSong
              mutateUploadLyricsByFile={mutateUploadLyricsByFile}
              refetchLyricsOfCurrentSong={refetchLyricsOfCurrentSong}
              LyricsOfCurrentSong={LyricsOfCurrentSong ?? []}
              params={params}
            />
          )}
        </div>
      </section>
    </UIGuard>
  );
};
