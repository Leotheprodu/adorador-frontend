import { SongProps } from '@bands/[bandId]/canciones/_interfaces/songsInterface';
import { EventsProps } from '@bands/[bandId]/eventos/_interfaces/eventsInterface';

export interface BandsProps {
  id: number;
  name: string;
  events: EventsProps[];
  _count: {
    events: number;
    songs: number;
  };
}

export interface BandsWithMembersCount extends BandsProps {
  _count: {
    events: number;
    songs: number;
    members: number;
  };
}

export interface BandWithSongsProps extends BandsProps {
  songs: SongProps[];
  _count: {
    events: number;
    songs: number;
  };
}
