import { FullscreenIcon } from '@global/icons/FullScreenIcon';
import { useStore } from '@nanostores/react';
import { $event, $eventSelectedSong } from '@stores/event';
import { useEffect, useState } from 'react';
import { EventSongsProps } from '../../_interfaces/eventsInterface';
import { handleTranspose } from '../_utils/handleTranspose';

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
      {selectedSongData && (
        <div className="flex flex-col items-center justify-center">
          <h1 className="text-center text-xl uppercase text-slate-400 lg:text-5xl">
            {selectedSongData.song.title}
          </h1>
          <h3 className="text-center text-lg uppercase lg:text-6xl">
            {handleTranspose(
              selectedSongData.song.key,
              selectedSongData.transpose,
            )}
          </h3>
        </div>
      )}

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
  );
};
