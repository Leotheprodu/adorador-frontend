import {
  SongLyric,
  SongChord,
} from '@bands/[bandId]/canciones/_interfaces/songsInterface';
import { BeatMarker } from '../_interfaces/beatMapperInterfaces';
import { useEffect, useRef, memo } from 'react';

interface TimelineVisualizerProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  measureTaps: number[];
  beats: BeatMarker[];
  startTime: number;
  zoomLevel: number;
  lyrics?: SongLyric[];
  chords?: SongChord[];
  playing: boolean;
}

// 1. Beats Layer (The Heaviest part)
const BeatsLayer = memo(
  ({
    beats,
    duration,
    measureTaps,
    startTime,
  }: {
    beats: BeatMarker[];
    duration: number;
    measureTaps: number[];
    startTime: number;
  }) => {
    return (
      <>
        {/* Manual Taps (Draft) */}
        {measureTaps.map((t, i) => (
          <div
            key={`tap-${i}`}
            className="absolute bottom-0 top-4 z-10 w-0.5 bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.8)]"
            style={{ left: `${(t / (duration || 1)) * 100}%` }}
          >
            <span className="absolute -top-4 left-1/2 -translate-x-1/2 text-[9px] font-bold text-yellow-400">
              #{i + 1}
            </span>
          </div>
        ))}

        {/* Generated Grid - Only Measure Starts */}
        {beats
          .filter((b) => b.label === 1)
          .map((beat) => (
            <div
              key={beat.id}
              className="absolute bottom-0 top-0 z-10 h-full w-[1px] bg-brand-blue-400 opacity-80"
              style={{ left: `${(beat.time / (duration || 1)) * 100}%` }}
            >
              <span className="absolute bottom-6 left-1 ml-0.5 text-[9px] text-white/50">
                {beat.measure}
              </span>
            </div>
          ))}

        {/* Start Time Marker */}
        {startTime > 0 && (
          <div
            className="dashed absolute bottom-0 top-0 z-10 w-0.5 bg-green-500 opacity-80"
            style={{ left: `${(startTime / (duration || 1)) * 100}%` }}
          >
            <span className="absolute right-1 top-0 text-[9px] font-bold uppercase text-green-500">
              Start
            </span>
          </div>
        )}
      </>
    );
  },
);
BeatsLayer.displayName = 'BeatsLayer';

// 2. Lyrics Layer
const LyricsLayer = memo(
  ({ lyrics, duration }: { lyrics: SongLyric[]; duration: number }) => {
    return (
      <>
        {lyrics?.map((lyric) => {
          if (lyric.startTime <= 0) return null;
          return (
            <div
              key={`lyric-${lyric.id}`}
              className="absolute bottom-0 top-1/2 z-20 w-0.5 bg-cyan-400"
              style={{ left: `${(lyric.startTime / (duration || 1)) * 100}%` }}
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-cyan-500/20 px-1 text-[8px] text-cyan-200">
                L
              </div>
            </div>
          );
        })}
      </>
    );
  },
);
LyricsLayer.displayName = 'LyricsLayer';

// 3. Chords Layer (Updates often on record)
const ChordsLayer = memo(
  ({ chords, duration }: { chords: SongChord[]; duration: number }) => {
    return (
      <>
        {chords?.map((chord) => {
          if (chord.startTime <= 0) return null;
          return (
            <div
              key={`chord-${chord.id}`}
              className="absolute bottom-1/2 top-0 z-20 w-px bg-brand-purple-400 opacity-70"
              style={{ left: `${(chord.startTime / (duration || 1)) * 100}%` }}
            >
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-brand-purple-500/20 px-1 text-[10px] font-bold text-brand-purple-200">
                {chord.rootNote}
              </div>
            </div>
          );
        })}
      </>
    );
  },
);
ChordsLayer.displayName = 'ChordsLayer';

// Combined Grid for convenience (but now composed of memoized parts)
const TimelineGrid = memo(
  ({
    duration,
    measureTaps,
    beats,
    startTime,
    lyrics,
    chords,
  }: {
    duration: number;
    measureTaps: number[];
    beats: BeatMarker[];
    startTime: number;
    lyrics: SongLyric[];
    chords: SongChord[];
  }) => {
    return (
      <div className="pointer-events-none absolute inset-0">
        <BeatsLayer
          beats={beats}
          duration={duration}
          measureTaps={measureTaps}
          startTime={startTime}
        />
        <LyricsLayer lyrics={lyrics} duration={duration} />
        <ChordsLayer chords={chords} duration={duration} />
      </div>
    );
  },
);

TimelineGrid.displayName = 'TimelineGrid';

export const TimelineVisualizer = memo(
  ({
    currentTimeRef,
    duration,
    onSeek,
    measureTaps,
    beats,
    startTime,
    zoomLevel,
    lyrics = [],
    chords = [],
    playing,
  }: Omit<TimelineVisualizerProps, 'currentTime'> & {
    currentTimeRef: React.MutableRefObject<number>;
  }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const cursorRef = useRef<HTMLDivElement>(null);
    const timeLabelRef = useRef<HTMLDivElement>(null);
    const progressRef = useRef<HTMLDivElement>(null);

    // Refs for loop access
    const durationRef = useRef(duration);
    const zoomLevelRef = useRef(zoomLevel);

    useEffect(() => {
      durationRef.current = duration;
      zoomLevelRef.current = zoomLevel;
    }, [duration, zoomLevel]);

    // Animation Frame Loop
    useEffect(() => {
      let animationFrameId: number;
      // Track last update to interpolate if needed,
      // but trusting the passed ref is usually enough if it's updated frequenty by the player

      const animate = () => {
        // Always read latest from the passed ref (Source of Truth)
        const nowTime = currentTimeRef.current;
        const dur = durationRef.current || 1;

        // 1. Update Cursor
        if (cursorRef.current && dur > 0) {
          const pct = (nowTime / dur) * 100;
          cursorRef.current.style.left = `${pct}%`;

          if (timeLabelRef.current) {
            timeLabelRef.current.innerText = `${nowTime.toFixed(2)}s`;
          }
        }

        // 2. Update Progress Fill
        if (progressRef.current && dur > 0) {
          const pct = (nowTime / dur) * 100;
          progressRef.current.style.width = `${pct}%`;
        }

        // 3. Update Scroll
        if (containerRef.current && zoomLevelRef.current > 1 && playing) {
          const container = containerRef.current;
          const pct = nowTime / dur;
          const scrollPos =
            pct * container.scrollWidth - container.clientWidth / 2;
          container.scrollLeft = scrollPos;
        }

        animationFrameId = requestAnimationFrame(animate);
      };

      // Always run loop to catch up with ref changes even when paused?
      // Yes, because scrubbing changes the ref but not necessarily 'playing'.
      // Actually if we stop listening when not playing, seeking won't update UI.
      // So run always or event based? Run always is simpler for 60fps responsiveness.
      // Or just run when playing, and use a separate effect for pause updates?
      // Let's run always but throttle if needed. For now simple.
      animate();

      return () => cancelAnimationFrame(animationFrameId);
    }, [playing, currentTimeRef]); // Re-bind if ref object changes (unlikely) or playing changes

    return (
      <div
        ref={containerRef}
        className="custom-scrollbar relative mt-2 h-20 w-full select-none overflow-x-auto rounded-lg bg-black/40 ring-1 ring-white/5"
      >
        <div
          className="relative h-full"
          style={{ width: `${zoomLevel * 100}%`, minWidth: '100%' }}
        >
          <TimelineGrid
            duration={duration}
            measureTaps={measureTaps}
            beats={beats}
            startTime={startTime}
            lyrics={lyrics}
            chords={chords}
          />

          {/* Seek Bar Interaction */}
          <div
            className="absolute inset-0 z-30 cursor-pointer"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = e.clientX - rect.left;
              const pct = x / rect.width;
              onSeek(pct * duration);
            }}
          />

          {/* Progress Fill (Updated via Ref) */}
          <div
            ref={progressRef}
            className="pointer-events-none absolute bottom-0 left-0 top-0 bg-white/5"
            style={{ width: '0%' }}
          />

          {/* Cursor (Updated via Ref) */}
          <div
            ref={cursorRef}
            className="will-change-left pointer-events-none absolute bottom-0 top-0 z-40 w-0.5 bg-red-500"
            style={{ left: '0%' }}
          >
            <div
              ref={timeLabelRef}
              className="absolute -top-3 left-1/2 -translate-x-1/2 rounded bg-red-600 px-1 font-mono text-[8px] text-white"
            >
              0.00s
            </div>
          </div>
        </div>
      </div>
    );
  },
);
TimelineVisualizer.displayName = 'TimelineVisualizer';
