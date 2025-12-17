import { useStore } from '@nanostores/react';
import {
  $videoProgress,
  $videoProgressDuration,
  $videoDuration,
} from '@stores/videoPlayer';
import { useEventGateway } from '@bands/[bandId]/eventos/[eventId]/en-vivo/_hooks/useEventGateway';

interface VideoControlBarProps {
  isEventManager: boolean;
}

export const VideoControlBar = ({ isEventManager }: VideoControlBarProps) => {
  const { sendMessage } = useEventGateway();
  const progress = useStore($videoProgress);
  const progressDuration = useStore($videoProgressDuration);
  const duration = useStore($videoDuration);

  const handleSeek = (value: number) => {
    if (!isEventManager) return;

    // Emit WebSocket event for synchronization
    sendMessage({
      type: 'videoSeek',
      data: {
        seekTo: value,
      },
    });

    // Update local store
    $videoProgress.set(value);
  };

  return (
    <div className="flex flex-col gap-2 rounded-lg bg-content2 p-3">
      <div className="flex items-center justify-between text-xs font-medium text-default-600">
        <span>Control de Video</span>
        <div className="flex gap-2">
          <span>{progressDuration}</span>
          <span>/</span>
          <span>{duration}</span>
        </div>
      </div>

      {/* Progress bar for seeking */}
      <div className="relative flex h-8 w-full items-center">
        {/* Progress bar background */}
        <div className="absolute h-2 w-full rounded-full bg-default-200">
          {/* Progress bar filled */}
          <div
            className="h-full rounded-full bg-brand-blue-500 transition-all duration-300"
            style={{ width: `${progress * 100}%` }}
          />
        </div>

        {/* Seek input */}
        <input
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={progress}
          onChange={(e) => handleSeek(parseFloat(e.target.value))}
          disabled={!isEventManager}
          className="absolute z-10 h-8 w-full cursor-pointer opacity-0 disabled:cursor-not-allowed"
          title={
            isEventManager
              ? 'Arrastrar para buscar en el video'
              : 'Solo el event manager puede controlar'
          }
        />
      </div>

      {!isEventManager && (
        <p className="text-xs text-default-400">
          Solo el event manager puede controlar el video
        </p>
      )}

      {progress === 0 && duration === '0:00' && (
        <p className="text-xs text-warning">
          ⏳ Esperando sincronización con proyector...
        </p>
      )}
    </div>
  );
};
