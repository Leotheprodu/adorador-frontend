import { FullscreenIcon } from '@global/icons/FullScreenIcon';
import { useStore } from '@nanostores/react';
import {
  $event,
  $eventSelectedSong,
  $isStreamAdmin,
  $lyricSelected,
  $selectedSongData,
  $selectedSongLyricLength,
} from '@stores/event';
import { useEffect } from 'react';
import { LyricsShowcase } from './LyricsShowcase';

export const EventMainScreen = ({
  eventMainScreenProps,
}: {
  eventMainScreenProps: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    divRef: any;
    title: string;
    eventDateLeft: string;
    isFullscreen: boolean;
    activateFullscreen: () => void;
  };
}) => {
  const { divRef, title, eventDateLeft, isFullscreen, activateFullscreen } =
    eventMainScreenProps;
  const eventData = useStore($event);
  const selectedSongId = useStore($eventSelectedSong);
  const selectedSongData = useStore($selectedSongData);
  const selectedSongLyricLength = useStore($selectedSongLyricLength);
  const isStreamAdmin = useStore($isStreamAdmin);

  useEffect(() => {
    if (selectedSongData && selectedSongData?.song.lyrics.length > 0) {
      $selectedSongLyricLength.set(selectedSongData.song.lyrics.length);
    } else {
      $selectedSongLyricLength.set(0);
    }
  }, [selectedSongData]);

  useEffect(() => {
    if (eventData?.songs) {
      const songId = selectedSongId;
      const song = eventData.songs.find((song) => song.song.id === songId);
      if (song) {
        $selectedSongData.set(song);
      }
    }
  }, [eventData, selectedSongId]);

  const lyricSelected = useStore($lyricSelected);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isFullscreen && isStreamAdmin) {
        if (event.key === 'ArrowRight') {
          if (lyricSelected.position <= selectedSongLyricLength + 1)
            $lyricSelected.set({
              position: lyricSelected.position + 1,
              action: 'forward',
            });
        } else if (event.key === 'ArrowLeft') {
          if (lyricSelected.position > 0)
            $lyricSelected.set({
              position: lyricSelected.position - 1,
              action: 'backward',
            });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [
    isFullscreen,
    selectedSongData,
    lyricSelected,
    selectedSongLyricLength,
    isStreamAdmin,
  ]);

  return (
    <div
      ref={divRef}
      className="relative flex h-[15rem] w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-black p-5 text-blanco"
    >
      {!selectedSongData && (
        <div className="font-agdasima flex flex-col items-center justify-center">
          <h1 className="text-center text-xl uppercase text-slate-400 lg:text-5xl">
            {title}
          </h1>
          <h3 className="text-center text-lg uppercase lg:text-6xl">
            {eventDateLeft}
          </h3>
        </div>
      )}
      {lyricSelected.position === 0 && (
        <h1 className="text-4xl">{selectedSongData?.song.title}</h1>
      )}
      {lyricSelected.position === selectedSongLyricLength + 1 && (
        <h1 className="text-4xl uppercase">Fin</h1>
      )}

      <LyricsShowcase
        lyricsShowcaseProps={{
          isFullscreen,
          selectedSongData,
        }}
      />

      {!isFullscreen && (
        <button
          className="absolute bottom-2 right-2 hover:opacity-70"
          onClick={activateFullscreen}
        >
          <FullscreenIcon />
        </button>
      )}
    </div>
  );
};
