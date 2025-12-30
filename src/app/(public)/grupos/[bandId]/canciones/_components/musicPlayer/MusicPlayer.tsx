'use client';

import { useState } from 'react';
import ReactPlayer from 'react-player';
import { useMusicPlayer } from '../../_hooks/useMusicPlayer';
import { PlayerToast } from './PlayerToast';
import { PlayerProgressBar } from './PlayerProgressBar';
import { PlayerControls } from './PlayerControls';
import { PlayerVolumeControl } from './PlayerVolumeControl';
import { AnimatePresence } from 'framer-motion';
import { FloatingPlayerTools } from './FloatingPlayerTools';
import { $PlayerRef } from '@stores/player';

export const MusicPlayer = () => {
  const {
    selectedBeat,
    playlist,
    playing,
    progress,
    progressDuration,
    duration,
    volume,
    playerRef,
    handlePlay,
    handleDuration,
    handleProgress,
    handlePlayButtonClick,
    handleSeek,
    handleNextSong,
    handlePrevSong,
    setEnded,
    setVolume,
  } = useMusicPlayer();

  const [showMetronome, setShowMetronome] = useState(true);
  const [showLyrics, setShowLyrics] = useState(false);

  if (!selectedBeat) return null;

  const hasMetronomeData = !!(
    selectedBeat &&
    selectedBeat.tempo &&
    selectedBeat.tempo > 0 &&
    selectedBeat.startTime !== undefined &&
    selectedBeat.hasSyncedChords
  );

  const showFloatingTools = (showMetronome && hasMetronomeData) || showLyrics;

  return (
    <>
      <PlayerToast selectedBeat={selectedBeat} />
      <section className="sticky bottom-0 z-[999] flex h-[4rem] w-full items-center justify-center bg-negro [grid-area:musicPlayer]">
        <PlayerProgressBar
          progress={progress}
          progressDuration={progressDuration}
          duration={duration}
          onSeek={handleSeek}
        />

        <div className="absolute flex h-[4rem] w-full items-center justify-center overflow-hidden">
          <div className="pointer-events-none absolute z-10 h-screen w-screen blur-3xl">
            <ReactPlayer
              className="scale-x-150 opacity-10"
              width="100%"
              height="100%"
              url={`https://www.youtube.com/watch?v=${selectedBeat?.youtubeLink}`}
              progressInterval={50} // Critical for smooth metronome
              config={{
                youtube: {
                  playerVars: {
                    fs: 1,
                    controls: 0,
                    modestbranding: 1,
                    autoplay: true,
                  },
                },
              }}
              ref={playerRef}
              playing={playing}
              onPlay={handlePlay}
              onReady={(player) => $PlayerRef.set(player)}
              onEnded={() => setEnded(true)}
              onDuration={handleDuration}
              onProgress={handleProgress}
              volume={volume}
            />
          </div>
        </div>

        {/* Floating Tools (Metronome & Lyrics) */}
        <AnimatePresence>
          {showFloatingTools && (
            <FloatingPlayerTools
              tempo={selectedBeat.tempo || 0}
              startTime={selectedBeat.startTime || 0}
              tonality={selectedBeat.key}
              playerRef={playerRef}
              playing={playing}
              showMetronome={showMetronome && hasMetronomeData}
              showLyrics={showLyrics}
              onClose={() => {
                setShowMetronome(false);
                setShowLyrics(false);
              }}
            />
          )}
        </AnimatePresence>

        <div className="z-20 flex flex-col items-center justify-center gap-2">
          <PlayerControls
            playing={playing}
            hasSelectedBeat={!!selectedBeat}
            hasMultipleSongs={playlist.length > 1}
            onPlayPause={handlePlayButtonClick}
            onNext={handleNextSong}
            onPrev={handlePrevSong}
            onToggleMetronome={
              selectedBeat?.hasSyncedChords
                ? () => setShowMetronome(!showMetronome)
                : undefined
            }
            isMetronomeOpen={showMetronome && hasMetronomeData}
            onToggleLyrics={
              selectedBeat?.hasSyncedLyrics
                ? () => setShowLyrics(!showLyrics)
                : undefined
            }
            isLyricsOpen={showLyrics}
          />

          <PlayerVolumeControl volume={volume} onVolumeChange={setVolume} />

          {selectedBeat && (
            <div className="absolute bottom-1/2 left-2 flex translate-y-1/2 transform flex-col gap-1">
              <p className="text-sm text-terciario opacity-60 duration-100 hover:opacity-100">
                {selectedBeat.name}
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
};
