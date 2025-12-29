import { useState, useRef, useEffect, useCallback } from 'react';
import ReactPlayer from 'react-player';

export const useSongPlayer = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const playerRef = useRef<ReactPlayer>(null);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);

  // Use Ref for high-frequency time updates to avoid re-renders
  const currentTimeRef = useRef(0);

  // Still expose a state for non-critical UI if needed, but throttle it?
  // No, let's force consumers to use Ref for critical paths.
  // If we need a display update, components should subscribe or use their own RAF loops (like TimelineVisualizer).
  // We can provide a throttled state for "rough" display (e.g. at 1s intervals) if needed, but not 60fps.

  const handleProgress = useCallback(
    ({ playedSeconds }: { playedSeconds: number }) => {
      currentTimeRef.current = playedSeconds;
    },
    [],
  );

  const handleDuration = useCallback((d: number) => {
    setDuration(d);
  }, []);

  const handleSeek = (value: number) => {
    // Optimistic update
    currentTimeRef.current = value;

    if (playerRef.current) {
      playerRef.current.seekTo(value, 'seconds');
    }
  };

  const togglePlay = () => setPlaying((p) => !p);

  return {
    isMounted,
    playerRef,
    playing,
    setPlaying,
    togglePlay,
    currentTimeRef, // Expose Ref instead of State
    duration,
    handleProgress,
    handleDuration,
    handleSeek,
  };
};
