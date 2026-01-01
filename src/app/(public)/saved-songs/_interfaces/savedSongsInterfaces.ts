import { SongPropsWithCount } from '@app/(public)/grupos/[bandId]/canciones/_interfaces/songsInterface';

export interface SavedSongsResponse {
  data: SavedSongItem[];
  meta: Meta;
}

export interface SavedSongItem {
  id: number;
  userId: number;
  songId: number;
  song: SongById;
  createdAt: string;
}

export interface SongById {
  id: number;
  title: string;
  artist: string;
  songType: 'worship' | 'praise';
  youtubeLink: string;
  startTime: number;
  endTime: number;
  tempo: number;
  key: string;
  createdAt: string;
  updatedAt: string;
  bandId: number;
  _count?: Count;
}

interface Count {
  videoLyrics: number;
  lyrics: number;
  events: number;
}

interface Meta {
  total: number;
  lastPage: number;
  currentPage: number;
  perPage: number;
  prev: null;
  next: null;
}
