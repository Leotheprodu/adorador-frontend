import { LyricsDragHandleProps } from '../../_interfaces/lyricsInterfaces';

export const LyricsDragHandle = ({ dragHandleProps }: LyricsDragHandleProps) => {
    return (
        <div
            {...dragHandleProps}
            className="flex shrink-0 cursor-grab flex-col gap-0.5 rounded-md p-1.5 opacity-30 transition-all hover:bg-slate-200 hover:opacity-100 active:cursor-grabbing active:bg-slate-300"
            title="Arrastra para mover"
        >
            <div className="h-1 w-1 rounded-full bg-slate-500"></div>
            <div className="h-1 w-1 rounded-full bg-slate-500"></div>
            <div className="h-1 w-1 rounded-full bg-slate-500"></div>
        </div>
    );
};
