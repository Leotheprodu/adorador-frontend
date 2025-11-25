import { PlayerProgressBarProps } from "../../_interfaces/musicPlayerInterfaces";


export const PlayerProgressBar = ({
    progress,
    progressDuration,
    duration,
    onSeek,
}: PlayerProgressBarProps) => {
    return (
        <div className="peer absolute z-30 flex w-full overflow-hidden duration-200 top-[-2rem] h-[2rem]">
            <div
                className="absolute left-0 z-40 h-[2rem] bg-brand-blue-700 duration-1000 ease-linear"
                style={{ width: `${progress * 100}%` }}
            />
            <div
                className="absolute left-0 z-30 h-[2rem] bg-brand-purple-700"
                style={{ width: `${100}%` }}
            />
            <p className="absolute top-[.2rem] z-50 ml-4 flex text-white">
                {progressDuration}
            </p>
            <p className="absolute right-0 top-[.2rem] z-50 mr-4 flex text-white">
                {duration}
            </p>
            <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={progress}
                onChange={(e) => onSeek(parseFloat(e.target.value))}
                className="absolute z-50 h-[4rem] w-full cursor-pointer opacity-0"
            />
        </div>
    );
};
