import { EventsProps } from '@bands/[bandId]/eventos/_interfaces/eventsInterface';

export interface BandsProps {
  id: number;
  name: string;
  events: EventsProps[];
  _count: {
    events: number;
    members: number;
    songs: number;
  };
}
