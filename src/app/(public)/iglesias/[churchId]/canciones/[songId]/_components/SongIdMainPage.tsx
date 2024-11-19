'use client';

import { UIGuard } from '@global/utils/UIGuard';
import {
  getSongData,
  getSongLyrics,
  uploadSongLyrics,
} from '../_services/songIdServices';
import { SongBasicInfo } from './SongBasicInfo';
import { getNoteByType } from '@iglesias/[churchId]/eventos/[eventId]/_utils/getNoteByType';
import { useStore } from '@nanostores/react';
import { $chordPreferences } from '@stores/event';
import { useEffect } from 'react';

export const SongIdMainPage = ({
  params,
}: {
  params: { churchId: string; songId: string };
}) => {
  const { data, isLoading, status } = getSongData({ params });
  const { data: LyricsOfCurrentSong, refetch: refetchLyricsOfCurrentSong } =
    getSongLyrics({ params });
  const { mutate: mutateUploadLyricsByFile, status: statusUploadLyricsByFile } =
    uploadSongLyrics({ params });
  const chordPreferences = useStore($chordPreferences);

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
            LyricsOfCurrentSong?.map((lyric) => (
              <div key={lyric.id} className="flex flex-col">
                <div className="grid w-full grid-cols-5 grid-rows-1 gap-1">
                  {lyric.chords && lyric.chords.length > 0 ? (
                    lyric.chords
                      .sort((a, b) => a.position - b.position)
                      .map((chord) => (
                        <div
                          key={chord.id}
                          style={{
                            gridColumnStart: chord.position,
                            gridColumnEnd: chord.position + 1,
                          }}
                          className={`flex h-10 w-10 items-center justify-center gap-1`}
                        >
                          <div className="flex items-end justify-center">
                            <p className={`w-full text-center`}>
                              {getNoteByType(
                                chord.rootNote,
                                0,
                                chordPreferences,
                              )}
                            </p>
                            <p className={`w-full text-center text-slate-400`}>
                              {chord.chordQuality}
                            </p>
                          </div>
                          {chord.slashChord && (
                            <>
                              <p
                                className={`w-full text-center text-slate-600`}
                              >
                                /
                              </p>
                              <div className="flex items-end justify-center">
                                <p className={`w-full text-center`}>
                                  {getNoteByType(
                                    chord.slashChord,
                                    0,
                                    chordPreferences,
                                  )}
                                </p>
                                <p
                                  className={`w-full text-center text-slate-400`}
                                >
                                  {chord.slashQuality}
                                </p>
                              </div>
                            </>
                          )}
                        </div>
                      ))
                  ) : (
                    <div
                      className={`col-span-1 flex h-10 w-10 items-center justify-center gap-1`}
                    ></div>
                  )}
                </div>
                <h1 className={`w-full`}>{lyric.lyrics}</h1>
              </div>
            ))
          ) : (
            <div>
              <p>Esta canción aun no tiene letra</p>
              <input
                type="file"
                accept=".txt"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const formData = new FormData();
                    formData.append('file', file);
                    mutateUploadLyricsByFile(formData);
                  }
                }}
              />
            </div>
          )}
        </div>
      </section>
    </UIGuard>
  );
};
