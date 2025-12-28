import { motion } from 'framer-motion';
import { useEffect, useRef, memo } from 'react';
import ReactPlayer from 'react-player';
import { XMarkIcon } from '@global/icons/XMarkIcon';
import { MetronomeIcon } from '@global/icons';
import { useStore } from '@nanostores/react';
import { getNoteByType } from '@bands/[bandId]/eventos/[eventId]/en-vivo/_utils/getNoteByType';
import { $ActiveChord } from '@/stores/activeChord';
import { $chordPreferences } from '@stores/event';

interface FloatingPlayerToolsProps {
  tempo: number;
  startTime: number;
  playerRef: React.RefObject<ReactPlayer>;
  playing: boolean;
  onClose: () => void;
}

export const FloatingPlayerTools = memo(
  ({
    tempo,
    startTime,
    playerRef,
    playing,
    onClose,
  }: FloatingPlayerToolsProps) => {
    const activeChord = useStore($ActiveChord);
    const preferences = useStore($chordPreferences);
    // Use Refs for direct DOM manipulation to avoid Re-renders specific to this component
    const circleRef = useRef<HTMLDivElement>(null);
    const textRef = useRef<HTMLSpanElement>(null);
    const lastBeatRef = useRef<number>(0);

    // Metronome Logic
    useEffect(() => {
      // If not playing, reset visuals
      if (!playing) {
        if (circleRef.current) circleRef.current.innerHTML = ''; // Clear beats
        if (textRef.current) textRef.current.textContent = '-';
        return;
      }

      if (!tempo || tempo <= 0) return;

      let animationFrameId: number;
      const secondsPerBeat = 60 / tempo;

      const loop = () => {
        const currentTime = playerRef.current?.getCurrentTime() || 0;
        const activeChordData = $ActiveChord.get();

        // 1. Calculate Standard Beat (Fallback or Base)
        const relativeTime = currentTime - startTime;
        const totalBeats = Math.floor(relativeTime / secondsPerBeat);
        const currentBeatInMeasure = (totalBeats % 4) + 1;

        // 2. Smart Visuals (Timeline)
        // Check if we are in a valid chord window
        if (activeChordData && activeChordData.nextChord) {
          const currentChordStart = activeChordData.startTime;
          const nextChordStart = activeChordData.nextChord.startTime;
          const duration = nextChordStart - currentChordStart;

          // How many beats in this chord duration? (Round to nearest integer)
          const beetsInDuration = Math.max(
            1,
            Math.round(duration / secondsPerBeat),
          );

          // Which beat are we on relative to the CHORD start?
          const timeInChord = currentTime - currentChordStart;
          const currentBeatInChord =
            Math.floor(timeInChord / secondsPerBeat) + 1;

          // Render Timeline Dots
          if (circleRef.current) {
            // Optimization: Only rebuild DOM if beat count changes or it's empty
            // For now, simpler to clear/rebuild or use a more complex diffing if performance suffers.
            // Let's try to be smart: Check if child count matches beetsInDuration
            if (circleRef.current.childElementCount !== beetsInDuration) {
              circleRef.current.innerHTML = '';
              for (let i = 0; i < beetsInDuration; i++) {
                const dot = document.createElement('div');
                // Base styles
                dot.className =
                  'h-2 w-2 rounded-full transition-all duration-75 bg-white/10';
                circleRef.current.appendChild(dot);
              }
              // Adjust container width/layout based on beats
              circleRef.current.className =
                'flex h-12 items-center justify-center gap-2 px-4 rounded-full bg-white/5 transition-all duration-75 min-w-[3rem]';
            }

            // Update active state of dots
            const dots = circleRef.current.children;
            for (let i = 0; i < dots.length; i++) {
              const dot = dots[i] as HTMLDivElement;
              // Logic: Past beats are lit, current beat flashes? Or simple progress bar style?
              // Let's do: Current beat is bright, passed are dim, future are dark.

              // 1-based index vs 0-based loop
              const beatIndex = i + 1;

              if (beatIndex < currentBeatInChord) {
                // Passed
                dot.className =
                  'h-2 w-2 rounded-full transition-all duration-75 bg-white/20';
              } else if (beatIndex === currentBeatInChord) {
                // Current Beat - Flash logic
                const beatPhase =
                  (timeInChord % secondsPerBeat) / secondsPerBeat;
                const isFlash = beatPhase < 0.2; // Quick flash start of beat

                if (isFlash) {
                  dot.className =
                    'h-3 w-3 rounded-full transition-all duration-75 bg-brand-purple-400 shadow-[0_0_10px_rgba(168,85,247,0.8)]';
                } else {
                  dot.className =
                    'h-2.5 w-2.5 rounded-full transition-all duration-75 bg-brand-purple-500/50';
                }
              } else {
                // Future
                dot.className =
                  'h-2 w-2 rounded-full transition-all duration-75 bg-white/5';
              }
            }

            // Hide the text ref number when in smart mode, or use it for something else?
            // User asked for "A - - - B", so the dots ARE the numbers.
            if (textRef.current) textRef.current.style.display = 'none';
          }
        } else {
          // FALLBACK: Standard Metronome (Just the circle pulsing)
          // This happens if no chords, or last chord (no next chord)
          // Revert container styles
          if (circleRef.current) {
            circleRef.current.innerHTML = ''; // Remove dots
            circleRef.current.className =
              'flex h-12 w-12 items-center justify-center rounded-full transition-all duration-75 bg-white/10';
            // Add the single circle element if we want? Or just use the container bg?
            // The original code used the container.
            const relativeTimeFallback = currentTime - startTime; // Use global song start
            const beatPhase =
              (relativeTimeFallback % secondsPerBeat) / secondsPerBeat;
            const isFlash = beatPhase < 0.15;

            if (isFlash) {
              circleRef.current.className =
                'flex h-12 w-12 items-center justify-center rounded-full transition-all duration-75 scale-110 bg-brand-purple-500 shadow-[0_0_20px_rgba(168,85,247,0.6)]';
            } else {
              circleRef.current.className =
                'flex h-12 w-12 items-center justify-center rounded-full transition-all duration-75 bg-white/10';
            }
          }

          if (textRef.current) {
            textRef.current.style.display = 'block'; // Show number
            // Only update text content if it changed
            if (
              lastBeatRef.current !== currentBeatInMeasure ||
              textRef.current.textContent === '-'
            ) {
              textRef.current.textContent = currentBeatInMeasure.toString();
              lastBeatRef.current = currentBeatInMeasure;
            }

            const relativeTimeFallback = currentTime - startTime;
            const beatPhase =
              (relativeTimeFallback % secondsPerBeat) / secondsPerBeat;
            const isFlash = beatPhase < 0.15;

            if (isFlash) {
              textRef.current.className = 'text-xl font-bold text-white';
            } else {
              textRef.current.className = 'text-xl font-bold text-white/50';
            }
          }
        }

        animationFrameId = requestAnimationFrame(loop);
      };

      loop();

      // Cleanup
      return () => {
        cancelAnimationFrame(animationFrameId);
        if (circleRef.current) {
          circleRef.current.innerHTML = '';
          circleRef.current.className =
            'flex h-12 w-12 items-center justify-center rounded-full transition-all duration-75 bg-white/10';
        }
        if (textRef.current) {
          textRef.current.className = 'text-xl font-bold text-white/50';
          textRef.current.style.display = 'block';
        }
      };
    }, [tempo, startTime, playerRef, playing]);

    return (
      <motion.div
        drag
        dragMomentum={false}
        initial={{ opacity: 0, scale: 0.9, y: 0, x: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="absolute bottom-24 right-4 z-[1000] flex w-[15rem] flex-col overflow-hidden rounded-2xl border border-white/10 bg-black/60 shadow-2xl backdrop-blur-xl"
      >
        {/* Header / Drag Handle */}
        <div className="flex cursor-move items-center justify-between bg-white/5 px-3 py-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-white/80">
            <MetronomeIcon className="h-3.5 w-3.5" />
            <span>Metrónomo y Acordes</span>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1 text-white/50 transition-colors hover:bg-white/10 hover:text-white"
          >
            <XMarkIcon className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex flex-col items-center justify-center p-4">
          {/* Metronome Visual */}
          <div className="flex items-center gap-4">
            {/* Active Chord Display (if available) */}
            {activeChord && (
              <div className="flex items-center gap-4">
                {/* Current Chord */}
                <div className="flex flex-col items-center justify-center">
                  <div className="flex items-baseline gap-0.5 text-2xl font-bold text-brand-purple-400">
                    <span>
                      {getNoteByType(
                        activeChord.rootNote,
                        activeChord.transpose,
                        preferences,
                      )}
                      {activeChord.chordQuality}
                    </span>
                    {activeChord.slashChord && (
                      <span className="text-lg opacity-80">
                        /
                        {getNoteByType(
                          activeChord.slashChord,
                          activeChord.transpose,
                          preferences,
                        )}
                      </span>
                    )}
                  </div>
                </div>

                {/* Ref-based circle / Timeline */}
                <div
                  ref={circleRef}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 transition-all duration-75"
                >
                  {/* Ref-based text - HIDDEN in smart mode */}
                  <span
                    ref={textRef}
                    className="text-xl font-bold text-white/50"
                  >
                    -
                  </span>
                </div>

                {/* Next Chord */}
                {activeChord.nextChord && (
                  <div className="flex flex-col items-center justify-center opacity-50">
                    <div className="flex items-baseline gap-0.5 text-lg font-bold text-white">
                      <span>
                        {getNoteByType(
                          activeChord.nextChord.rootNote,
                          activeChord.transpose,
                          preferences,
                        )}
                        {activeChord.nextChord.chordQuality}
                      </span>
                      {activeChord.nextChord.slashChord && (
                        <span className="text-sm opacity-80">
                          /
                          {getNoteByType(
                            activeChord.nextChord.slashChord,
                            activeChord.transpose,
                            preferences,
                          )}
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Fallback for No Chords (Just Tempo and Beat) */}
            {!activeChord && (
              <div className="flex items-center gap-4">
                <div className="flex flex-col items-end leading-none">
                  <span className="text-[10px] uppercase text-white/50">
                    Tempo
                  </span>
                  <span className="font-mono text-xl font-bold text-white">
                    {tempo}
                  </span>
                </div>
                <div
                  ref={circleRef}
                  className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10 transition-all duration-75"
                >
                  <span
                    ref={textRef}
                    className="text-xl font-bold text-white/50"
                  >
                    -
                  </span>
                </div>
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  },
);

FloatingPlayerTools.displayName = 'FloatingPlayerTools';
