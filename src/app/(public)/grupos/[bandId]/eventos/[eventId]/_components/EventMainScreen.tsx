import { FullscreenIcon } from '@global/icons/FullScreenIcon';
import { SongNavigationButtons } from '@bands/[bandId]/eventos/[eventId]/_components/SongNavigationButtons';
import { useStore } from '@nanostores/react';
import { $lyricSelected, $eventLiveMessage } from '@stores/event';
import { useEffect, useState } from 'react';
import { LyricsShowcase } from '@bands/[bandId]/eventos/[eventId]/_components/LyricsShowcase';
import { AnimatePresence, motion } from 'framer-motion';
import { useFullscreen } from '@bands/[bandId]/eventos/[eventId]/_hooks/useFullscreen';
import { useHandleEventLeft } from '@bands/[bandId]/eventos/[eventId]/_hooks/useHandleEventLeft';
import { useEventSongNavigation } from '@bands/[bandId]/eventos/[eventId]/_hooks/useEventSongNavigation';
import { useEventControls } from '@bands/[bandId]/eventos/[eventId]/_hooks/useEventControls';

export const EventMainScreen = () => {
  const { isFullscreen, isSupported, activateFullscreen, divRef } =
    useFullscreen();
  const { eventDateLeft } = useHandleEventLeft();

  // Hook de navegación de canciones
  const {
    eventData,
    eventConfig,
    selectedSongData,
    selectedSongLyricLength,
    isEventManager,
    hasPreviousSong,
    hasNextSong,
    goToPreviousSong,
    goToNextSong,
    startSong,
  } = useEventSongNavigation();

  const { title } = eventData;
  const lyricSelected = useStore($lyricSelected);

  // Hook de controles (swipe y keyboard)
  useEventControls({
    isFullscreen,
    isEventManager,
    selectedSongLyricLength,
  });

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
            isFullscreen={isFullscreen}
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
              isFullscreen={isFullscreen}
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
    </div>
  );
};
