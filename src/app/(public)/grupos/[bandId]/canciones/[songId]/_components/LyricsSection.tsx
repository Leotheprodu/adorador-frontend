import { LyricsSectionProps } from '../_interfaces/songIdInterfaces';
import { LyricsProps } from '@bands/[bandId]/eventos/_interfaces/eventsInterface';
import { EditLyricsOptions } from './EditLyricsOptions';
import { LyricsGroupedCard } from './LyricsGroupedCard';
import { NoLyricsSong } from './NoLyricsSong';
import { $PlayerRef } from '@stores/player';
import { useStore } from '@nanostores/react';
import { useState, useEffect, useMemo, useRef } from 'react';
import { $ActiveChord, $SongChords } from '@/stores/activeChord';
import { DragDropContext, DropResult } from '@hello-pangea/dnd';
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

    // Agrupar por structura
    // Mantener el orden de grupos según aparecen en la canción?
    // O según un orden predefinido?
    // Normalmente queremos que aparezcan en orden de posición.

    // Primero, ordenar por posición (ya deberían estar, pero por seguridad)
    const sorted = [...lyricsOrder].sort((a, b) => a.position - b.position);

    const groupedMap = new Map<number, LyricsProps[]>();

    sorted.forEach((lyric) => {
      const structId = lyric.structure.id;
      if (!groupedMap.has(structId)) {
        groupedMap.set(structId, []);
      }
      groupedMap.get(structId)?.push(lyric);
    });

    // Convertir a array de tuplas [structureId, lyrics[]]
    // El orden de los grupos debe ser el orden de aparición (como hace el backend probablemente).
    // Si iteramos sorted, el primer structId que encontramos es el primero. etc.
    // Map conserva orden de inserción.

    const result: [number, string, LyricsProps[]][] = [];
    for (const [id, groupLyrics] of groupedMap) {
      // Encontrar el item original o estructura para saber el ID/Titulo?
      const structConfig = songStructure.find((s) => s.id === id);
      const structTitle =
        structConfig?.title || groupLyrics[0]?.structure?.title || 'verse';

      // El backend probablemente devuelve el ID de la estructura como clave si agrupamos allá?
      // En LyricsGroupedCard: const { structure } = props;
      // Y usa structureColors[structure]. structureColors keys are likely structure IDs (ints) as strings?

      // Revisemos como viene lyricsGrouped prop. es [string, ..].
      // Asumiremos que es el ID como string.
      result.push([id, structTitle, groupLyrics]);
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
                      key={groupIndex} // Using groupIndex as key is risky if groups change order, but structure is better?
                      // key={structure} might correspond to structure ID... e.g. "1". Unique? Yes.
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
