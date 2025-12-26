import { atom } from 'nanostores';

export type selectedSongProps = {
  id: number;
  youtubeLink?: string;
  name: string;
  tempo?: number;
  startTime?: number;
};

export const $SelectedSong = atom<selectedSongProps | null>(null);
export const $PlayList = atom<selectedSongProps[]>([
  {
    id: 0,
    youtubeLink: '',
    name: '',
  },
]);
