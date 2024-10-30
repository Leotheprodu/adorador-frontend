import {
  EventByIdInterface,
  EventSongsProps,
} from '@iglesias/[churchId]/eventos/_interfaces/eventsInterface';
import { atom } from 'nanostores';

export const $event = atom<EventByIdInterface>({
  id: 0,
  title: '',
  date: '',
  songs: [],
});
export type lyricSelectedProps = {
  position: number;
  action: 'forward' | 'backward';
};
export const $eventSelectedSong = atom<number>(0);
export const $isStreamAdmin = atom<boolean>(false);
export const $eventLirycSelected = atom<number>(0);
export const $lyricSelected = atom<lyricSelectedProps>({
  position: 0,
  action: 'forward',
});
export const $selectedSongData = atom<EventSongsProps | undefined>(undefined);
export const $selectedSongLyricLength = atom<number>(0);

export const $eventConfig = atom({
  fontSize: 16,
  showChords: true,
  showLyrics: true,
  showStructure: true,
  showTitle: true,
  showKey: true,
});
