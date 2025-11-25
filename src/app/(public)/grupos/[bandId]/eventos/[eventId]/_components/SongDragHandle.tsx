import { SongDragHandleProps } from '../_interfaces/songCardInterfaces';

export const SongDragHandle = ({ dragHandleProps }: SongDragHandleProps) => {
    return (
        <div {...dragHandleProps} className="cursor-grab active:cursor-grabbing">
            <div className="flex flex-col gap-0.5 opacity-40 transition-opacity duration-200 group-hover:opacity-100">
                <div className="h-1 w-1 rounded-full bg-slate-400"></div>
                <div className="h-1 w-1 rounded-full bg-slate-400"></div>
                <div className="h-1 w-1 rounded-full bg-slate-400"></div>
            </div>
        </div>
    );
};
