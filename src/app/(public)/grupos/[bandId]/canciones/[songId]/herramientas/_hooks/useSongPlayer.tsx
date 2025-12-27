import { useState, useRef, useEffect, useCallback } from 'react';
import ReactPlayer from 'react-player';

export const useSongPlayer = () => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const playerRef = useRef<ReactPlayer>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const handleProgress = useCallback(
    ({ playedSeconds }: { playedSeconds: number }) => {
      setCurrentTime(playedSeconds);
    },
    [],
  );

  const handleDuration = useCallback((d: number) => {
    setDuration(d);
  }, []);

  const handleSeek = (value: number) => {
    if (playerRef.current) {
      playerRef.current.seekTo(value, 'seconds');
      setCurrentTime(value);
    }
  };

  const togglePlay = () => setPlaying((p) => !p);

  return {
    isMounted,
    playerRef,
    playing,
    setPlaying,
    togglePlay,
    currentTime,
    duration,
    handleProgress,
    handleDuration,
    handleSeek,
  };
};
