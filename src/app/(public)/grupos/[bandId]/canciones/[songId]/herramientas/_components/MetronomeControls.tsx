import { Button, Tooltip } from '@heroui/react';
import { PlayIcon } from '@global/icons/PlayIcon';
import { PauseIcon } from '@global/icons/PauseIcon';
import { CheckIcon } from '@global/icons/CheckIcon';
import { TrashIcon } from '@global/icons/TrashIcon';

interface MetronomeControlsProps {
  playing: boolean;
  onPlayPause: () => void;
  onTap: () => void;
  onApply: () => void;
  measureTapsCount: number;
  bpm: number | null;
  onClear?: () => void;
  onAdjustCtx?: (amountMs: number) => void;
}

export const MetronomeControls = ({
  playing,
  onPlayPause,
  onTap,
  onApply,
  measureTapsCount,
  bpm,
  onClear,
}: MetronomeControlsProps) => {
  return (
    <div className="flex flex-col gap-3">
      {/* Play/Tap Row */}
      <div className="flex flex-wrap items-center gap-4">
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
        <div className="flex flex-col">
          <span className="font-bold text-white">Reproductor</span>
          <span className="text-xs text-white/50">
            Usa &apos;Espacio&apos; para pausar.
          </span>
        </div>

        <div className="mx-2 h-8 w-px bg-white/10" />

        <Tooltip content="Presiona en el '1' de cada compás (ej: intro o coro)">
          <Button
            color="primary"
            variant="shadow"
            className="min-w-[160px] animate-pulse font-bold"
            onPress={onTap}
            startContent={<div className="h-2 w-2 rounded-full bg-white" />}
          >
            TAP COMPÁS (B)
            {measureTapsCount > 0 && (
              <span className="ml-1 rounded bg-black/20 px-1.5 py-0.5 text-xs text-white/80">
                {measureTapsCount}
              </span>
            )}
          </Button>
        </Tooltip>

        {onClear && measureTapsCount > 0 && (
          <Button
            isIconOnly
            color="danger"
            variant="flat"
            onPress={onClear}
            title="Borrar marcaciones"
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        )}

        {measureTapsCount >= 2 && bpm && (
          <Button
            color="secondary"
            variant="shadow"
            onPress={onApply}
            className="animate-pulse font-semibold"
            startContent={<CheckIcon className="h-4 w-4" />}
          >
            Aplicar
          </Button>
        )}
      </div>
    </div>
  );
};
