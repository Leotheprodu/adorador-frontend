import { MiniLyricsEditor } from './MiniLyricsEditor';
import { Draggable } from '@hello-pangea/dnd';
import { LyricsCardProps } from '../_interfaces/lyricsInterfaces';
import { useLyricsCard } from '../_hooks/useLyricsCard';
import { LyricsContent } from './lyrics/LyricsContent';
import { LyricsDragHandle } from './lyrics/LyricsDragHandle';

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
}: LyricsCardProps) => {
  const {
    updateLyric,
    isDragging,
    setIsDragging,
    handleClickLyric,
    handleCloseEditor,
  } = useLyricsCard(isPracticeMode);

  // En modo práctica o cuando index es -1, no usar Draggable
  if (isPracticeMode || index === -1) {
    return (
      <div className="group relative flex w-full flex-1 flex-row items-center gap-2 rounded-lg p-1 duration-100 hover:bg-slate-50 dark:hover:bg-gray-800 dark:bg-transparent">
        <div className="flex flex-1 flex-col">
          <LyricsContent
            lyric={lyric}
            transpose={transpose}
            showChords={showChords}
            lyricsScale={lyricsScale}
            chordPreferences={chordPreferences}
          />
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
            className={`group relative flex w-full flex-1 flex-row items-center gap-2 rounded-lg p-1 duration-100 ${snapshot.isDragging
              ? 'z-50 scale-105 border-2 border-primary-400 bg-primary-50 shadow-2xl'
              : 'hover:bg-slate-50 dark:hover:bg-gray-800 dark:bg-transparent'
              } lyric-card${lyric.id}`}
          >
            {/* Drag Handle - Siempre visible */}
            {!updateLyric && (
              <LyricsDragHandle dragHandleProps={provided.dragHandleProps} />
            )}

            {/* Contenido de la letra */}
            <div className="flex flex-1 flex-col">
              <div
                onClick={updateLyric ? undefined : handleClickLyric}
                className={!updateLyric ? 'cursor-text' : ''}
              >
                {updateLyric ? (
                  <MiniLyricsEditor
                    lyric={lyric}
                    params={params}
                    refetchLyricsOfCurrentSong={refetchLyricsOfCurrentSong}
                    onClose={handleCloseEditor}
                    lyricsScale={lyricsScale}
                    lyricsOfCurrentSong={lyricsOfCurrentSong}
                  />
                ) : (
                  <LyricsContent
                    lyric={lyric}
                    transpose={transpose}
                    showChords={showChords}
                    lyricsScale={lyricsScale}
                    chordPreferences={chordPreferences}
                  />
                )}
              </div>
            </div>
          </div>
        );
      }}
    </Draggable>
  );
};
