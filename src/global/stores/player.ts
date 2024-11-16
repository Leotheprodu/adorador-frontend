import { atom } from 'nanostores';

export type selectedSongProps = {
  id: number;
  youtubeLink?: string;
  name: string;
};

export const $SelectedSong = atom<selectedSongProps | null>(null);
export const $PlayList = atom<selectedSongProps[]>([
  {
    id: 0,
    youtubeLink: '',
    name: '',
  },
]);
