import { FullscreenIcon } from '@global/icons/FullScreenIcon';
import { useStore } from '@nanostores/react';
import {
  $event,
  $eventSelectedSong,
  $lyricSelected,
  $selectedSongLyricLength,
} from '@stores/event';
import { useEffect, useState } from 'react';
import {
  EventSongsProps,
  LyricsProps,
} from '../../_interfaces/eventsInterface';
import { handleTranspose } from '../_utils/handleTranspose';
import { songTypes } from '@global/config/constants';

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
  const [dataOfLyricSelected, setDataOfLyricSelected] = useState<LyricsProps>();
  const eventData = useStore($event);
  const selectedSongId = useStore($eventSelectedSong);
  const [selectedSongData, setSelectedSongData] = useState<EventSongsProps>();
  const selectedSongLyricLength = useStore($selectedSongLyricLength);
  useEffect(() => {
    if (selectedSongData && selectedSongData?.song.lyrics.length > 0) {
      $selectedSongLyricLength.set(selectedSongData.song.lyrics.length);
    }
  }, [selectedSongData]);

  useEffect(() => {
    if (eventData?.songs) {
      const songId = selectedSongId;
      const song = eventData.songs.find((song) => song.song.id === songId);
      if (song) {
        setSelectedSongData(song);
      }
    }
  }, [eventData, selectedSongId]);

  const lyricSelected = useStore($lyricSelected);

  useEffect(() => {
    if (
      selectedSongData &&
      lyricSelected <= selectedSongData?.song.lyrics.length
    ) {
      setDataOfLyricSelected(selectedSongData?.song.lyrics[lyricSelected - 1]);
    } else {
      setDataOfLyricSelected(undefined);
    }
  }, [lyricSelected, selectedSongData]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isFullscreen) {
        if (event.key === 'ArrowRight') {
          if (lyricSelected < selectedSongLyricLength)
            $lyricSelected.set($lyricSelected.value + 1);
        } else if (event.key === 'ArrowLeft') {
          if (lyricSelected > 0) $lyricSelected.set($lyricSelected.value - 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isFullscreen, selectedSongData, lyricSelected, selectedSongLyricLength]);

  return (
    <>
      <div
        ref={divRef}
        className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-black p-5 text-blanco"
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

        <div className="flex flex-col items-center">
          {lyricSelected === 0 && (
            <h1 className="text-4xl">{selectedSongData?.song.title}</h1>
          )}
          {lyricSelected > 0 && (
            <div className="flex flex-col items-center">
              {dataOfLyricSelected?.lyrics === '' && (
                <h1 className="text-center text-3xl">
                  ({dataOfLyricSelected?.structure.title})
                </h1>
              )}
              <div className="grid w-full grid-cols-5 gap-4">
                {dataOfLyricSelected?.chords.map((chord) => (
                  <div
                    key={chord.id}
                    style={{
                      gridColumnStart: chord.position,
                      gridColumnEnd: chord.position + 1,
                    }}
                    className={`col-span-1 w-10`}
                  >
                    <h2
                      className={`text-2xl text-slate-300 md:text-4xl lg:text-6xl ${isFullscreen ? 'lg:text-8xl' : ''}`}
                    >{`${chord.rootNote}${chord.chordQuality}${chord.slashChord ? '/' + chord.slashChord + chord.slashQuality : ''}`}</h2>
                  </div>
                ))}
              </div>
              <h1
                className={`text-2xl md:text-4xl lg:text-6xl ${isFullscreen ? 'lg:text-8xl' : ''}`}
              >
                {dataOfLyricSelected?.lyrics}
              </h1>
            </div>
          )}
        </div>

        {/* {isFullscreen && (
            <div className="absolute bottom-0 left-0 h-40 w-full bg-slate-900">
              <EventControls songs={data?.songs ?? []} />
            </div>
          )} */}
        {!isFullscreen && (
          <button
            className="absolute bottom-2 right-2 hover:opacity-70"
            onClick={activateFullscreen}
          >
            <FullscreenIcon />
          </button>
        )}
      </div>
      {selectedSongData && (
        <div className="mt-4 flex flex-col px-3">
          <h1 className="text-2xl">
            <span className="capitalize">{selectedSongData.song.title}</span>,{' '}
            {handleTranspose(
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
    </>
  );
};
