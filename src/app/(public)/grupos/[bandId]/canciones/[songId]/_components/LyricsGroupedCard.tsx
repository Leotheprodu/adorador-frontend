import { structureColors, structureLib } from '@global/config/constants';
import React, { useEffect, useState } from 'react';
import { LyricsCard } from './LyricsCard';
import { MiniLyricsCreator } from './MiniLyricsCreator';
import { LyricsProps } from '@bands/[bandId]/eventos/_interfaces/eventsInterface';
import { useStore } from '@nanostores/react';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { updateLyricsPositionsService } from '../_services/songIdServices';
import toast from 'react-hot-toast';

export const LyricsGroupedCard = ({
  structure,
  lyrics,
  refetchLyricsOfCurrentSong,
  params,
  chordPreferences,
  lyricsOfCurrentSong,
  transpose = 0,
  showChords = true,
  lyricsScale = 1,
  isPracticeMode = false,
}: {
  structure: string;
  lyrics: LyricsProps[];
  refetchLyricsOfCurrentSong: () => void;
  params: { bandId: string; songId: string };
  chordPreferences: ReturnType<typeof useStore>['state'];
  lyricsOfCurrentSong: LyricsProps[];
  transpose?: number;
  showChords?: boolean;
  lyricsScale?: number;
  isPracticeMode?: boolean;
}) => {
  const [insertPosition, setInsertPosition] = useState<number | null>(null);
  const [lyricsOrder, setLyricsOrder] = useState<LyricsProps[]>([]);

  const {
    mutate: mutateUpdateLyricsPositions,
    status: statusUpdateLyricsPositions,
  } = updateLyricsPositionsService({ params });

  useEffect(() => {
    setLyricsOrder([...lyrics].sort((a, b) => a.position - b.position));
  }, [lyrics]);

  useEffect(() => {
    if (statusUpdateLyricsPositions === 'success') {
      toast.success('Orden actualizado');
      refetchLyricsOfCurrentSong();
    }
  }, [statusUpdateLyricsPositions, refetchLyricsOfCurrentSong]);

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const updatedLyrics = [...lyricsOrder];
    const [removed] = updatedLyrics.splice(result.source.index, 1);
    updatedLyrics.splice(result.destination.index, 0, removed);

    // Encontrar la posición base (la menor posición en este grupo)
    const basePosition = Math.min(...lyricsOrder.map((l) => l.position));

    // Actualizar las posiciones manteniendo el orden relativo al grupo
    const reorderedLyrics = updatedLyrics.map((lyric, index) => ({
      ...lyric,
      position: basePosition + index,
    }));

    setLyricsOrder(reorderedLyrics);

    // Enviar solo las letras que cambiaron de posición
    const newPositions = reorderedLyrics
      .filter((lyric, index) => {
        const originalLyric = lyricsOrder[index];
        return originalLyric.id !== lyric.id; // Cambió de posición
      })
      .map((lyric) => ({
        id: lyric.id,
        position: lyric.position,
      }));

    if (newPositions.length > 0) {
      mutateUpdateLyricsPositions(newPositions);
    }
  };

  return (
    <div
      className="w-full border-l-4 py-4 pl-4 bg-white dark:bg-gray-900"
      style={{
        borderColor: structureColors[structure],
      }}
    >
      <h2
        className="mb-6 text-left text-2xl font-bold"
        style={{
          color: structureColors[structure],
        }}
      >
        {structureLib[structure].es}
      </h2>

      {/* En modo práctica, no usar DragDropContext */}
      {isPracticeMode ? (
        <div className="flex flex-col gap-1">
          {lyricsOrder.map((lyric) => (
            <LyricsCard
              key={lyric.id}
              lyric={lyric}
              index={-1} // -1 indica que no se puede drag & drop
              refetchLyricsOfCurrentSong={refetchLyricsOfCurrentSong}
              params={params}
              chordPreferences={chordPreferences}
              lyricsOfCurrentSong={lyricsOfCurrentSong}
              transpose={transpose}
              showChords={showChords}
              lyricsScale={lyricsScale}
              isPracticeMode={isPracticeMode}
            />
          ))}
        </div>
      ) : (
        <DragDropContext onDragEnd={handleDragEnd}>
          <Droppable droppableId={`lyrics-${structure}`}>
            {(provided) => (
              <div
                className="flex flex-col gap-1"
                {...provided.droppableProps}
                ref={provided.innerRef}
              >
                {lyricsOrder.map((lyric, index) => (
                  <div key={lyric.id} className="group/lyric-wrapper relative">
                    {/* Botón para insertar ANTES de esta letra */}
                    {index === 0 && !insertPosition && (
                      <button
                        onClick={() => {
                          setInsertPosition(lyric.position);
                        }}
                        className="mb-1 w-full rounded border-2 border-dashed border-slate-200 bg-slate-50/50 py-2 text-xs text-slate-500 opacity-50 transition-all hover:border-primary-400 hover:bg-primary-50 hover:text-primary-600 hover:opacity-100 dark:border-slate-700 dark:bg-gray-800 dark:text-slate-400 dark:hover:border-primary-400 dark:hover:bg-gray-900 dark:hover:text-primary-300"
                      >
                        + Insertar letra aquí
                      </button>
                    )}

                    {insertPosition === lyric.position ? (
                      <MiniLyricsCreator
                        params={params}
                        refetchLyricsOfCurrentSong={refetchLyricsOfCurrentSong}
                        onClose={() => setInsertPosition(null)}
                        lyricsOfCurrentSong={lyricsOfCurrentSong}
                        newPosition={lyric.position}
                        structureId={lyric.structure.id}
                        lyricsScale={lyricsScale}
                      />
                    ) : (
                      <LyricsCard
                        lyric={lyric}
                        index={index}
                        refetchLyricsOfCurrentSong={refetchLyricsOfCurrentSong}
                        params={params}
                        chordPreferences={chordPreferences}
                        lyricsOfCurrentSong={lyricsOfCurrentSong}
                        transpose={transpose}
                        showChords={showChords}
                        lyricsScale={lyricsScale}
                        isPracticeMode={isPracticeMode}
                      />
                    )}

                    {/* Botón para insertar DESPUÉS de esta letra */}
                    {!insertPosition && (
                      <button
                        onClick={() => {
                          setInsertPosition(lyric.position + 1);
                        }}
                        className="mt-1 w-full rounded border-2 border-dashed border-slate-200 bg-slate-50/50 py-2 text-xs text-slate-500 opacity-50 transition-all hover:border-primary-400 hover:bg-primary-50 hover:text-primary-600 hover:opacity-100 dark:border-slate-700 dark:bg-gray-800 dark:text-slate-400 dark:hover:border-primary-400 dark:hover:bg-gray-900 dark:hover:text-primary-300"
                      >
                        + Insertar letra aquí
                      </button>
                    )}
                  </div>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      )}
    </div>
  );
};
