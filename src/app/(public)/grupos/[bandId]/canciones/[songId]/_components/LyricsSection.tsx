import { LyricsSectionProps } from '../_interfaces/songIdInterfaces';
import { LyricsProps } from '@bands/[bandId]/eventos/_interfaces/eventsInterface';
import { EditLyricsOptions } from './EditLyricsOptions';
import { LyricsGroupedCard } from './LyricsGroupedCard';
import { NoLyricsSong } from './NoLyricsSong';
import { $PlayerRef } from '@stores/player';
import { useStore } from '@nanostores/react';
import { useState, useEffect, useMemo, useRef } from 'react';
import { $ActiveChord, $SongChords } from '@/stores/activeChord';
import { DragDropContext } from '@hello-pangea/dnd';
import { useLyricsGlobalDragDrop } from '../_hooks/useLyricsGlobalDragDrop';
import { songStructure } from '@global/config/constants';

export const LyricsSection = ({
  params,
  songTitle,
  lyrics,
  isEditMode,
  isPracticeMode,
  transpose,
  showChords,
  lyricsScale,
  chordPreferences,
  refetchLyricsOfCurrentSong,
  mutateUploadLyricsByFile,
  onEditModeChange,
  isFollowMusic,
  isSyncChords,
}: LyricsSectionProps) => {
  const { handleDragEnd, handleDragStart, isDragging, lyricsOrder } =
    useLyricsGlobalDragDrop({
      lyrics: lyrics ?? [],
      params,
      refetchLyricsOfCurrentSong,
    });

  // Agrupar lyrics basados en el orden actual (optimista)
  // Esto reemplaza el uso de lyricsGrouped prop para el renderizado del drag & drop
  const optimisticallyGroupedLyrics = useMemo(() => {
    // Si no hay lyrics, retornar vacío
    if (!lyricsOrder || lyricsOrder.length === 0) return [];

    // Agrupar por structura contigua
    // Importante: No agrupar todos los Versos juntos si están separados por un Coro.
    // Verse 1 -> Chorus -> Verse 2 deben ser 3 grupos distintos.

    // Primero, ordenar por posición
    const sorted = [...lyricsOrder].sort((a, b) => a.position - b.position);

    const result: [number, string, LyricsProps[]][] = [];
    if (sorted.length === 0) return result;

    let currentGroupLyrics: LyricsProps[] = [];
    let currentStructureId = sorted[0].structure.id;

    // Helper para obtener titulo
    const getStructureTitle = (id: number, lyricsInGroup: LyricsProps[]) => {
      const structConfig = songStructure.find((s) => s.id === id);
      return (
        structConfig?.title || lyricsInGroup[0]?.structure?.title || 'verse'
      );
    };

    sorted.forEach((lyric) => {
      if (lyric.structure.id === currentStructureId) {
        currentGroupLyrics.push(lyric);
      } else {
        // Push previous group
        if (currentGroupLyrics.length > 0) {
          result.push([
            currentStructureId,
            getStructureTitle(currentStructureId, currentGroupLyrics),
            currentGroupLyrics,
          ]);
        }
        // Start new group
        currentStructureId = lyric.structure.id;
        currentGroupLyrics = [lyric];
      }
    });

    // Push last group
    if (currentGroupLyrics.length > 0) {
      result.push([
        currentStructureId,
        getStructureTitle(currentStructureId, currentGroupLyrics),
        currentGroupLyrics,
      ]);
    }

    return result;
  }, [lyricsOrder]);

  const playerRef = useStore($PlayerRef);
  const [activeLineId, setActiveLineId] = useState<number | null>(null);
  const [activeChordId, setActiveChordId] = useState<number | null>(null);

  // Detect User Scroll/Interaction
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const scrollTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleUserInteraction = () => {
      setIsUserScrolling(true);

      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      scrollTimeoutRef.current = setTimeout(() => {
        setIsUserScrolling(false);
      }, 3000); // Resume auto-scroll after 3 seconds of inactivity
    };

    window.addEventListener('wheel', handleUserInteraction, {
      passive: true,
    });
    window.addEventListener('touchmove', handleUserInteraction, {
      passive: true,
    });
    window.addEventListener('keydown', handleUserInteraction, {
      passive: true,
    }); // Optional: if using keyboard to scroll

    return () => {
      window.removeEventListener('wheel', handleUserInteraction);
      window.removeEventListener('touchmove', handleUserInteraction);
      window.removeEventListener('keydown', handleUserInteraction);
      if (scrollTimeoutRef.current) clearTimeout(scrollTimeoutRef.current);
    };
  }, []);

  // Flatten chords for efficient lookup
  // Memoize this to avoid re-calculation on every render
  const allChords = useMemo(() => {
    if (!lyrics) return [];
    const flattened = lyrics
      .flatMap((line) =>
        (line.chords || []).map((chord) => ({
          ...chord,
          lineId: line.id,
        })),
      )
      .sort((a, b) => (a.startTime ?? 0) - (b.startTime ?? 0)); // Ensure sorted by time for next/prev logic

    // Sync to global store for tools
    $SongChords.set(
      flattened.map((c) => ({
        rootNote: c.rootNote,
        chordQuality: c.chordQuality,
        slashChord: c.slashChord,
        id: c.id,
        startTime: c.startTime ?? 0,
      })),
    );

    return flattened;
  }, [lyrics]);

  // Reset active states when features are disabled
  useEffect(() => {
    if (!isFollowMusic) setActiveLineId(null);
  }, [isFollowMusic]);

  useEffect(() => {
    if (!isSyncChords) setActiveChordId(null);
  }, [isSyncChords]);

  // Track active line and chord with optimized loop
  useEffect(() => {
    if (
      (!isFollowMusic && !isSyncChords) ||
      !lyrics ||
      lyrics.length === 0 ||
      !playerRef
    )
      return;

    let animationFrameId: number;

    const loop = () => {
      const currentTime = playerRef.getCurrentTime() || 0;

      // 1. Sync Lyrics (Line Highlighting)
      if (isFollowMusic) {
        const activeLine = lyrics.reduce(
          (prev, curr) => {
            const currTime = curr.startTime ?? -1;
            const prevTime = prev?.startTime ?? -1;

            if (
              currTime > -1 &&
              currTime <= currentTime &&
              currTime > prevTime
            ) {
              return curr;
            }
            return prev;
          },
          null as (typeof lyrics)[0] | null,
        );

        const newActiveLineId = activeLine ? activeLine.id : null;
        setActiveLineId((prev) =>
          prev !== newActiveLineId ? newActiveLineId : prev,
        );
      }

      // 2. Sync Chords (Chord Highlighting & Store Update)
      // We always track the active chord for the FloatingPlayerTools ($ActiveChord),
      // but we only verify isSyncChords for the local highlighting (setActiveChordId).
      if (isFollowMusic) {
        // Changed from isSyncChords to isFollowMusic
        // Find the index of the active chord
        const activeChordIndex = allChords.findIndex((chord, index) => {
          const currTime = chord.startTime ?? -1;
          const nextTime = allChords[index + 1]?.startTime ?? Infinity; // Use next chord start as end of current
          return (
            currTime > 0 && currTime <= currentTime && currentTime < nextTime
          );
        });

        const activeChord =
          activeChordIndex !== -1 ? allChords[activeChordIndex] : null;
        const nextChord =
          activeChordIndex !== -1 && activeChordIndex + 1 < allChords.length
            ? allChords[activeChordIndex + 1]
            : null;

        const newActiveChordId = activeChord ? activeChord.id : null;

        // Update Store (Global)
        // Always update store if we found a chord and music is following
        if (activeChord) {
          const { rootNote, chordQuality, slashChord, id } = activeChord;
          // Only update if data changed to avoid thrashing (Nanostores handles this somewhat, but good to be careful)
          // Actually, since we have startTime logic in the store consumer, we should just set it.
          $ActiveChord.set({
            rootNote,
            chordQuality,
            slashChord,
            id,
            transpose,
            startTime: activeChord.startTime ?? 0,
            nextChord: nextChord
              ? {
                  rootNote: nextChord.rootNote,
                  chordQuality: nextChord.chordQuality,
                  slashChord: nextChord.slashChord,
                  id: nextChord.id,
                  startTime: nextChord.startTime ?? 0,
                }
              : null,
          });
        } else {
          $ActiveChord.set(null);
        }

        // Update Local State (Highlighting)
        if (isSyncChords) {
          if (newActiveChordId !== activeChordId) {
            setActiveChordId(newActiveChordId);
          }
        } else {
          setActiveChordId(null);
        }
      } else {
        setActiveChordId(null);
        $ActiveChord.set(null);
      }

      animationFrameId = requestAnimationFrame(loop);
    };

    loop();
    return () => cancelAnimationFrame(animationFrameId);
  }, [
    isFollowMusic,
    isSyncChords,
    lyrics,
    playerRef,
    allChords,
    transpose,
    activeChordId,
  ]);

  // Sync transpose changes to store if active chord exists
  useEffect(() => {
    const current = $ActiveChord.get();
    if (current && current.transpose !== transpose) {
      $ActiveChord.set({ ...current, transpose });
    }
  }, [transpose]);

  return (
    <section className="px-4">
      <div className="mx-auto flex max-w-4xl flex-col gap-6">
        {lyrics && lyrics.length > 0 ? (
          <>
            {isEditMode ? (
              <EditLyricsOptions
                params={params}
                songTitle={songTitle}
                refetchLyricsOfCurrentSong={refetchLyricsOfCurrentSong}
                mutateUploadLyricsByFile={mutateUploadLyricsByFile}
                existingLyrics={lyrics}
                isExpanded={true}
                onClose={() => onEditModeChange(false)}
              />
            ) : (
              <DragDropContext
                onDragEnd={handleDragEnd}
                onDragStart={handleDragStart}
              >
                {optimisticallyGroupedLyrics.map(
                  ([structureId, structureTitle, groupLyrics], groupIndex) => (
                    <LyricsGroupedCard
                      key={groupIndex}
                      groupIndex={groupIndex} // Pass index to unique-ify droppableId
                      structure={structureTitle}
                      structureId={structureId}
                      lyrics={groupLyrics}
                      refetchLyricsOfCurrentSong={refetchLyricsOfCurrentSong}
                      params={params}
                      chordPreferences={chordPreferences}
                      lyricsOfCurrentSong={lyrics}
                      transpose={transpose}
                      showChords={showChords}
                      lyricsScale={lyricsScale}
                      isPracticeMode={isPracticeMode}
                      activeLineId={activeLineId}
                      activeChordId={activeChordId}
                      isUserScrolling={isUserScrolling}
                      isDragging={isDragging}
                    />
                  ),
                )}
              </DragDropContext>
            )}
          </>
        ) : (
          <NoLyricsSong
            mutateUploadLyricsByFile={mutateUploadLyricsByFile}
            refetchLyricsOfCurrentSong={refetchLyricsOfCurrentSong}
            LyricsOfCurrentSong={lyrics ?? []}
            params={params}
            songTitle={songTitle}
          />
        )}
      </div>
    </section>
  );
};
