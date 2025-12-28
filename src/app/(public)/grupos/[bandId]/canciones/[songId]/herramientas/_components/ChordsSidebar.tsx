import { Button, Card, CardBody } from '@heroui/react';
import { useRef, useEffect, memo } from 'react';
import { CheckIcon } from '@global/icons/CheckIcon';
import { TrashIcon } from '@global/icons/TrashIcon';
import {
  SongLyric,
  SongChord,
} from '@bands/[bandId]/canciones/_interfaces/songsInterface';
import { structureLib } from '@global/config/constants';
import { QuantizationMode } from '../_hooks/useChordsMapper';
import { Select, SelectItem } from '@heroui/react';
import { useMemo } from 'react';

// Memoized Chord Card Component to prevent massive re-renders
const ChordCard = memo(
  ({
    chord,
    isActive,
    isDirty,
    adjustmentUnit,
    onSeek,
    onManualAdjust,
    onClearDetail,
    activeRef,
  }: {
    chord: SongChord;
    isActive: boolean;
    isDirty: boolean;
    adjustmentUnit: string;
    onSeek: (time: number) => void;
    onManualAdjust: (id: number, direction: 1 | -1) => void;
    onClearDetail: (id: number) => void;
    activeRef: React.RefObject<HTMLDivElement>;
  }) => {
    const isAssigned = chord.startTime > 0;

    return (
      <div
        ref={isActive ? activeRef : null}
        onClick={() => isAssigned && onSeek(chord.startTime)}
        className={`group relative flex items-center justify-between rounded-md border p-2 transition-colors ${
          isActive
            ? 'border-brand-purple-500 bg-brand-purple-500/10'
            : isAssigned
              ? 'cursor-pointer border-brand-blue-500/30 bg-brand-blue-500/5 hover:bg-brand-blue-500/10'
              : 'border-white/5 bg-transparent opacity-50'
        }`}
      >
        <div className="flex items-center gap-3">
          {isDirty && (
            <span
              className="h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400"
              title="Unsaved changes"
            />
          )}
          <span
            className={`text-lg font-bold ${
              isAssigned ? 'text-white' : 'text-white/70'
            }`}
          >
            {chord.rootNote}
            {chord.chordQuality}
            {chord.slashChord ? `/${chord.slashChord}` : ''}
          </span>
        </div>

        {isAssigned && (
          <div className="flex items-center gap-2">
            <span className="mr-2 font-mono text-xs text-brand-blue-300">
              {chord.startTime.toFixed(3)}s
            </span>
            <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onManualAdjust(chord.id, -1);
                }}
                className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-white hover:bg-white/20"
                title={`Retroceder ${adjustmentUnit}`}
              >
                -{adjustmentUnit}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onManualAdjust(chord.id, 1);
                }}
                className="rounded bg-white/10 px-1.5 py-0.5 text-[10px] text-white hover:bg-white/20"
                title={`Adelantar ${adjustmentUnit}`}
              >
                +{adjustmentUnit}
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onClearDetail(chord.id);
                }}
                className="ml-1 p-1 text-white/30 transition-colors hover:text-red-400"
              >
                <TrashIcon className="h-3 w-3" />
              </button>
            </div>
          </div>
        )}

        {isActive && !isAssigned && (
          <div className="absolute -right-1 -top-1 h-2 w-2 rounded-full bg-brand-purple-500 shadow-sm" />
        )}
      </div>
    );
  },
);
ChordCard.displayName = 'ChordCard';

interface ChordsSidebarProps {
  chords: SongChord[];
  lyrics: SongLyric[];
  activeChordId: number | null;
  onSave: () => void;
  isSaving: boolean;
  onClearDetail: (id: number) => void;
  onClearAll: () => void;
  onSeek: (time: number) => void;
  isChordDirty: (id: number) => boolean;
  adjustmentUnit?: string;
  quantizationMode: QuantizationMode;
  setQuantizationMode: (mode: QuantizationMode) => void;
}

export const ChordsSidebar = memo(
  ({
    chords,
    lyrics,
    activeChordId,
    onSave,
    isSaving,
    onClearDetail,
    onClearAll,
    onSeek,
    onManualAdjust,
    isChordDirty,
    adjustmentUnit = '0.1s',
    quantizationMode,
    setQuantizationMode,
  }: ChordsSidebarProps) => {
    const activeRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      if (activeChordId && activeRef.current) {
        activeRef.current.scrollIntoView({
          behavior: 'auto', // 'smooth' causes lag on rapid updates
          block: 'center',
          inline: 'nearest',
        });
      }
    }, [activeChordId]);

    const getLyricText = (lyricId: number) => {
      return lyrics.find((l) => l.id === lyricId)?.lyrics || '...';
    };

    // Optimize chord lookup
    const chordsByLine = useMemo(() => {
      const map = new Map<number, SongChord[]>();
      chords.forEach((c) => {
        const existing = map.get(c.lyricId) || [];
        existing.push(c);
        map.set(c.lyricId, existing);
      });
      return map;
    }, [chords]);

    return (
      <Card className="h-full overflow-hidden bg-content2 dark:bg-content1">
        <CardBody className="flex h-full flex-col overflow-hidden p-4">
          <div className="mb-4 flex shrink-0 items-center justify-between border-b border-white/10 pb-2">
            <div className="flex flex-col">
              <h3 className="font-bold text-white">
                Sincronización de Acordes
              </h3>
              <p className="text-white/50 text-tiny">
                Presiona 'C' para asignar tiempo
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

          {/* Quantization Selector */}
          <div className="mb-2 flex items-center justify-between px-1">
            <span className="text-xs text-white/50">Cuantizar:</span>
            <Select
              size="sm"
              className="w-28"
              selectedKeys={[quantizationMode]}
              onChange={(e) =>
                setQuantizationMode(e.target.value as QuantizationMode)
              }
              aria-label="Quantization Mode"
              classNames={{
                trigger: 'h-8 min-h-0 bg-white/10',
                value: 'text-xs',
              }}
            >
              <SelectItem key="1/2" textValue="1/2">
                1/2
              </SelectItem>
              <SelectItem key="1/4" textValue="1/4">
                1/4
              </SelectItem>
              <SelectItem key="1/1" textValue="1/1">
                1/1
              </SelectItem>
              <SelectItem key="off" textValue="OFF">
                OFF
              </SelectItem>
            </Select>
          </div>

          <div className="custom-scrollbar flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto pr-2">
            {lyrics.map((line, lineIndex) => {
              // Check if structure changed
              const prevLine = lyrics[lineIndex - 1];
              const isNewStructure =
                !prevLine ||
                (line.structure &&
                  prevLine.structure?.id !== line.structure.id) ||
                (!prevLine.structure && line.structure);

              // Filter chords for this line (Using map)
              const lineChords = chordsByLine.get(line.id) || [];

              // Skip lines without chords? Maybe not, context is useful.
              // But if there are no chords, maybe just text is fine.
              if (lineChords.length === 0) return null;

              return (
                <div key={line.id} className="flex flex-col gap-2">
                  {isNewStructure && line.structure && (
                    <div className="text-xs font-bold uppercase text-brand-purple-400">
                      {structureLib[
                        line.structure.title as keyof typeof structureLib
                      ]?.es || line.structure.title}
                    </div>
                  )}

                  <div className="rounded-lg bg-white/5 p-2">
                    <p className="mb-2 px-1 text-sm italic text-white/50">
                      "{line.lyrics}"
                    </p>
                    <div className="flex flex-col gap-2">
                      {lineChords.map((chord) => (
                        <ChordCard
                          key={chord.id}
                          chord={chord}
                          isActive={activeChordId === chord.id}
                          isDirty={isChordDirty(chord.id)}
                          adjustmentUnit={adjustmentUnit}
                          onSeek={onSeek}
                          onManualAdjust={onManualAdjust}
                          onClearDetail={onClearDetail}
                          activeRef={activeRef}
                        />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}

            {chords.length === 0 && (
              <div className="py-8 text-center text-sm italic text-white/40">
                No hay acordes disponibles para esta canción.
              </div>
            )}
          </div>
        </CardBody>
      </Card>
    );
  },
);

ChordsSidebar.displayName = 'ChordsSidebar';
