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
  eventManagerId: 0,
});
export type lyricSelectedProps = {
  position: number;
  action: 'forward' | 'backward';
};
export const $eventSelectedSong = atom<number>(0);
export const $eventLirycSelected = atom<number>(0);
export const $lyricSelected = atom<lyricSelectedProps>({
  position: 0,
  action: 'forward',
});
export const $selectedSongData = atom<EventSongsProps | undefined>(undefined);
export const $selectedSongLyricLength = atom<number>(0);

export const $eventConfig = atom({
  showChords: false,
  showKey: true,
});
export const $backgroundImage = atom<number>(1);
