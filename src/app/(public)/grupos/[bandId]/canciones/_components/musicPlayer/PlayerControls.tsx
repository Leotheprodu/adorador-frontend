import { Button } from '@nextui-org/react';
import { PlayIcon } from '@global/icons/PlayIcon';
import { PauseIcon } from '@global/icons/PauseIcon';
import { ForwardIcon } from '@global/icons/ForwardIcon';
import { BackwardIcon } from '@global/icons/BackwardIcon';
import { PlayerControlsProps } from '../../_interfaces/musicPlayerInterfaces';

export const PlayerControls = ({
    playing,
    hasSelectedBeat,
    hasMultipleSongs,
    onPlayPause,
    onNext,
    onPrev,
}: PlayerControlsProps) => {
    return (
        <div className="flex items-center justify-center gap-5">
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
                onClick={onPlayPause}
                aria-label={playing ? "Pausar" : "Reproducir"}
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
        </div>
    );
};
