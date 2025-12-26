import { useRef, useEffect } from 'react';
import { BeatMarker } from '../_interfaces/beatMapperInterfaces';

interface TimelineVisualizerProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
  measureTaps: number[];
  beats: BeatMarker[];
  startTime: number;
  zoomLevel: number;
}

export const TimelineVisualizer = ({
  currentTime,
  duration,
  onSeek,
  measureTaps,
  beats,
  startTime,
  zoomLevel,
}: TimelineVisualizerProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to keep cursor in view when playing
  useEffect(() => {
    if (containerRef.current && zoomLevel > 1) {
      // Simple logic: maintain cursor centered-ish
      const container = containerRef.current;
      const pct = currentTime / (duration || 1);
      const scrollPos = pct * container.scrollWidth - container.clientWidth / 2;
      container.scrollLeft = scrollPos;
    }
  }, [currentTime, duration, zoomLevel]);

  return (
    <div
      ref={containerRef}
      className="custom-scrollbar relative mt-2 h-20 w-full select-none overflow-x-auto rounded-lg bg-black/40 ring-1 ring-white/5"
    >
      <div
        className="relative h-full"
        style={{ width: `${zoomLevel * 100}%`, minWidth: '100%' }}
      >
        {/* Seek Bar Interaction Layer */}
        <div
          className="absolute inset-0 z-20 cursor-pointer"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const pct = x / rect.width;
            onSeek(pct * duration);
          }}
        />

        {/* Progress Fill */}
        <div
          className="pointer-events-none absolute bottom-0 left-0 top-0 bg-white/5"
          style={{ width: `${(currentTime / (duration || 1)) * 100}%` }}
        />

        {/* Current Time Cursor */}
        <div
          className="pointer-events-none absolute bottom-0 top-0 z-30 w-0.5 bg-red-500 transition-all duration-75"
          style={{ left: `${(currentTime / (duration || 1)) * 100}%` }}
        >
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded bg-red-600 px-1 font-mono text-[8px] text-white">
            {currentTime.toFixed(2)}s
          </div>
        </div>

        {/* Manual Taps (Draft) */}
        {measureTaps.map((t, i) => (
          <div
            key={`tap-${i}`}
            className="pointer-events-none absolute bottom-0 top-4 z-10 w-0.5 bg-yellow-400 shadow-[0_0_8px_rgba(250,204,21,0.8)]"
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
              className="pointer-events-none absolute bottom-0 top-0 z-10 h-full w-[1px] bg-brand-blue-400 opacity-80"
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
            className="dashed pointer-events-none absolute bottom-0 top-0 z-10 w-0.5 bg-green-500 opacity-80"
            style={{ left: `${(startTime / (duration || 1)) * 100}%` }}
          >
            <span className="absolute right-1 top-0 text-[9px] font-bold uppercase text-green-500">
              Start
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
