import { LyricsProps } from '@bands/[bandId]/eventos/_interfaces/eventsInterface';
import React, { useState, useEffect, useRef } from 'react';
import { useStore } from '@nanostores/react';
import { MiniLyricsEditor } from './MiniLyricsEditor';
import { Draggable } from '@hello-pangea/dnd';
import { ChordDisplay } from './ChordDisplay';

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
  isPracticeMode = false,
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
  isPracticeMode?: boolean;
}) => {
  const [updateLyric, setUpdateLyric] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const prevIsDragging = useRef(false);

  const handleClickLyric = () => {
    // No permitir edición en modo práctica
    if (isPracticeMode) return;
    setUpdateLyric(!updateLyric);
  };

  // Detectar cuando termina el drag y cerrar el editor
  useEffect(() => {
    // Si estaba arrastrando y ya no lo está (drag terminado)
    if (prevIsDragging.current && !isDragging) {
      setUpdateLyric(false);
    }
    prevIsDragging.current = isDragging;
  }, [isDragging]);

  // En modo práctica o cuando index es -1, no usar Draggable
  if (isPracticeMode || index === -1) {
    return (
      <div className="group relative flex w-full flex-1 flex-row items-center gap-2 rounded-lg p-1 duration-100 hover:bg-slate-50">
        {/* Contenido de la letra */}
        <div className="flex flex-1 flex-col">
          <div style={{ width: 'fit-content' }}>
            {/* Chords Section */}
            {showChords && lyric.chords && lyric.chords.length > 0 && (
              <ChordDisplay
                chords={lyric.chords}
                transpose={transpose}
                chordPreferences={chordPreferences}
                lyricsScale={lyricsScale}
              />
            )}

            {/* Lyrics Section */}
            <div
              style={{ fontSize: `${lyricsScale}rem` }}
              className="font-medium leading-relaxed text-slate-800"
            >
              {lyric.lyrics}
            </div>
          </div>
        </div>
      </div>
    );
  }

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
                    <ChordDisplay
                      chords={lyric.chords}
                      transpose={transpose}
                      chordPreferences={chordPreferences}
                      lyricsScale={lyricsScale}
                    />
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
