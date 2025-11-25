import { PlayerVolumeControlProps } from "../../_interfaces/musicPlayerInterfaces";


export const PlayerVolumeControl = ({
    volume,
    onVolumeChange,
}: PlayerVolumeControlProps) => {
    return (
        <div className="flex items-center justify-center gap-1">
            <input
                type="range"
                min={0}
                max={1}
                step={0.1}
                value={volume !== null ? volume : 0.5}
                onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
                className="MusicPlayer-volumen opacity-75 duration-75 hover:opacity-100"
            />
        </div>
    );
};
