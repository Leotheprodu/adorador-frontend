import { FullscreenIcon } from '@global/icons/FullScreenIcon';
import { SongNavigationButtons } from '@bands/[bandId]/eventos/[eventId]/en-vivo/_components/SongNavigationButtons';
import { useStore } from '@nanostores/react';
import { $lyricSelected, $eventLiveMessage } from '@stores/event';
import { useEffect, useState } from 'react';
import { LyricsShowcase } from '@bands/[bandId]/eventos/[eventId]/en-vivo/_components/LyricsShowcase';
import { AnimatePresence, motion } from 'framer-motion';
import { useFullscreen } from '@bands/[bandId]/eventos/[eventId]/en-vivo/_hooks/useFullscreen';
import { useEventSongNavigation } from '@bands/[bandId]/eventos/[eventId]/en-vivo/_hooks/useEventSongNavigation';
import { useEventControls } from '@bands/[bandId]/eventos/[eventId]/en-vivo/_hooks/useEventControls';
import { VideoShowcase } from './VideoShowcase';
import { FinalMessageSong } from './FinalMessageSong';
import { VideoLyricsEventPlayer } from './VideoLyricsEventPlayer';
import { useParams } from 'next/navigation';

export const EventMainScreen = () => {
  const { isFullscreen, isSupported, activateFullscreen, divRef } =
    useFullscreen();
  const params = useParams<{ bandId: string; eventId: string }>();

  // Hook de navegación de canciones
  const {
    eventConfig,
    eventData,
    selectedSongData,
    selectedSongLyricLength,
    isEventManager,
    hasPreviousSong,
    hasNextSong,
    goToPreviousSong,
    goToNextSong,
    startSong,
  } = useEventSongNavigation();

  const lyricSelected = useStore($lyricSelected);

  // Detect event mode
  const isVideoLyricsMode = eventData.eventMode === 'videolyrics';

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
      className={`relative flex h-[22rem] w-full flex-col items-center justify-center overflow-hidden rounded-2xl ${eventConfig.showGreetingScreen && eventConfig.isProjectorMode ? 'bg-purple-700' : eventConfig.isProjectorMode ? 'bg-black' : 'bg-black/90'} bg-cover bg-center bg-no-repeat p-5 text-blanco bg-blend-darken shadow-xl ring-1 ring-white/10 backdrop-blur-sm sm:h-[24rem]`}
    >
      {/* en Modo proyector muestra el background con video - SOLO en modo LIVE */}
      {eventConfig.showGreetingScreen &&
      eventConfig.isProjectorMode &&
      !isVideoLyricsMode ? (
        <div className="z-10 flex h-full w-full flex-col items-center justify-center">
          <VideoShowcase
            props={{
              type: 'eventIntro',
            }}
          />
        </div>
      ) : !eventConfig.showGreetingScreen &&
        eventConfig.isProjectorMode &&
        !isVideoLyricsMode ? (
        <div className="flex h-full w-full flex-col items-center justify-center">
          <VideoShowcase
            props={{
              type: 'eventBackground',
            }}
          />
        </div>
      ) : null}
      {lyricSelected.position === 0 &&
        selectedSongData &&
        !isVideoLyricsMode && (
          <div
            className={`flex w-full flex-col items-center justify-center gap-8 ${eventConfig.isProjectorMode ? 'absolute' : ''}`}
          >
            <h1
              className={`font-momotrust ${isFullscreen ? 'text-3xl md:text-5xl lg:text-8xl' : 'text-xl md:text-3xl lg:text-5xl'} text-center`}
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
          <div
            className={`flex w-full flex-col items-center justify-center gap-8 ${eventConfig.isProjectorMode ? 'absolute' : ''}`}
          >
            <h1
              className={`font-momotrust ${isFullscreen ? 'text-3xl md:text-5xl lg:text-8xl' : 'text-xl md:text-3xl lg:text-5xl'} text-center`}
            >
              <FinalMessageSong />
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
      {/* VideoLyrics mode: Show YouTube player ONLY in projector mode */}
      {isVideoLyricsMode && eventConfig.isProjectorMode ? (
        <div className="absolute inset-0 z-10">
          <VideoLyricsEventPlayer
            currentSong={selectedSongData ?? null}
            onNext={goToNextSong}
            onPrevious={goToPreviousSong}
            hasNext={hasNextSong}
            hasPrevious={hasPreviousSong}
            isEventManager={isEventManager}
            isFullscreen={isFullscreen}
            bandId={params.bandId}
            activateFullscreen={activateFullscreen}
          />
        </div>
      ) : isVideoLyricsMode && !eventConfig.isProjectorMode ? (
        /* VideoLyrics mode but NOT projector - Show song title only */
        lyricSelected.position === 0 &&
        selectedSongData && (
          <div
            className={`flex w-full flex-col items-center justify-center gap-8 ${eventConfig.isProjectorMode ? 'absolute' : ''}`}
          >
            <h1
              className={`font-momotrust ${isFullscreen ? 'text-3xl md:text-5xl lg:text-8xl' : 'text-xl md:text-3xl lg:text-5xl'} text-center`}
            >
              {selectedSongData?.song.title}
            </h1>
            <p className="text-center text-default-500">
              El video está reproduciéndose en modo proyector
            </p>
          </div>
        )
      ) : (
        /* Traditional lyrics mode */
        lyricSelected.position > 0 &&
        lyricSelected.position < selectedSongLyricLength + 1 && (
          <LyricsShowcase
            lyricsShowcaseProps={{
              isFullscreen,
            }}
          />
        )
      )}

      {!isFullscreen && isSupported && (
        <button
          className="absolute bottom-3 right-3 z-20 rounded-xl bg-gradient-to-br from-brand-purple-500 to-brand-blue-500 p-3 shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-110 hover:shadow-xl active:scale-95"
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
