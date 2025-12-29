import { useState, useEffect, useCallback, useMemo } from 'react';
import toast from 'react-hot-toast';
import { SongLyric } from '../../../_interfaces/songsInterface';
import { useSaveLyricsData } from '../_services/lyricsService';

interface UseLyricsMapperProps {
  songId: string;
  bandId: string;
  initialLyrics?: SongLyric[];
  currentTimeRef: React.MutableRefObject<number>;
}

export const useLyricsMapper = ({
  songId,
  bandId,
  initialLyrics = [],
  currentTimeRef,
}: UseLyricsMapperProps) => {
  const [lyrics, setLyrics] = useState<SongLyric[]>(initialLyrics);
  const [activeLineId, setActiveLineId] = useState<number | null>(null);

  // Track the "saved" state of lyrics for dirty checking
  const [savedLyrics, setSavedLyrics] = useState<SongLyric[]>(initialLyrics);

  // Service
  const { mutate: saveLyrics, isPending: isSaving } = useSaveLyricsData(
    bandId,
    songId,
  );

  // Auto-select next unassigned if none selected or if active one gets filled
  useEffect(() => {
    if (!activeLineId) {
      const next = lyrics.find((l) => l.startTime === 0);
      if (next) setActiveLineId(next.id);
    }
  }, [lyrics, activeLineId]);

  const handleRecordLine = useCallback(() => {
    setLyrics((prev) => {
      // Logic:
      // 1. If we have an activeLineId that corresponds to an unassigned line (startTime === 0), fill that one.
      // 2. If activeLineId is null or assigned, find the first unassigned line.

      let targetIndex = -1;

      // Try to find index of activeLineId
      if (activeLineId) {
        const idx = prev.findIndex((l) => l.id === activeLineId);
        if (idx !== -1 && prev[idx].startTime === 0) {
          targetIndex = idx;
        }
      }

      // Fallback: Find first unassigned
      if (targetIndex === -1) {
        targetIndex = prev.findIndex((l) => l.startTime === 0);
      }

      if (targetIndex === -1) {
        toast('Todas las líneas están asignadas', { icon: '👏' });
        return prev;
      }

      const newLyrics = [...prev];
      newLyrics[targetIndex] = {
        ...newLyrics[targetIndex],
        startTime: currentTimeRef.current,
      };

      setActiveLineId(null);

      return newLyrics;
    });
  }, [currentTimeRef, activeLineId]);

  const handleManualAdjust = useCallback((id: number, ms: number) => {
    setLyrics((prev) =>
      prev.map((l) => {
        if (l.id === id) {
          return { ...l, startTime: Math.max(0, l.startTime + ms / 1000) };
        }
        return l;
      }),
    );
  }, []);

  const handleClearDetail = useCallback((id: number) => {
    setLyrics((prev) =>
      prev.map((l) => (l.id === id ? { ...l, startTime: 0 } : l)),
    );
    setActiveLineId(id);
  }, []);

  const handleClearAll = useCallback(() => {
    if (confirm('¿Seguro que quieres borrar todos los tiempos?')) {
      setLyrics((prev) => prev.map((l) => ({ ...l, startTime: 0 })));
      setActiveLineId(null);
    }
  }, []);

  // Keyboard Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT') return;
      if (e.key.toLowerCase() === 'l') {
        handleRecordLine();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleRecordLine]);

  // Save changes
  const handleSave = useCallback(() => {
    const payload = lyrics.map((l) => ({
      id: l.id,
      startTime: l.startTime,
    }));

    saveLyrics(payload, {
      onSuccess: () => {
        toast.success('Lyrics sincronizados guardados');
        setSavedLyrics([...lyrics]);
      },
      onError: () => toast.error('Error al guardar lyrics'),
    });
  }, [lyrics, saveLyrics]);

  const isLineDirty = useCallback(
    (id: number) => {
      const current = lyrics.find((l) => l.id === id);
      const saved = savedLyrics.find((l) => l.id === id);
      if (!current || !saved) return false;
      return Math.abs(current.startTime - saved.startTime) > 0.001;
    },
    [lyrics, savedLyrics],
  );

  return useMemo(
    () => ({
      lyrics,
      activeLineId,
      handleSave,
      isSaving,
      handleClearDetail,
      handleClearAll,
      handleRecordLine,
      handleManualAdjust,
      isLineDirty,
    }),
    [
      lyrics,
      activeLineId,
      handleSave,
      isSaving,
      handleClearDetail,
      handleClearAll,
      handleRecordLine,
      handleManualAdjust,
      isLineDirty,
    ],
  );
};
