import { LyricsProps } from '@bands/[bandId]/eventos/_interfaces/eventsInterface';
import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '@nanostores/react';
import { MiniLyricsEditor } from './MiniLyricsEditor';
import { getNoteByType } from '@bands/[bandId]/eventos/[eventId]/_utils/getNoteByType';
import { Draggable } from '@hello-pangea/dnd';

export const LyricsCard = ({
  lyric,
  index,
  refetchLyricsOfCurrentSong,
  params,
  chordPreferences,
  lyricsOfCurrentSong,
  transpose = 0,
  showChords = true,
  lyricsScale = 1,
}: {
  lyric: LyricsProps;
  index: number;
  refetchLyricsOfCurrentSong: () => void;
  params: { bandId: string; songId: string };
  chordPreferences: ReturnType<typeof useStore>['state'];
  lyricsOfCurrentSong: LyricsProps[];
  transpose?: number;
  showChords?: boolean;
  lyricsScale?: number;
}) => {
  const [updateLyric, setUpdateLyric] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const prevIsDragging = useRef(false);

  const handleClickLyric = () => {
    setUpdateLyric(!updateLyric);
  };

  // Detectar cuando termina el drag y cerrar el editor
  useEffect(() => {
    // Si estaba arrastrando y ya no lo está (drag terminado)
    if (prevIsDragging.current && !isDragging) {
      console.log('Drag terminado - cerrando editor');
      setUpdateLyric(false);
    }
    prevIsDragging.current = isDragging;
  }, [isDragging]);

  return (
    <Draggable
      draggableId={lyric.id.toString()}
      index={index}
      isDragDisabled={updateLyric}
    >
      {(provided, snapshot) => {
        // Actualizar estado de dragging
        if (snapshot.isDragging !== isDragging) {
          setIsDragging(snapshot.isDragging);
        }

        return (
          <div
            ref={provided.innerRef}
            {...provided.draggableProps}
            className={`group relative flex w-full flex-1 flex-row items-center gap-2 rounded-lg p-1 duration-100 ${
              snapshot.isDragging
                ? 'z-50 scale-105 border-2 border-primary-400 bg-primary-50 shadow-2xl'
                : 'hover:bg-slate-50'
            } lyric-card${lyric.id}`}
          >
            {/* Drag Handle - Siempre visible */}
            {!updateLyric && (
              <div
                {...provided.dragHandleProps}
                className="flex shrink-0 cursor-grab flex-col gap-0.5 rounded-md p-1.5 opacity-30 transition-all hover:bg-slate-200 hover:opacity-100 active:cursor-grabbing active:bg-slate-300"
                title="Arrastra para mover"
              >
                <div className="h-1 w-1 rounded-full bg-slate-500"></div>
                <div className="h-1 w-1 rounded-full bg-slate-500"></div>
                <div className="h-1 w-1 rounded-full bg-slate-500"></div>
              </div>
            )}

            {/* Contenido de la letra */}
            <div className="flex flex-1 flex-col">
              {/* Wrapper con ancho ajustado - fit-content para vista, full width para edición */}
              <div
                onClick={updateLyric ? undefined : handleClickLyric}
                className={`${!updateLyric ? 'cursor-text' : 'w-full'}`}
                style={updateLyric ? undefined : { width: 'fit-content' }}
              >
                {/* Chords Section - Only show if showChords is true */}
                {!updateLyric &&
                  showChords &&
                  lyric.chords &&
                  lyric.chords.length > 0 && (
                    <div
                      className="grid grid-cols-5 gap-1"
                      style={{ fontSize: `${lyricsScale * 0.9}rem` }}
                    >
                      {lyric.chords
                        .sort((a, b) => a.position - b.position)
                        .map((chord) => (
                          <div
                            key={chord.id}
                            style={{
                              gridColumnStart: chord.position,
                              gridColumnEnd: chord.position + 1,
                            }}
                            className="col-span-1 flex items-end gap-1"
                          >
                            <div className="flex items-end">
                              <p className="font-semibold text-primary-600">
                                {getNoteByType(
                                  chord.rootNote,
                                  transpose,
                                  chordPreferences,
                                )}
                              </p>
                              <p className="font-medium text-primary-600">
                                {chord.chordQuality}
                              </p>
                            </div>
                            {chord.slashChord && (
                              <div className="flex items-end rounded-sm bg-primary-100 px-1">
                                <p className="text-xs font-semibold text-primary-700">
                                  {getNoteByType(
                                    chord.slashChord,
                                    transpose,
                                    chordPreferences,
                                  )}
                                </p>
                              </div>
                            )}
                          </div>
                        ))}
                    </div>
                  )}

                {/* Lyrics Section */}
                {updateLyric ? (
                  <MiniLyricsEditor
                    lyric={lyric}
                    params={params}
                    refetchLyricsOfCurrentSong={refetchLyricsOfCurrentSong}
                    onClose={() => setUpdateLyric(false)}
                    lyricsScale={lyricsScale}
                    lyricsOfCurrentSong={lyricsOfCurrentSong}
                  />
                ) : (
                  <div
                    style={{ fontSize: `${lyricsScale}rem` }}
                    className="font-medium leading-relaxed text-slate-800"
                  >
                    {lyric.lyrics}
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      }}
    </Draggable>
  );
};
