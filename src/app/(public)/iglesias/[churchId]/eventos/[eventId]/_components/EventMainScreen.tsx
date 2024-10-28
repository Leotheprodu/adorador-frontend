import { FullscreenIcon } from '@global/icons/FullScreenIcon';
import { useStore } from '@nanostores/react';
import { $event, $eventSelectedSong } from '@stores/event';
import { useEffect, useState } from 'react';
import { EventSongsProps } from '../../_interfaces/eventsInterface';
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

  const eventData = useStore($event);
  const selectedSongId = useStore($eventSelectedSong);
  const [selectedSongData, setSelectedSongData] = useState<EventSongsProps>();
  useEffect(() => {
    if (eventData?.songs) {
      const songId = selectedSongId;
      const song = eventData.songs.find((song) => song.song.id === songId);
      if (song) {
        setSelectedSongData(song);
      }
    }
  }, [eventData, selectedSongId]);

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
        {selectedSongData?.song.lyrics.map((lyric) => (
          <div key={lyric.id} className="flex flex-col items-center">
            <div className="flex flex-col items-center">
              {lyric.lyrics === '' && (
                <h1 className="text-center text-3xl">
                  ({lyric.structure.title})
                </h1>
              )}
              <div className="grid w-full grid-cols-5 gap-4">
                {lyric.chords.map((chord) => (
                  <div
                    key={chord.id}
                    style={{
                      gridColumnStart: chord.position,
                      gridColumnEnd: chord.position + 1,
                    }}
                    className={`col-span-1 w-10`}
                  >
                    <h2 className="text-2xl">{`${chord.rootNote}${chord.chordQuality}${chord.slashChord ? '/' + chord.slashChord + chord.slashQuality : ''}`}</h2>
                  </div>
                ))}
              </div>
              <h1 className="text-2xl">{lyric.lyrics}</h1>
            </div>
          </div>
        ))}

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
