import { MiniLyricsEditor } from './MiniLyricsEditor';
import { DraggableProvidedDragHandleProps } from '@hello-pangea/dnd';
import { useRef, useEffect } from 'react';
import { LyricsCardProps } from '../_interfaces/lyricsInterfaces';
import { useLyricsCard } from '../_hooks/useLyricsCard';
import { LyricsContent } from './lyrics/LyricsContent';
import { LyricsDragHandle } from './lyrics/LyricsDragHandle';
import { $PlayerRef } from '@stores/player';

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
  activeLineId,
  activeChordId,
  isUserScrolling,
  isDragging,
  dragHandleProps,
}: LyricsCardProps & {
  isDragging?: boolean;
  dragHandleProps?: DraggableProvidedDragHandleProps | null;
}) => {
  const { updateLyric, handleClickLyric, handleCloseEditor } =
    useLyricsCard(isPracticeMode);

  const cardRef = useRef<HTMLDivElement>(null);
  const isActive = activeLineId === lyric.id;

  useEffect(() => {
    if (isActive && cardRef.current && !isUserScrolling) {
      const element = cardRef.current;
      const rect = element.getBoundingClientRect();
      const bottomOffset = 200; // Offset to account for the floating player/controls
      const isInViewport =
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <=
          (window.innerHeight || document.documentElement.clientHeight) -
            bottomOffset &&
        rect.right <=
          (window.innerWidth || document.documentElement.clientWidth);

      // Only scroll if not fully visible to avoid unnecessary layout shifts
      if (!isInViewport) {
        element.scrollIntoView({
          behavior: 'smooth',
          block: 'center',
          inline: 'nearest',
        });
      }
    }
  }, [isActive, isUserScrolling]);

  // En modo práctica o cuando index es -1, no usar drag logic
  // Also disable drag visuals if updating lyric
  const showDragHandle = !isPracticeMode && index !== -1 && !updateLyric;

  if (isPracticeMode || index === -1) {
    const handleSeek = () => {
      // Seek logic specifically for Practice Mode
      if (isPracticeMode && lyric.startTime && lyric.startTime > 0) {
        const player = $PlayerRef.get();
        if (player) {
          player.seekTo(lyric.startTime, 'seconds');
        }
      }
    };

    return (
      <div
        ref={cardRef}
        onClick={handleSeek}
        className={`group relative flex w-full flex-1 flex-row items-center gap-2 rounded-lg p-1 duration-100 ${
          isActive
            ? 'border-l-4 border-l-brand-purple-500 bg-brand-purple-50 dark:bg-brand-purple-900/20'
            : 'hover:bg-slate-50 dark:bg-transparent dark:hover:bg-gray-800'
        } ${isPracticeMode && lyric.startTime && lyric.startTime > 0 ? 'cursor-pointer hover:bg-brand-purple-100/50 dark:hover:bg-brand-purple-900/10' : ''}`}
      >
        <div className="flex flex-1 flex-col">
          <LyricsContent
            lyric={lyric}
            transpose={transpose}
            showChords={showChords}
            lyricsScale={lyricsScale}
            chordPreferences={chordPreferences}
            activeChordId={activeChordId}
          />
        </div>
      </div>
    );
  }

  return (
    <div
      ref={cardRef}
      className={`group relative flex w-full flex-1 flex-row items-center gap-2 rounded-lg p-1 duration-100 ${
        isDragging
          ? 'scale-105 border-2 border-primary-400 bg-primary-50 shadow-2xl'
          : 'hover:bg-slate-50 dark:bg-transparent dark:hover:bg-gray-800'
      } lyric-card${lyric.id}`}
    >
      {/* Drag Handle - Siempre visible si drag enabled */}
      {/* Drag Handle - Siempre visible si drag enabled */}
      {dragHandleProps && (
        <div className={showDragHandle ? '' : 'invisible'}>
          <LyricsDragHandle dragHandleProps={dragHandleProps} />
        </div>
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
              activeChordId={activeChordId}
            />
          )}
        </div>
      </div>
    </div>
  );
};
