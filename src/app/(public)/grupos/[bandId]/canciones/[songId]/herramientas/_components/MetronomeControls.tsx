import { Button, Tooltip } from '@heroui/react';
import { PlayIcon } from '@global/icons/PlayIcon';
import { PauseIcon } from '@global/icons/PauseIcon';
import { TrashIcon } from '@global/icons/TrashIcon';
import { CheckIcon } from '@global/icons/CheckIcon';

interface MetronomeControlsProps {
  playing: boolean;
  onPlayPause: () => void;
  onTap: () => void;
  onClear: () => void;
  onApply: () => void;
  measureTapsCount: number;
  bpm: number | null;
  onAdjustCtx: (ms: number) => void;
}

export const MetronomeControls = ({
  playing,
  onPlayPause,
  onTap,
  onClear,
  onApply,
  measureTapsCount,
  bpm,
  onAdjustCtx,
}: MetronomeControlsProps) => {
  return (
    <div className="flex flex-col gap-3">
      {/* Play/Tap Row */}
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Button
          isIconOnly
          className="h-12 w-12 rounded-full"
          color={playing ? 'warning' : 'success'}
          variant="shadow"
          onPress={onPlayPause}
        >
          {playing ? (
            <PauseIcon className="h-6 w-6 text-white" />
          ) : (
            <PlayIcon className="ml-1 h-6 w-6 text-white" />
          )}
        </Button>

        <div className="mx-2 h-8 w-px bg-white/10" />

        <Tooltip content="Presiona en el '1' de cada compás (ej: intro o coro)">
          <Button
            color="primary"
            size="lg"
            className="min-w-[180px] font-bold"
            onPress={onTap}
            startContent={
              <div className="h-3 w-3 animate-pulse rounded-full bg-white" />
            }
          >
            TAP COMPÁS (1)
            {measureTapsCount > 0 && (
              <span className="ml-1 rounded bg-black/20 px-1.5 py-0.5 text-xs text-white/80">
                {measureTapsCount}
              </span>
            )}
          </Button>
        </Tooltip>

        {measureTapsCount >= 2 && bpm && (
          <Button
            color="secondary"
            variant="shadow"
            onPress={onApply}
            className="animate-pulse font-semibold"
            startContent={<CheckIcon className="h-4 w-4" />}
          >
            Aplicar al Grid
          </Button>
        )}

        <Button
          isIconOnly
          variant="light"
          color="danger"
          onPress={onClear}
          title="Reiniciar todo"
          className="ml-auto"
        >
          <TrashIcon className="h-5 w-5" />
        </Button>
      </div>

      {/* Manual Adjustment Row - Only show if BPM is set/Grid applied */}
      {bpm && (
        <div className="flex items-center justify-center gap-2 rounded-lg bg-white/5 p-2">
          <span className="mr-2 text-xs font-bold uppercase text-white/50">
            Ajuste Manual Inicio:
          </span>
          <Button size="sm" variant="flat" onPress={() => onAdjustCtx(-50)}>
            -50ms
          </Button>
          <Button size="sm" variant="flat" onPress={() => onAdjustCtx(-10)}>
            -10ms
          </Button>
          <Button size="sm" variant="flat" onPress={() => onAdjustCtx(-1)}>
            -1ms
          </Button>
          <div className="mx-1 h-4 w-px bg-white/10"></div>
          <Button size="sm" variant="flat" onPress={() => onAdjustCtx(1)}>
            +1ms
          </Button>
          <Button size="sm" variant="flat" onPress={() => onAdjustCtx(10)}>
            +10ms
          </Button>
          <Button size="sm" variant="flat" onPress={() => onAdjustCtx(50)}>
            +50ms
          </Button>
        </div>
      )}
    </div>
  );
};
