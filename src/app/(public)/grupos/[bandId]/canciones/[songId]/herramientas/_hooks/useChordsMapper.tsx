import { useState, useEffect, useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';
import { SongLyric, SongChord } from '../../../_interfaces/songsInterface';
import { useSaveChordsData } from '../_services/lyricsService';
import { BeatMarker } from '../_interfaces/beatMapperInterfaces';

export type QuantizationMode = '1/4' | '1/2' | '1/1' | 'off';

interface UseChordsMapperProps {
  songId: string;
  bandId: string;
  initialLyrics?: SongLyric[];
  currentTimeRef: React.MutableRefObject<number>;
  beats?: BeatMarker[];
  bpm?: number | null;
  onSeek: (time: number) => void;
}

export const useChordsMapper = ({
  songId,
  bandId,
  initialLyrics = [],
  currentTimeRef,
  beats = [],
  bpm,
  onSeek,
}: UseChordsMapperProps) => {
  // Flatten chords from lyrics for easier state management
  const initialChords = useMemo(() => {
    return initialLyrics.flatMap((l) =>
      (l.chords || []).map((c) => ({
        ...c,
        lyricId: l.id,
      })),
    );
  }, [initialLyrics]);

  const [chords, setChords] = useState<SongChord[]>(initialChords);
  const [activeChordId, setActiveChordId] = useState<number | null>(null);

  const [quantizationMode, setQuantizationMode] =
    useState<QuantizationMode>('1/2');

  // Track saved state
  const [savedChords, setSavedChords] = useState<SongChord[]>(initialChords);

  // Service
  const { mutate: saveChords, isPending: isSaving } = useSaveChordsData(
    bandId,
    songId,
  );

  // Auto-select logic moved to specific handlers to avoid useEffect cycles
  // useEffect removed to prevent double-rendering

  const handleRecordChord = useCallback(() => {
    // 1. Calculate the new state logic first (Atomic Calculation)
    const currentT = currentTimeRef.current;

    // Find target index to update
    let targetIndex = -1;
    if (activeChordId) {
      const idx = chords.findIndex((c) => c.id === activeChordId);
      if (idx !== -1 && chords[idx].startTime === 0) {
        targetIndex = idx;
      }
    }
    // Fallback: Find first unassigned
    if (targetIndex === -1) {
      targetIndex = chords.findIndex((c) => c.startTime === 0);
    }

    if (targetIndex === -1) {
      toast('Todos los acordes están asignados', { icon: '👏' });
      return;
    }

    // Calculate Snap Time
    let finalTime = currentT;
    if (beats && beats.length > 0 && quantizationMode !== 'off') {
      const candidateBeats = beats.filter((b) => {
        if (quantizationMode === '1/1') return b.label === 1;
        if (quantizationMode === '1/2') return b.label === 1 || b.label === 3;
        return true;
      });

      if (candidateBeats.length > 0) {
        const closestBeat = candidateBeats.reduce((prev, curr) => {
          return Math.abs(curr.time - currentT) < Math.abs(prev.time - currentT)
            ? curr
            : prev;
        });
        finalTime = closestBeat.time;
      }
    }

    // 2. Prepare New Data
    const newChords = [...chords];
    newChords[targetIndex] = {
      ...newChords[targetIndex],
      startTime: finalTime,
    };

    // 3. Find Next ID (Synchronously)
    // We look for the first unassigned chord AFTER the one we just filled (circularly or linearly?)
    // Linearly usually makes sense for chords.
    let nextId: number | null = null;
    const nextUnassigned = newChords.find((c) => c.startTime === 0);
    if (nextUnassigned) {
      nextId = nextUnassigned.id;
    }

    // 4. ATOMIC UPDATE: Set both states. React batching handles the rest.
    setChords(newChords);
    setActiveChordId(nextId);
  }, [chords, activeChordId, beats, quantizationMode, currentTimeRef]);

  const handleManualAdjust = useCallback(
    (id: number, direction: 1 | -1) => {
      const step = bpm ? 60 / bpm : 0.1;
      setChords((prev) =>
        prev.map((c) => {
          if (c.id === id) {
            return {
              ...c,
              startTime: Math.max(0, c.startTime + step * direction),
            };
          }
          return c;
        }),
      );
    },
    [bpm],
  );

  const handleClearDetail = useCallback((id: number) => {
    setChords((prev) =>
      prev.map((c) => (c.id === id ? { ...c, startTime: 0 } : c)),
    );
    setActiveChordId(id);
  }, []);

  const handleClearAll = useCallback(() => {
    if (confirm('¿Seguro que quieres borrar todos los tiempos de acordes?')) {
      // Create new clean array
      const cleanChords = chords.map((c) => ({ ...c, startTime: 0 }));
      setChords(cleanChords);

      // Manually set first one active (since effect is gone)
      if (cleanChords.length > 0) {
        setActiveChordId(cleanChords[0].id);
      } else {
        setActiveChordId(null);
      }
    }
  }, [chords]);

  // Keyboard Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (['INPUT', 'TEXTAREA'].includes(target.tagName)) return;

      // Record Chord (A)
      if (e.key.toLowerCase() === 'a') {
        handleRecordChord();
      }

      // Undo (Ctrl + Z)
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z') {
        e.preventDefault();

        // Safe Logic: Read state first, then update
        // Find the chord with the highest start time (last recorded)
        const assigned = chords.filter((c) => c.startTime > 0);
        if (assigned.length === 0) return;

        const last = assigned.reduce((max, c) =>
          c.startTime > max.startTime ? c : max,
        );

        // Find rewind point
        // 1 measure approx 2s if no bpm, or 60/bpm * 4
        const oneMeasure = bpm ? (60 / bpm) * 4 : 2;

        // Find the one before 'last' or just go back
        const previous = assigned
          .filter((c) => c.id !== last.id)
          .reduce((max, c) => (c.startTime > max.startTime ? c : max), {
            startTime: 0,
          } as SongChord);

        const rewindTime =
          previous.startTime > 0
            ? previous.startTime
            : Math.max(0, last.startTime - oneMeasure);

        // Perform State Update (Pure)
        setChords((prev) =>
          prev.map((c) => (c.id === last.id ? { ...c, startTime: 0 } : c)),
        );

        // Perform Side Effects
        setActiveChordId(last.id);
        onSeek(rewindTime);
        toast('Deshacer: Acorde listo para grabar', { icon: '↩️' });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleRecordChord, chords, bpm, onSeek]);

  const handleSave = useCallback(() => {
    // 1. Filter only modified chords
    const payload = chords
      .filter((c) => {
        const saved = savedChords.find((s) => s.id === c.id);
        return saved && Math.abs(c.startTime - saved.startTime) > 0.001;
      })
      .map((c) => ({
        id: c.id,
        startTime: c.startTime,
      }));

    if (payload.length === 0) {
      toast('No hay cambios para guardar', { icon: 'info' });
      return;
    }

    saveChords(
      { chords: payload },
      {
        onSuccess: () => {
          toast.success(`Guardados ${payload.length} acordes`);
          setSavedChords([...chords]);
        },
        onError: () => toast.error('Error al guardar acordes'),
      },
    );
  }, [chords, savedChords, saveChords]);

  const isChordDirty = useCallback(
    (id: number) => {
      const current = chords.find((c) => c.id === id);
      const saved = savedChords.find((c) => c.id === id);
      if (!current || !saved) return false;
      return Math.abs(current.startTime - saved.startTime) > 0.001;
    },
    [chords, savedChords],
  );

  return useMemo(
    () => ({
      chords,
      activeChordId,
      handleSave,
      isSaving,
      handleClearDetail,
      handleClearAll,
      handleRecordChord,
      handleManualAdjust,
      isChordDirty,
      adjustmentUnit: bpm ? '1 Beat' : '0.1s',
      quantizationMode,
      setQuantizationMode,
    }),
    [
      chords,
      activeChordId,
      handleSave,
      isSaving,
      handleClearDetail,
      handleClearAll,
      handleRecordChord,
      handleManualAdjust,
      isChordDirty,
      bpm,
      quantizationMode,
      setQuantizationMode,
    ],
  );
};
