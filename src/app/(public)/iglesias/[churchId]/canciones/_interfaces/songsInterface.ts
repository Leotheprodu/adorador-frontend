export interface SongProps {
  id: number;
  title: string;
  artist: string | null;
  songType: 'worship' | 'praise';
  youtubeLink: string | null;
  key: string | null;
  tempo: number | null;
}
