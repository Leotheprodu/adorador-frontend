export interface SongProps extends SongPropsWithoutId {
  id: number;
}

export interface SongPropsWithCount extends SongProps {
  _count: {
    events: number;
    lyrics: number;
  };
}

export interface SongPropsWithoutId {
  title: string;
  artist?: string;
  songType: 'worship' | 'praise';
  youtubeLink?: string;
  key?: string;
  tempo?: number;
}
