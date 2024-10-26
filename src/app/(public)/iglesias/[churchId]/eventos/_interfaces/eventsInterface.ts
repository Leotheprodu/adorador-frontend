export interface EventsProps {
  id: number;
  title: string;
  date: string | Date;
}

export interface EventSongsProps {
  id: number;
  title: string;
  songType: 'worship' | 'praise';
}

export interface EventByIdInterface extends EventsProps {
  songs: EventSongsProps[];
}
