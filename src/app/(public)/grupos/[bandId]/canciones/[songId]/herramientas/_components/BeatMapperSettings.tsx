import { Input, Slider } from '@heroui/react';

interface BeatMapperSettingsProps {
  timeSignature: number;
  setTimeSignature: (val: number) => void;
  zoomLevel: number;
  setZoomLevel: (val: number) => void;
}

export const BeatMapperSettings = ({
  timeSignature,
  setTimeSignature,
  zoomLevel,
  setZoomLevel,
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
      </div>

      <div className="px-1">
        <label className="mb-1 block text-xs text-white/50">
          Zoom Timeline
        </label>
        <Slider
          size="sm"
          step={0.1}
          minValue={0.5}
          maxValue={10}
          value={zoomLevel}
          onChange={(v) => setZoomLevel(v as number)}
          aria-label="Zoom Level"
        />
      </div>
    </div>
  );
};
