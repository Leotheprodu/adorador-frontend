import { useState, useRef, useEffect, useCallback } from 'react';
import ReactPlayer from 'react-player';
import toast from 'react-hot-toast';
import { BeatMarker } from '../_interfaces/beatMapperInterfaces';
import { useSaveSongData } from '../_services/beatMapperService';
import { $SelectedSong } from '@global/stores/player';

interface UseBeatMapperProps {
  songId: string;
  bandId: string;
  initialBpm?: number;
  initialStartTime?: number;
}

export const useBeatMapper = ({
  songId,
  bandId,
  initialBpm,
  initialStartTime,
}: UseBeatMapperProps) => {
  // Mounting State
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Player State
  const playerRef = useRef<ReactPlayer>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const currentTimeRef = useRef(0);
  const [duration, setDuration] = useState(0);

  // Data State
  const [startTime, setStartTime] = useState<number>(initialStartTime || 0);
  const [beats, setBeats] = useState<BeatMarker[]>([]);
  const [measureTaps, setMeasureTaps] = useState<number[]>([]);
  const [bpm, setBpm] = useState<number | null>(initialBpm || null);

  // Settings
  const [timeSignature, setTimeSignature] = useState(4);
  const [zoomLevel, setZoomLevel] = useState(5);

  // Service
  const { mutate: saveSong, isPending: isSaving } = useSaveSongData(
    bandId,
    songId,
  );

  // Initialize from props if available (handling updates)
  useEffect(() => {
    if (initialBpm) setBpm(initialBpm);
    if (initialStartTime) setStartTime(initialStartTime);
  }, [initialBpm, initialStartTime]);

  // Player Handlers
  const handleProgress = useCallback(
    ({ playedSeconds }: { playedSeconds: number }) => {
      currentTimeRef.current = playedSeconds;
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
      currentTimeRef.current = value;
      setCurrentTime(value);
    }
  };

  const togglePlay = () => setPlaying((p) => !p);

  // Measure Logic
  const calculateFromMeasures = useCallback(
    (taps: number[]) => {
      const intervals: number[] = [];
      for (let i = 1; i < taps.length; i++) {
        intervals.push(taps[i] - taps[i - 1]);
      }
      if (intervals.length === 0) return;

      const avgMeasureDuration =
        intervals.reduce((a, b) => a + b, 0) / intervals.length;
      // Use floating point for better precision to avoid drift
      const rawBpm = (timeSignature * 60) / avgMeasureDuration;
      // Round to 2 decimals for display/storage but keep precision reasonably high
      setBpm(parseFloat(rawBpm.toFixed(2)));
    },
    [timeSignature],
  );

  const handleTapMeasure = useCallback(() => {
    const now = currentTime;
    const newTaps = [...measureTaps, now].sort((a, b) => a - b);
    setMeasureTaps(newTaps);

    if (newTaps.length >= 2) {
      calculateFromMeasures(newTaps);
    }
  }, [currentTime, measureTaps, calculateFromMeasures]);

  const generateGrid = useCallback(
    (start: number, tempo: number, dur: number, signature: number) => {
      if (!tempo || !dur) return [];

      const secondsPerBeat = 60 / tempo;
      const newBeats: BeatMarker[] = [];
      let time = start;
      let measure = 1;
      let beatLabel = 1;
      let iterations = 0;

      while (time < dur && iterations < 10000) {
        if (time >= 0) {
          newBeats.push({
            time: time,
            label: beatLabel,
            measure: measure,
            id: `grid-${measure}-${beatLabel}`,
            isProjected: true,
          });
        }
        time += secondsPerBeat;
        beatLabel++;
        if (beatLabel > signature) {
          beatLabel = 1;
          measure++;
        }
        iterations++;
      }
      return newBeats;
    },
    [],
  );

  const applyProjection = () => {
    if (!bpm || measureTaps.length === 0 || !duration) return;

    const secondsPerBeat = 60 / bpm;
    const measureDuration = secondsPerBeat * timeSignature;
    const firstTapTime = measureTaps[0];
    const measuresBefore = Math.floor(firstTapTime / measureDuration);
    let calculatedStartTime = firstTapTime - measuresBefore * measureDuration;

    if (calculatedStartTime < 0) calculatedStartTime = 0;

    setStartTime(calculatedStartTime);
    const newBeats = generateGrid(
      calculatedStartTime,
      bpm,
      duration,
      timeSignature,
    );
    setBeats(newBeats);
    setMeasureTaps([]);
  };

  const adjustStartTime = (amountMs: number) => {
    setStartTime((prev) => Math.max(0, prev + amountMs / 1000));
  };

  const handleClear = () => {
    setStartTime(0);
    setBpm(null);
    setMeasureTaps([]);
    setBeats([]);
  };

  const handleSave = () => {
    saveSong(
      {
        tempo: bpm || 0,
        startTime: startTime,
      },
      {
        onSuccess: () => {
          toast.success(
            `Guardado: ${bpm} BPM, Inicio: ${startTime.toFixed(3)}s`,
          );
          const currentSelected = $SelectedSong.get();
          if (currentSelected && currentSelected.id === parseInt(songId)) {
            $SelectedSong.set({
              ...currentSelected,
              tempo: bpm || 0,
              startTime: startTime,
            });
          }
        },
        onError: () => toast.error('Error al guardar'),
      },
    );
  };

  // Re-generate grid when params change
  useEffect(() => {
    if (bpm && duration) {
      const newBeats = generateGrid(startTime, bpm, duration, timeSignature);
      setBeats(newBeats);
    }
  }, [startTime, bpm, duration, timeSignature, generateGrid]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT') return;

      if (e.code === 'Space') {
        e.preventDefault();
        togglePlay();
      } else if (e.key.toLowerCase() === 'b') {
        handleTapMeasure();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleTapMeasure]);

  return {
    isMounted,
    playerRef,
    playing,
    setPlaying,
    togglePlay,
    handleProgress,
    handleDuration,
    handleSeek,
    currentTime,
    currentTimeRef,
    duration,
    startTime,
    beats,
    measureTaps,
    handleTapMeasure,
    bpm,
    applyProjection,
    adjustStartTime,
    handleClear,
    handleSave,
    isSaving,
    timeSignature,
    setTimeSignature,
    zoomLevel,
    setZoomLevel,
  };
};
