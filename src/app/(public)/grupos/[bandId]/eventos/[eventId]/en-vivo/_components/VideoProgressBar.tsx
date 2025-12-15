interface VideoProgressBarProps {
  progress: number; // 0 to 1
  progressDuration: string; // "1:23"
  duration: string; // "3:45"
  onSeek: (value: number) => void;
  isFullscreen: boolean;
}

export const VideoProgressBar = ({
  progress,
  progressDuration,
  duration,
  onSeek,
  isFullscreen,
}: VideoProgressBarProps) => {
  return (
    <div
      className={`absolute bottom-0 left-0 z-30 flex w-full overflow-hidden ${isFullscreen ? 'h-[3rem]' : 'h-[2.5rem]'}`}
    >
      {/* Progress bar (filled) */}
      <div
        className="absolute left-0 z-40 h-full bg-brand-blue-600 transition-all duration-300 ease-linear"
        style={{ width: `${progress * 100}%` }}
      />

      {/* Background bar */}
      <div
        className="absolute left-0 z-30 h-full bg-black/50 backdrop-blur-sm"
        style={{ width: '100%' }}
      />

      {/* Current time */}
      <p
        className={`absolute left-0 top-1/2 z-50 ml-4 flex -translate-y-1/2 font-medium text-white ${isFullscreen ? 'text-base' : 'text-sm'}`}
      >
        {progressDuration}
      </p>

      {/* Total duration */}
      <p
        className={`absolute right-0 top-1/2 z-50 mr-4 flex -translate-y-1/2 font-medium text-white ${isFullscreen ? 'text-base' : 'text-sm'}`}
      >
        {duration}
      </p>

      {/* Invisible input for seeking */}
      <input
        type="range"
        min={0}
        max={1}
        step={0.01}
        value={progress}
        onChange={(e) => onSeek(parseFloat(e.target.value))}
        className="absolute z-50 h-full w-full cursor-pointer opacity-0"
        title="Arrastrar para buscar en el video"
      />
    </div>
  );
};
