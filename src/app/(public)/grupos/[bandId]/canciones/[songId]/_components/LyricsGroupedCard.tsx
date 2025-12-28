import { structureColors, structureLib } from '@global/config/constants';
import { LyricsCard } from './LyricsCard';
import { MiniLyricsCreator } from './MiniLyricsCreator';
import { LyricsGroupedCardProps } from '../_interfaces/lyricsInterfaces';
import { useLyricsGroupDragDrop } from '../_hooks/useLyricsGroupDragDrop';
import { useLyricsInsertion } from '../_hooks/useLyricsInsertion';
import { LyricsInsertButton } from './lyrics/LyricsInsertButton';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';

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
  activeLineId,
  activeChordId,
  isUserScrolling,
}: LyricsGroupedCardProps) => {
  const { lyricsOrder, handleDragEnd } = useLyricsGroupDragDrop({
    lyrics,
    params,
    refetchLyricsOfCurrentSong,
  });

  const { insertPosition, openInsertAt, closeInsert } = useLyricsInsertion();

  return (
    <div
      className="w-full border-l-4 bg-white py-4 pl-4 dark:bg-gray-900"
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
              activeLineId={activeLineId}
              activeChordId={activeChordId}
              isUserScrolling={isUserScrolling}
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
                      <LyricsInsertButton
                        onClick={() => openInsertAt(lyric.position)}
                        position="before"
                      />
                    )}

                    {insertPosition === lyric.position ? (
                      <MiniLyricsCreator
                        params={params}
                        refetchLyricsOfCurrentSong={refetchLyricsOfCurrentSong}
                        onClose={closeInsert}
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
                        activeLineId={activeLineId}
                        activeChordId={activeChordId}
                        isUserScrolling={isUserScrolling}
                      />
                    )}

                    {/* Botón para insertar DESPUÉS de esta letra */}
                    {!insertPosition && (
                      <LyricsInsertButton
                        onClick={() => openInsertAt(lyric.position + 1)}
                        position="after"
                      />
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
