import { EventSongsProps } from '@bands/[bandId]/eventos/_interfaces/eventsInterface';
import { DraggableProvidedDragHandleProps } from '@hello-pangea/dnd';

export interface SongCardWithControlsProps {
    data: EventSongsProps;
    index: number;
    isAdminEvent: boolean;
    songOrder: EventSongsProps[];
    setSongOrder: (songs: EventSongsProps[]) => void;
}

export interface TransposeControlPopoverProps {
    data: EventSongsProps;
    index: number;
    songOrder: EventSongsProps[];
    setSongOrder: (songs: EventSongsProps[]) => void;
}

export interface SongCardContentProps {
    data: EventSongsProps;
}

export interface SongDragHandleProps {
    dragHandleProps: DraggableProvidedDragHandleProps | null;
}
