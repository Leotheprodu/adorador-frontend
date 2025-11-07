import { FullscreenIcon } from '@global/icons/FullScreenIcon';
import { IOSFullscreenTip } from '@bands/[bandId]/eventos/[eventId]/_components/IOSFullscreenTip';
import { SongNavigationButtons } from '@bands/[bandId]/eventos/[eventId]/_components/SongNavigationButtons';
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
import { $user } from '@stores/users';
import { useEffect, useState, useMemo } from 'react';
import { LyricsShowcase } from '@bands/[bandId]/eventos/[eventId]/_components/LyricsShowcase';
import { useEventGateway } from '@bands/[bandId]/eventos/[eventId]/_hooks/useEventGateway';

import { AnimatePresence, motion } from 'framer-motion';
import { useFullscreen } from '@bands/[bandId]/eventos/[eventId]/_hooks/useFullscreen';
import { useHandleEventLeft } from '@bands/[bandId]/eventos/[eventId]/_hooks/useHandleEventLeft';
import { userRoles } from '@global/config/constants';

export const EventMainScreen = () => {
  const { isFullscreen, isSupported, isIOS, activateFullscreen, divRef } =
    useFullscreen();
  const { eventDateLeft } = useHandleEventLeft();
  const eventData = useStore($event);
  const eventConfig = useStore($eventConfig);
  const selectedSongId = useStore($eventSelectedSongId);
  const selectedSongData = useStore($selectedSongData);
  const selectedSongLyricLength = useStore($selectedSongLyricLength);
  const user = useStore($user);
  const { sendMessage } = useEventGateway();
  const { title, songs } = eventData;

  // Verificar si es administrador de la app O event manager
  const isEventManager = useMemo(() => {
    // Si es admin de la app, siempre tiene acceso
    if (user?.isLoggedIn && user?.roles.includes(userRoles.admin.id)) {
      return true;
    }

    // Si no es admin, verificar si es event manager
    if (user?.isLoggedIn && user?.membersofBands) {
      return user.membersofBands.some(
        (band) => band.band.id === eventData?.bandId && band.isEventManager,
      );
    }

    return false;
  }, [user, eventData]);

  // Encontrar índice de la canción actual y verificar si hay anterior/siguiente
  const currentSongIndex = songs.findIndex(
    (song) => song.song.id === selectedSongId,
  );
  const hasPreviousSong = currentSongIndex > 0;
  const hasNextSong =
    currentSongIndex >= 0 && currentSongIndex < songs.length - 1;

  // Funciones para navegar entre canciones
  const goToPreviousSong = () => {
    if (hasPreviousSong && isEventManager) {
      const previousSong = songs[currentSongIndex - 1];
      sendMessage({ type: 'eventSelectedSong', data: previousSong.song.id });
      sendMessage({
        type: 'lyricSelected',
        data: {
          position: 0,
          action: 'forward',
        },
      });
    }
  };

  const goToNextSong = () => {
    if (hasNextSong && isEventManager) {
      const nextSong = songs[currentSongIndex + 1];
      sendMessage({ type: 'eventSelectedSong', data: nextSong.song.id });
      sendMessage({
        type: 'lyricSelected',
        data: {
          position: 0,
          action: 'forward',
        },
      });
    }
  };

  const startSong = () => {
    sendMessage({
      type: 'lyricSelected',
      data: {
        position: 1,
        action: 'forward',
      },
    });
  };

  useEffect(() => {
    const lyricsLength = selectedSongData?.song?.lyrics?.length || 0;
    if (lyricsLength > 0) {
      $selectedSongLyricLength.set(lyricsLength);
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
      if (isFullscreen && isEventManager && !eventConfig.swipeLocked) {
        if (startY - endY > 50) {
          // Deslizar hacia arriba
          if (lyricSelected.position === selectedSongLyricLength) {
            // Si estamos en la última letra, ir a "Fin"
            sendMessage({
              type: 'lyricSelected',
              data: {
                position: selectedSongLyricLength + 1,
                action: 'forward',
              },
            });
          } else if (
            lyricSelected.position < selectedSongLyricLength &&
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
            lyricSelected.position < selectedSongLyricLength &&
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
          } else if (
            lyricSelected.position < selectedSongLyricLength &&
            lyricSelected.position + 3 > selectedSongLyricLength
          ) {
            // Si estamos cerca del final pero no podemos avanzar 4, ir a la última posición
            sendMessage({
              type: 'lyricSelected',
              data: {
                position: selectedSongLyricLength,
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
  }, [
    isFullscreen,
    isEventManager,
    lyricSelected,
    selectedSongLyricLength,
    eventConfig.swipeLocked,
  ]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (isFullscreen && isEventManager && !eventConfig.swipeLocked) {
        if (event.key === 'ArrowDown') {
          if (lyricSelected.position === selectedSongLyricLength) {
            // Si estamos en la última letra, ir a "Fin"
            sendMessage({
              type: 'lyricSelected',
              data: {
                position: selectedSongLyricLength + 1,
                action: 'forward',
              },
            });
          } else if (
            lyricSelected.position < selectedSongLyricLength &&
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
            lyricSelected.position < selectedSongLyricLength &&
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
          } else if (
            lyricSelected.position < selectedSongLyricLength &&
            lyricSelected.position + 3 > selectedSongLyricLength
          ) {
            // Si estamos cerca del final pero no podemos avanzar 4, ir a la última posición
            sendMessage({
              type: 'lyricSelected',
              data: {
                position: selectedSongLyricLength,
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
  }, [
    isFullscreen,
    isEventManager,
    selectedSongData,
    lyricSelected,
    selectedSongLyricLength,
    eventConfig.swipeLocked,
  ]);
  return (
    <div
      style={{
        backgroundImage: `url('/images/backgrounds/paisaje_${eventConfig.backgroundImage || 1}.avif')`,
      }}
      ref={divRef}
      className="relative flex h-[22rem] w-full flex-col items-center justify-center overflow-hidden rounded-2xl bg-black/90 bg-cover bg-center bg-no-repeat p-5 text-blanco bg-blend-darken shadow-xl ring-1 ring-white/10 backdrop-blur-sm sm:h-[24rem]"
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
      {lyricSelected.position === 0 && selectedSongData && (
        <div className="flex w-full flex-col items-center justify-center gap-8">
          <h1
            className={`uppercase ${isFullscreen ? 'text-3xl md:text-5xl lg:text-8xl' : 'text-xl md:text-3xl lg:text-5xl'} text-center`}
          >
            {selectedSongData?.song.title}
          </h1>
          {/* Botones de navegación al inicio de la canción */}
          <SongNavigationButtons
            hasPreviousSong={hasPreviousSong}
            hasNextSong={hasNextSong}
            onPrevious={goToPreviousSong}
            onNext={goToNextSong}
            onMainAction={startSong}
            mainActionIcon="start"
            isEventManager={isEventManager}
          />
        </div>
      )}
      {lyricSelected.position === selectedSongLyricLength + 1 &&
        selectedSongData && (
          <div className="flex w-full flex-col items-center justify-center gap-8">
            <h1
              className={`uppercase ${isFullscreen ? 'text-3xl md:text-5xl lg:text-8xl' : 'text-xl md:text-3xl lg:text-5xl'} text-center`}
            >
              Fin
            </h1>
            {/* Botones de navegación al final de la canción */}
            <SongNavigationButtons
              hasPreviousSong={hasPreviousSong}
              hasNextSong={hasNextSong}
              onPrevious={goToPreviousSong}
              onNext={goToNextSong}
              onMainAction={startSong}
              mainActionIcon="restart"
              isEventManager={isEventManager}
            />
          </div>
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

      {!isFullscreen && isSupported && (
        <button
          className="absolute bottom-3 right-3 rounded-xl bg-gradient-to-br from-brand-purple-500 to-brand-blue-500 p-3 shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:shadow-xl active:scale-95"
          onClick={activateFullscreen}
          title="Pantalla completa"
          aria-label="Activar pantalla completa"
        >
          <FullscreenIcon />
        </button>
      )}

      {!isFullscreen && isIOS && <IOSFullscreenTip />}
    </div>
  );
};
