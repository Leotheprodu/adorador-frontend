export interface SongProps extends SongPropsWithoutId {
  id: number;
  videoLyrics?: SongVideoLyrics[];
}

export type SongSEOProps = Pick<SongProps, 'title' | 'artist' | 'youtubeLink'>;

export interface SongPropsWithCount extends SongProps {
  _count: {
    events: number;
    lyrics: number;
    videoLyrics: number;
  };
}

export interface SongPropsWithoutId {
  title: string;
  artist?: string;
  songType: 'worship' | 'praise';
  youtubeLink?: string;
  key?: string;
  tempo?: number;
  startTime?: number;
}

export interface SongVideoLyrics {
  id: number;
  youtubeId: string;
  title?: string;
  usesVideoLyrics: boolean; // true = usar lyrics del video, false = sincronizar con BD
  videoType: 'instrumental' | 'full'; // instrumental = sin voces, full = con voces
  description?: string;
  priority: number;
  isPreferred: boolean;
}
