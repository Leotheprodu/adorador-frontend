import { structureColors, structureLib } from '@global/config/constants';
import { LyricsCard } from './LyricsCard';
import { useState } from 'react';
import { MiniLyricsCreator } from './MiniLyricsCreator';
import { LyricsGroupedCardProps } from '../_interfaces/lyricsInterfaces';
import { useLyricsGroupDragDrop } from '../_hooks/useLyricsGroupDragDrop';
import { useLyricsInsertion } from '../_hooks/useLyricsInsertion';
import { LyricsInsertButton } from './lyrics/LyricsInsertButton';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';

export const LyricsGroupedCard = ({
  structure,
  structureId, // New prop
  lyrics,
  refetchLyricsOfCurrentSong,
  params,
  chordPreferences,
  lyricsOfCurrentSong,
  transpose = 0,
  showChords = true,
  lyricsScale = 1,
  isPracticeMode = false,
  activeLineId,
  activeChordId,
  isUserScrolling,
  isDragging, // Recibir como prop
}: LyricsGroupedCardProps & { isDragging: boolean; structureId: number }) => {
  // Ya no necesitamos useLyricsGroupDragDrop aquí, porque el orden lo maneja el padre a través de lyricsGrouped
  // Pero necesitamos ordenar localmente las lyrics que recibimos para mostrarlas
  const sortedLyrics = [...lyrics].sort((a, b) => a.position - b.position);

  const { insertPosition, openInsertAt, closeInsert } = useLyricsInsertion();

  return (
    <div
      className="w-full border-l-4 bg-white py-4 pl-4 dark:bg-gray-950"
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

      {/* En modo práctica, no usar Droppable */}
      {isPracticeMode ? (
        <div className="flex flex-col gap-1">
          {sortedLyrics.map((lyric) => (
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
              activeLineId={activeLineId}
              activeChordId={activeChordId}
              isUserScrolling={isUserScrolling}
            />
          ))}
        </div>
      ) : (
        <Droppable droppableId={`lyrics-${structureId}`}>
          {(provided) => (
            <div
              className="flex flex-col gap-1"
              {...provided.droppableProps}
              ref={provided.innerRef}
            >
              {sortedLyrics.map((lyric, index) => {
                const suggestedTimeBefore =
                  lyricsOfCurrentSong.find(
                    (l) => l.position === lyric.position - 1,
                  )?.startTime ?? 0;

                return (
                  <Draggable
                    key={lyric.id}
                    draggableId={lyric.id.toString()}
                    index={index}
                    isDragDisabled={false}
                  >
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        className={`group/lyric-wrapper relative ${snapshot.isDragging ? 'z-50' : ''}`}
                        style={{ ...provided.draggableProps.style }}
                      >
                        {/* Botón para insertar ANTES de esta letra */}
                        {index === 0 && !insertPosition && (
                          <div className={isDragging ? 'invisible' : ''}>
                            <LyricsInsertButton
                              onClick={() => openInsertAt(lyric.position)}
                              position="before"
                            />
                          </div>
                        )}

                        {/* Insertar ANTES */}
                        {insertPosition === lyric.position && (
                          <MiniLyricsCreator
                            params={params}
                            refetchLyricsOfCurrentSong={
                              refetchLyricsOfCurrentSong
                            }
                            onClose={closeInsert}
                            lyricsOfCurrentSong={lyricsOfCurrentSong}
                            newPosition={lyric.position}
                            structureId={lyric.structure.id}
                            lyricsScale={lyricsScale}
                            suggestedStartTime={suggestedTimeBefore + 0.1}
                          />
                        )}

                        <LyricsCard
                          lyric={lyric}
                          index={index}
                          refetchLyricsOfCurrentSong={
                            refetchLyricsOfCurrentSong
                          }
                          params={params}
                          chordPreferences={chordPreferences}
                          lyricsOfCurrentSong={lyricsOfCurrentSong}
                          transpose={transpose}
                          showChords={showChords}
                          lyricsScale={lyricsScale}
                          isPracticeMode={isPracticeMode}
                          activeLineId={activeLineId}
                          activeChordId={activeChordId}
                          isUserScrolling={isUserScrolling}
                          dragHandleProps={provided.dragHandleProps}
                          isDragging={snapshot.isDragging}
                        />

                        {/* Botón para insertar DESPUÉS de esta letra */}
                        {!insertPosition && (
                          <div className={isDragging ? 'invisible' : ''}>
                            <LyricsInsertButton
                              onClick={() => openInsertAt(lyric.position + 1)}
                              position="after"
                            />
                          </div>
                        )}

                        {/* Insertar DESPUÉS (Solo si es el último elemento) */}
                        {index === sortedLyrics.length - 1 &&
                          insertPosition === lyric.position + 1 && (
                            <MiniLyricsCreator
                              params={params}
                              refetchLyricsOfCurrentSong={
                                refetchLyricsOfCurrentSong
                              }
                              onClose={closeInsert}
                              lyricsOfCurrentSong={lyricsOfCurrentSong}
                              newPosition={lyric.position + 1}
                              structureId={lyric.structure.id}
                              lyricsScale={lyricsScale}
                              suggestedStartTime={(lyric.startTime ?? 0) + 0.1}
                            />
                          )}
                      </div>
                    )}
                  </Draggable>
                );
              })}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      )}
    </div>
  );
};
