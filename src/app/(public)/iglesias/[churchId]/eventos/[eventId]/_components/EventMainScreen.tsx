import { FullscreenIcon } from '@global/icons/FullScreenIcon';
import { useStore } from '@nanostores/react';
import {
  $event,
  $eventSelectedSong,
  $isStreamAdmin,
  $lyricSelected,
  $selectedSongLyricLength,
} from '@stores/event';
import { useEffect, useState } from 'react';
import { EventSongsProps } from '../../_interfaces/eventsInterface';
import { handleTranspose } from '../_utils/handleTranspose';
import { songTypes } from '@global/config/constants';
import { LyricsShowcase } from './LyricsShowcase';
import { AnimatePresence, motion } from 'framer-motion';
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
  const selectedSongLyricLength = useStore($selectedSongLyricLength);
  const isStreamAdmin = useStore($isStreamAdmin);

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
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isFullscreen && isStreamAdmin) {
        if (event.key === 'ArrowRight') {
          if (lyricSelected.index < selectedSongLyricLength)
            $lyricSelected.set({
              index: lyricSelected.index + 1,
              action: 'forward',
            });
        } else if (event.key === 'ArrowLeft') {
          if (lyricSelected.index > 0)
            $lyricSelected.set({
              index: lyricSelected.index - 1,
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
        {lyricSelected.index === 0 && (
          <h1 className="text-4xl">{selectedSongData?.song.title}</h1>
        )}

        <div className="absolute inset-0 flex flex-col">
          <AnimatePresence>
            {isFullscreen && (
              <motion.div
                key={lyricSelected.index - 1}
                initial={{
                  opacity: 0,
                  y: lyricSelected.action === 'backward' ? -300 : 300,
                }}
                animate={{ opacity: 1, y: 0 }}
                exit={{
                  opacity: 0,
                  y: lyricSelected.action === 'forward' ? -300 : 300,
                }}
                transition={{
                  opacity: { duration: 0.3 },
                  y: { duration: 0.4 },
                }}
                className="pointer-events-none absolute top-20 z-0 w-full text-center text-2xl text-gray-800"
                style={{
                  filter: 'blur(6px)',
                  textShadow: '0 0 20px rgba(255, 255, 255, 0.1)',
                }}
              >
                <LyricsShowcase
                  lyricsShowcaseProps={{
                    isFullscreen,
                    selectedSongData,
                    lyricSelected: {
                      ...lyricSelected,
                      index: lyricSelected.index - 1,
                    },
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            <motion.div
              key={lyricSelected.index}
              initial={{
                opacity: 0,
                y: lyricSelected.action === 'backward' ? -200 : 200,
              }}
              animate={{ opacity: 1, y: 0 }}
              exit={{
                opacity: 0,
                y: lyricSelected.action === 'forward' ? -200 : 200,
              }}
              transition={{ opacity: { duration: 0.2 }, y: { duration: 0.5 } }}
              className="pointer-events-none absolute bottom-1/2 w-full text-center text-2xl text-white"
            >
              <LyricsShowcase
                lyricsShowcaseProps={{
                  isFullscreen,
                  selectedSongData,
                  lyricSelected,
                }}
              />
            </motion.div>
          </AnimatePresence>
          <AnimatePresence>
            {isFullscreen && lyricSelected.index !== 0 && (
              <motion.div
                key={lyricSelected.index - 1}
                initial={{
                  opacity: 0,
                  y: lyricSelected.action === 'backward' ? -300 : 300,
                }}
                animate={{ opacity: 1, y: 0 }}
                exit={{
                  opacity: 0,
                  y: lyricSelected.action === 'forward' ? -300 : 300,
                }}
                transition={{
                  opacity: { duration: 0.3 },
                  y: { duration: 0.4 },
                }}
                className="pointer-events-none absolute bottom-20 z-0 w-full text-center text-2xl text-gray-800"
                style={{
                  filter: 'blur(1px)',
                }}
              >
                <LyricsShowcase
                  lyricsShowcaseProps={{
                    isFullscreen,
                    selectedSongData,
                    lyricSelected: {
                      ...lyricSelected,
                      index: lyricSelected.index + 1,
                    },
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

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
