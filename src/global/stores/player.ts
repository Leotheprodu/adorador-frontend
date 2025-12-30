import { atom } from 'nanostores';
import ReactPlayer from 'react-player';

export type selectedSongProps = {
  id: number;
  youtubeLink?: string;
  name: string;
  tempo?: number;
  startTime?: number;
  key?: string;
  bandId?: string;
  hasSyncedLyrics?: boolean;
  hasSyncedChords?: boolean;
};

export const $SelectedSong = atom<selectedSongProps | null>(null);
export const $PlayList = atom<selectedSongProps[]>([
  {
    id: 0,
    youtubeLink: '',
    name: '',
  },
]);

export const $CurrentTime = atom<number>(0);
export const $IsPlaying = atom<boolean>(false);
export const $PlayerRef = atom<ReactPlayer | null>(null);
