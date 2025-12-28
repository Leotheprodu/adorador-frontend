import { Button, Card, CardBody } from '@heroui/react';
import { useRef, useEffect, useState } from 'react';
import { CheckIcon } from '@global/icons/CheckIcon';
import { TrashIcon } from '@global/icons/TrashIcon';
import { SongLyric } from '@bands/[bandId]/canciones/_interfaces/songsInterface';

interface LyricsSidebarProps {
  lyrics: SongLyric[];
  activeLineId: number | null;
  onSave: () => void;
  isSaving: boolean;
  onClearDetail: (id: number) => void;
  onClearAll: () => void;
  onSeek: (time: number) => void;
  onManualAdjust: (id: number, ms: number) => void;
  isLineDirty: (id: number) => boolean;
  currentTimeRef: React.MutableRefObject<number>;
  playing: boolean;
}

export const LyricsSidebar = ({
  lyrics,
  activeLineId,
  onSave,
  isSaving,
  onClearDetail,
  onClearAll,
  onSeek,
  onManualAdjust,
  isLineDirty,
  currentTimeRef,
  playing,
}: LyricsSidebarProps) => {
  const activeRef = useRef<HTMLDivElement>(null);
  const playingRef = useRef<HTMLDivElement>(null);

  // State for the line currently being sung (playback)
  const [playingLineId, setPlayingLineId] = useState<number | null>(null);

  // 1. Efficient Polling for Playback Highlight (Low Frequency Updates)
  useEffect(() => {
    if (!playing || lyrics.length === 0) return;

    let animationFrameId: number;

    const checkCurrentLine = () => {
      const time = currentTimeRef.current;

      // Find the last lyric that has started (startTime <= time)
      // Since lyrics are usually sorted, we can reverse find or just filter.
      // Optimization: assume sorted.
      let currentId: number | null = null;

      for (let i = 0; i < lyrics.length; i++) {
        if (lyrics[i].startTime <= time && lyrics[i].startTime > 0) {
          currentId = lyrics[i].id;
        } else if (lyrics[i].startTime > time) {
          break; // Future lyrics
        }
      }

      // ONLY trigger render if changed
      setPlayingLineId((prev) => {
        if (prev !== currentId) return currentId;
        return prev;
      });

      animationFrameId = requestAnimationFrame(checkCurrentLine);
    };

    checkCurrentLine();

    return () => cancelAnimationFrame(animationFrameId);
  }, [playing, lyrics, currentTimeRef]);

  // 2. Auto-Scroll Effect for Playback
  useEffect(() => {
    if (playingLineId && playingRef.current && playing) {
      playingRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest',
      });
    }
  }, [playingLineId, playing]);

  // 3. Keep Recording Scroll Effect (Priority if not playing? Or separate?)
  useEffect(() => {
    if (activeLineId && activeRef.current) {
      activeRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'nearest',
      });
    }
  }, [activeLineId]);

  return (
    <Card className="h-full overflow-hidden bg-content2 dark:bg-content1">
      <CardBody className="flex h-full flex-col overflow-hidden p-4">
        <div className="mb-4 flex shrink-0 items-center justify-between border-b border-white/10 pb-2">
          <div className="flex flex-col">
            <h3 className="font-bold text-white">Sincronización</h3>
            <p className="text-white/50 text-tiny">
              Presiona 'L' para asignar tiempo
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              isIconOnly
              size="sm"
              variant="flat"
              color="danger"
              onPress={onClearAll}
            >
              <TrashIcon className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="flat"
              color="primary"
              onPress={onSave}
              isLoading={isSaving}
              startContent={!isSaving && <CheckIcon className="h-4 w-4" />}
            >
              Guardar
            </Button>
          </div>
        </div>

        <div className="custom-scrollbar flex min-h-0 flex-1 flex-col gap-2 overflow-y-auto pr-2">
          {lyrics.map((line, index) => {
            const isAssigned = line.startTime > 0;
            const isRecordingActive =
              activeLineId === line.id ||
              (!activeLineId &&
                !isAssigned &&
                index === lyrics.findIndex((l) => l.startTime === 0));

            const isPlaybackActive = playingLineId === line.id;
            const isDirty = isLineDirty(line.id);

            // Determine Ref assignment: Priority to Playback if playing, otherwise Recording
            const refToUse = isPlaybackActive
              ? playingRef
              : isRecordingActive
                ? activeRef
                : null;

            return (
              <div
                key={line.id}
                ref={refToUse}
                onClick={() => isAssigned && onSeek(line.startTime)}
                className={`group relative flex flex-col gap-1 rounded-lg border p-2 transition-all ${
                  isRecordingActive
                    ? 'border-brand-purple-500 bg-brand-purple-500/10' // Recording Highlight
                    : isPlaybackActive
                      ? 'scale-[1.02] border-brand-blue-400 bg-brand-blue-400/20 shadow-lg' // Playback Highlight
                      : isAssigned
                        ? 'cursor-pointer border-brand-blue-500/30 bg-brand-blue-500/5 hover:bg-brand-blue-500/10'
                        : 'border-white/5 bg-transparent opacity-50'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="mr-2 flex flex-1 items-start gap-2">
                    {isDirty && (
                      <span
                        className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400"
                        title="Unsaved changes"
                      />
                    )}
                    <span
                      className={`text-sm ${isAssigned ? 'text-white' : 'text-white/50'} ${isPlaybackActive ? 'font-bold text-brand-blue-200' : ''}`}
                    >
                      {line.lyrics}
                    </span>
                  </div>
                  {isAssigned && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onManualAdjust(line.id, -100);
                        }}
                        className="rounded bg-white/5 px-1 text-[10px] text-white/70 hover:bg-white/10"
                        title="-100ms"
                      >
                        -0.1s
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onManualAdjust(line.id, 100);
                        }}
                        className="rounded bg-white/5 px-1 text-[10px] text-white/70 hover:bg-white/10"
                        title="+100ms"
                      >
                        +0.1s
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onClearDetail(line.id);
                        }}
                        className="p-1 text-white/30 transition-colors hover:text-red-400"
                      >
                        <TrashIcon className="h-3 w-3" />
                      </button>
                    </div>
                  )}
                </div>

                {isAssigned && (
                  <span className="mt-1 font-mono text-xs text-brand-blue-300">
                    {line.startTime.toFixed(3)}s
                  </span>
                )}

                {isRecordingActive && !isAssigned && (
                  <div className="absolute -right-1 -top-1 h-3 w-3 animate-ping rounded-full bg-brand-purple-500" />
                )}
              </div>
            );
          })}

          {lyrics.length === 0 && (
            <div className="py-8 text-center text-sm italic text-white/40">
              No hay letras disponibles para esta canción.
            </div>
          )}
        </div>
      </CardBody>
    </Card>
  );
};
