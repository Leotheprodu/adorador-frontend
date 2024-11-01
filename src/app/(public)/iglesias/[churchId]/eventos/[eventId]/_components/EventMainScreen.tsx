import { FullscreenIcon } from '@global/icons/FullScreenIcon';
import { useStore } from '@nanostores/react';
import {
  $backgroundImage,
  $event,
  $eventSelectedSong,
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
      if (isFullscreen) {
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
  }, [isFullscreen, selectedSongData, lyricSelected, selectedSongLyricLength]);
  const backgroundImage = useStore($backgroundImage);
  return (
    <div
      style={{
        backgroundImage: `url('/images/backgrounds/paisaje_${backgroundImage || 1}.avif')`,
      }}
      ref={divRef}
      className="relative flex h-[15rem] w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-black/70 bg-cover bg-center bg-no-repeat p-5 text-blanco bg-blend-darken"
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
        <h1 className={`text-5xl ${isFullscreen ? 'text-8xl' : ''}`}>
          {selectedSongData?.song.title}
        </h1>
      )}
      {lyricSelected.position === selectedSongLyricLength + 1 && (
        <h1 className="text-4xl uppercase">Fin</h1>
      )}

      <LyricsShowcase
        lyricsShowcaseProps={{
          isFullscreen,
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
