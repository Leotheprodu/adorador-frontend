export interface SongProps extends SongPropsWithoutId {
  id: number;
}

export interface SongPropsWithoutId {
  title: string;
  artist?: string;
  songType: 'worship' | 'praise';
  youtubeLink?: string;
  key?: string;
  tempo?: number;
}
