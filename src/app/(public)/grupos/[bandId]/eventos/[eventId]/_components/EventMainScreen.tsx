import { FullscreenIcon } from '@global/icons/FullScreenIcon';
import { useStore } from '@nanostores/react';
import {
  $event,
  $eventSelectedSongId,
  $lyricSelected,
  $selectedSongData,
  $selectedSongLyricLength,
  $eventConfig,
  $eventLiveMessage,
} from '@stores/event';
import { useEffect, useState } from 'react';
import { LyricsShowcase } from '@bands/[bandId]/eventos/[eventId]/_components/LyricsShowcase';
import { useEventGateway } from '@bands/[bandId]/eventos/[eventId]/_hooks/useEventGateway';
import { CheckUserStatus } from '@global/utils/checkUserStatus';
import { AnimatePresence, motion } from 'framer-motion';
import { useFullscreen } from '@bands/[bandId]/eventos/[eventId]/_hooks/useFullscreen';
import { useHandleEventLeft } from '@bands/[bandId]/eventos/[eventId]/_hooks/useHandleEventLeft';

export const EventMainScreen = () => {
  const { isFullscreen, activateFullscreen, divRef } = useFullscreen();
  const { eventDateLeft } = useHandleEventLeft();
  const eventData = useStore($event);
  const eventConfig = useStore($eventConfig);
  const selectedSongId = useStore($eventSelectedSongId);
  const selectedSongData = useStore($selectedSongData);
  const selectedSongLyricLength = useStore($selectedSongLyricLength);
  const { sendMessage } = useEventGateway();
  const checkPermission = CheckUserStatus({
    isLoggedIn: true,
    checkAdminEvent: true,
  });
  const { title, songs } = eventData;
  useEffect(() => {
    if (selectedSongData && selectedSongData?.song.lyrics.length > 0) {
      $selectedSongLyricLength.set(selectedSongData.song.lyrics.length);
    } else {
      $selectedSongLyricLength.set(0);
    }
  }, [selectedSongData]);

  useEffect(() => {
    if (songs) {
      const songId = selectedSongId;
      const song = songs.find((song) => song.song.id === songId);
      if (song) {
        $selectedSongData.set(song);
      }
    }
  }, [songs, selectedSongId]);
  const eventLiveMessage = useStore($eventLiveMessage);
  const [liveMessage, setLiveMessage] = useState('');
  useEffect(() => {
    if (eventLiveMessage !== '') {
      setLiveMessage(eventLiveMessage);
      setTimeout(() => {
        setLiveMessage('');
        $eventLiveMessage.set('');
      }, 5000);
    }
  }, [eventLiveMessage]);

  const lyricSelected = useStore($lyricSelected);
  useEffect(() => {
    let startY = 0;
    let endY = 0;

    const handleTouchStart = (event: TouchEvent) => {
      startY = event.touches[0].clientY;
    };

    const handleTouchMove = (event: TouchEvent) => {
      endY = event.touches[0].clientY;
    };

    const handleTouchEnd = () => {
      if (isFullscreen && checkPermission) {
        if (startY - endY > 50) {
          // Deslizar hacia arriba
          if (
            lyricSelected.position <= selectedSongLyricLength &&
            selectedSongLyricLength > 4 &&
            lyricSelected.position + 3 <= selectedSongLyricLength
          ) {
            sendMessage({
              type: 'lyricSelected',
              data: {
                position:
                  lyricSelected.position < selectedSongLyricLength - 3 &&
                  lyricSelected.position < 1
                    ? lyricSelected.position + 1
                    : lyricSelected.position + 4,
                action: 'forward',
              },
            });
          } else if (
            selectedSongLyricLength > 0 &&
            selectedSongLyricLength < 4
          ) {
            sendMessage({
              type: 'lyricSelected',
              data: {
                position: 1,
                action: 'forward',
              },
            });
          }
        } else if (endY - startY > 50) {
          // Deslizar hacia abajo
          if (lyricSelected.position > 0) {
            sendMessage({
              type: 'lyricSelected',
              data: {
                position:
                  lyricSelected.position <= 4
                    ? lyricSelected.position - 1
                    : lyricSelected.position - 4,
                action: 'backward',
              },
            });
          }
        }
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFullscreen, lyricSelected, selectedSongLyricLength]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isFullscreen && checkPermission) {
        if (event.key === 'ArrowDown') {
          if (
            lyricSelected.position <= selectedSongLyricLength &&
            selectedSongLyricLength > 4 &&
            lyricSelected.position + 3 <= selectedSongLyricLength
          ) {
            sendMessage({
              type: 'lyricSelected',
              data: {
                position:
                  lyricSelected.position < selectedSongLyricLength - 3 &&
                  lyricSelected.position < 1
                    ? lyricSelected.position + 1
                    : lyricSelected.position + 4,
                action: 'forward',
              },
            });
          } else if (
            selectedSongLyricLength > 0 &&
            selectedSongLyricLength < 4
          ) {
            sendMessage({
              type: 'lyricSelected',
              data: {
                position: 1,
                action: 'forward',
              },
            });
          }
        } else if (event.key === 'ArrowUp') {
          if (lyricSelected.position > 0)
            sendMessage({
              type: 'lyricSelected',
              data: {
                position:
                  lyricSelected.position <= 4
                    ? lyricSelected.position - 1
                    : lyricSelected.position - 4,
                action: 'backward',
              },
            });
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isFullscreen, selectedSongData, lyricSelected, selectedSongLyricLength]);
  return (
    <div
      style={{
        backgroundImage: `url('/images/backgrounds/paisaje_${eventConfig.backgroundImage || 1}.avif')`,
      }}
      ref={divRef}
      className="relative flex h-[20rem] w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-black/80 bg-cover bg-center bg-no-repeat p-5 text-blanco bg-blend-darken"
    >
      {!selectedSongData ||
        (lyricSelected.position === -1 && (
          <div className="flex flex-col items-center justify-center">
            <h1 className="text-center text-xl uppercase text-slate-400 lg:text-5xl">
              {title}
            </h1>
            <h3 className="text-center text-lg uppercase lg:text-6xl">
              {eventDateLeft}
            </h3>
          </div>
        ))}
      {lyricSelected.position === 0 && (
        <h1 className={`text-5xl ${isFullscreen ? 'text-8xl' : ''}`}>
          {selectedSongData?.song.title}
        </h1>
      )}
      {lyricSelected.position === selectedSongLyricLength + 1 && (
        <h1
          className={`uppercase ${isFullscreen ? 'text-3xl md:text-5xl lg:text-8xl' : 'text-xl md:text-3xl lg:text-5xl'} text-center`}
        >
          Fin
        </h1>
      )}

      {liveMessage !== '' && (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <p>{liveMessage}</p>
          </motion.div>
        </AnimatePresence>
      )}
      {lyricSelected.position > 0 &&
        lyricSelected.position < selectedSongLyricLength + 1 && (
          <LyricsShowcase
            lyricsShowcaseProps={{
              isFullscreen,
            }}
          />
        )}

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
