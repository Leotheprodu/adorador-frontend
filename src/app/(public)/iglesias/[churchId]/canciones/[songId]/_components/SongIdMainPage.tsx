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

export const SongIdMainPage = ({
  params,
}: {
  params: { churchId: string; songId: string };
}) => {
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
              {LyricsOfCurrentSong?.map((lyric) => (
                <LyricsCard
                  key={lyric.id}
                  lyric={lyric}
                  refetchLyricsOfCurrentSong={refetchLyricsOfCurrentSong}
                  params={params}
                  chordPreferences={chordPreferences}
                />
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
