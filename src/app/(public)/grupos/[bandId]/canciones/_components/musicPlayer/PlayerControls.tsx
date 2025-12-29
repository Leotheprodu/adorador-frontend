import { Button } from '@heroui/react';
import { PlayIcon } from '@global/icons/PlayIcon';
import { PauseIcon } from '@global/icons/PauseIcon';
import { ForwardIcon } from '@global/icons/ForwardIcon';
import { BackwardIcon } from '@global/icons/BackwardIcon';

import { PlayerControlsProps } from '../../_interfaces/musicPlayerInterfaces';
import { MetronomeIcon, MicrophoneIcon } from '@global/icons';

export const PlayerControls = ({
  playing,
  hasSelectedBeat,
  hasMultipleSongs,
  onPlayPause,
  onNext,
  onPrev,
  onToggleMetronome,
  isMetronomeOpen,
  onToggleLyrics,
  isLyricsOpen,
}: PlayerControlsProps) => {
  return (
    <div className="relative flex items-center justify-center gap-5">
      {hasMultipleSongs && (
        <button
          type="button"
          className="flex items-center justify-center rounded-full p-1 opacity-75 duration-75 ease-in-out hover:opacity-100 active:scale-90"
          onClick={onPrev}
          aria-label="Anterior"
        >
          <BackwardIcon className="text-primary-200" />
        </button>
      )}
      <Button
        type="button"
        radius="full"
        className="m-0 flex h-10 w-10 min-w-0 items-center justify-center bg-primario p-0 opacity-75 duration-75 ease-in-out hover:opacity-100"
        onPress={(e) =>
          onPlayPause(e as unknown as React.MouseEvent<HTMLButtonElement>)
        }
        aria-label={playing ? 'Pausar' : 'Reproducir'}
      >
        {playing && hasSelectedBeat && (
          <PauseIcon className="scale-125 text-primary-500" />
        )}
        {(!playing || !hasSelectedBeat) && (
          <PlayIcon className="scale-125 text-primary-500" />
        )}
      </Button>
      {hasMultipleSongs && (
        <button
          type="button"
          className="flex items-center justify-center rounded-full p-1 opacity-75 duration-75 ease-in-out hover:opacity-100 active:scale-90"
          onClick={onNext}
          aria-label="Siguiente"
        >
          <ForwardIcon className="text-primary-200" />
        </button>
      )}

      {/* Tools Toggle Buttons */}
      <div className="absolute -right-24 flex items-center gap-2">
        {onToggleMetronome && (
          <button
            type="button"
            className={`flex items-center justify-center rounded-full p-2 transition-all duration-200 hover:bg-white/10 ${isMetronomeOpen ? 'bg-white/20 text-brand-purple-400' : 'text-primary-200/50 hover:text-primary-200'}`}
            onClick={onToggleMetronome}
            aria-label="Metrónomo"
            title="Mostrar/Ocultar Metrónomo"
          >
            <MetronomeIcon className="h-5 w-5" />
          </button>
        )}
        {onToggleLyrics && (
          <button
            type="button"
            className={`flex items-center justify-center rounded-full p-2 transition-all duration-200 hover:bg-white/10 ${isLyricsOpen ? 'bg-white/20 text-brand-purple-400' : 'text-primary-200/50 hover:text-primary-200'}`}
            onClick={onToggleLyrics}
            aria-label="Letra"
            title="Mostrar/Ocultar Letra"
          >
            <MicrophoneIcon className="h-5 w-5" />
          </button>
        )}
      </div>
    </div>
  );
};
