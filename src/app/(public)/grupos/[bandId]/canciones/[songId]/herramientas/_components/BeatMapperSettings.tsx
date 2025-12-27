import { Input, Slider } from '@heroui/react';

interface BeatMapperSettingsProps {
  timeSignature: number;
  setTimeSignature: (val: number) => void;
  startTime: number;
  onAdjustStartTime: (ms: number) => void;
}

export const BeatMapperSettings = ({
  timeSignature,
  setTimeSignature,
  startTime,
  onAdjustStartTime,
}: BeatMapperSettingsProps) => {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4">
        <Input
          label="Compás (Beats)"
          type="number"
          size="sm"
          value={timeSignature.toString()}
          onChange={(e) => setTimeSignature(parseInt(e.target.value) || 4)}
          description="Ej: 4 para 4/4"
        />

        <div className="flex flex-col gap-1">
          <label className="text-xs text-white/50">Inicio (Offset)</label>
          <div className="flex items-center gap-2">
            <div className="flex flex-col gap-0.5">
              <button
                onClick={() => onAdjustStartTime(-100)}
                className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] text-white/70 hover:bg-white/10"
              >
                -0.1s
              </button>
              <button
                onClick={() => onAdjustStartTime(-10)}
                className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] text-white/70 hover:bg-white/10"
              >
                -0.01s
              </button>
            </div>
            <Input
              size="sm"
              value={startTime.toFixed(3)}
              readOnly
              className="flex-1 text-center font-mono"
              endContent={<span className="text-xs text-white/50">s</span>}
            />
            <div className="flex flex-col gap-0.5">
              <button
                onClick={() => onAdjustStartTime(100)}
                className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] text-white/70 hover:bg-white/10"
              >
                +0.1s
              </button>
              <button
                onClick={() => onAdjustStartTime(10)}
                className="rounded bg-white/5 px-1.5 py-0.5 text-[10px] text-white/70 hover:bg-white/10"
              >
                +0.01s
              </button>
            </div>
          </div>
          <p className="text-[10px] text-white/40">
            Ajusta el inicio exacto del primer golpe.
          </p>
        </div>
      </div>
    </div>
  );
};
