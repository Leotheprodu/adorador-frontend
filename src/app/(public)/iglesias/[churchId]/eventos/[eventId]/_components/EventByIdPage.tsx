'use client';
import { UIGuard } from '@global/utils/UIGuard';
import { getEventsById } from '@iglesias/[churchId]/eventos/[eventId]/_services/eventByIdService';
import { useFullscreen } from '@iglesias/[churchId]/eventos/[eventId]/_hooks/useFullscreen';
import { useLeftTime } from '@iglesias/[churchId]/eventos/[eventId]/_hooks/useLeftTime';
import { useHandleEventLeft } from '@iglesias/[churchId]/eventos/[eventId]/_hooks/useHandleEventLeft';
import { EventControls } from '@iglesias/[churchId]/eventos/[eventId]/_components/EventControls';
import { EventMainScreen } from './EventMainScreen';
import { useEffect } from 'react';
import {
  $event,
  $eventSelectedSong,
  $lyricSelected,
  $selectedSongData,
  $selectedSongLyricLength,
} from '@stores/event';
import { useStore } from '@nanostores/react';
import { handleTranspose } from '../_utils/handleTranspose';
import { songTypes } from '@global/config/constants';
export const EventByIdPage = ({
  params,
}: {
  params: { churchId: string; eventId: string };
}) => {
  const { data, isLoading, status, refetch } = getEventsById({
    churchId: params.churchId,
    eventId: params.eventId,
  });
  const lyricSelected = useStore($lyricSelected);
  const selectedSongLyricLength = useStore($selectedSongLyricLength);
  useEffect(() => {
    document.title = data?.title ?? 'Eventos';
  }, [data]);

  useEffect(() => {
    if (status === 'success') {
      $event.set(data);
    }
  }, [status, data]);

  const { timeLeft } = useLeftTime({ date: data?.date });
  const { eventDateLeft } = useHandleEventLeft({
    timeLeft,
    date: data?.date,
  });
  const { isFullscreen, activateFullscreen, divRef } = useFullscreen();
  const selectedSongData = useStore($selectedSongData);

  useEffect(() => {
    if (lyricSelected.position === selectedSongLyricLength + 2) {
      const currentSongIndex = data?.songs.findIndex(
        (song) => song.song.id === selectedSongData?.song.id,
      );
      if (
        currentSongIndex !== undefined &&
        data &&
        currentSongIndex < data.songs.length - 1
      ) {
        const nextSong = data.songs[currentSongIndex + 1];
        $eventSelectedSong.set(nextSong.song.id);
      }
      $lyricSelected.set({ position: 0, action: 'forward' });
    } else if (lyricSelected.position === -1) {
      const currentSongIndex = data?.songs.findIndex(
        (song) => song.song.id === selectedSongData?.song.id,
      );
      if (currentSongIndex !== undefined && data && currentSongIndex > 0) {
        const previousSong = data.songs[currentSongIndex - 1];
        $eventSelectedSong.set(previousSong.song.id);
        $lyricSelected.set({
          position: previousSong.song.lyrics.length,
          action: 'backward',
        });
      }
    }
  }, [selectedSongLyricLength, lyricSelected, selectedSongData, data]);

  return (
    <UIGuard isLoading={isLoading}>
      <div className="flex h-full w-full flex-col items-center justify-center">
        <div className="flex w-full max-w-screen-md flex-col">
          <EventMainScreen
            eventMainScreenProps={{
              divRef,
              title: data?.title ?? '',
              eventDateLeft,
              isFullscreen,
              activateFullscreen,
            }}
          />

          <div className="h-14 w-full">
            {selectedSongData && (
              <div className="mt-4 flex flex-col px-3">
                <h1 className="text-2xl">
                  <span className="capitalize">
                    {selectedSongData.song.title}
                  </span>
                  {selectedSongData.song.key &&
                    ', ' +
                      handleTranspose(
                        selectedSongData.song.key,
                        selectedSongData.transpose,
                      )}{' '}
                  -{' '}
                  <span className="capitalize">
                    {songTypes[selectedSongData.song.songType].es}
                  </span>
                </h1>
              </div>
            )}
          </div>

          <EventControls
            refetch={refetch}
            eventId={params.eventId}
            songs={data?.songs ?? []}
            churchId={params.churchId}
          />
        </div>
      </div>
    </UIGuard>
  );
};
