import { EventByIdInterface } from '@iglesias/[churchId]/eventos/_interfaces/eventsInterface';
import { atom } from 'nanostores';

export const $event = atom<EventByIdInterface>({
  id: 0,
  title: '',
  date: '',
  songs: [],
});

export const $eventSelectedSong = atom<number>(0);

export const $eventLirycSelected = atom<number>(0);

export const $eventConfig = atom({
  fontSize: 16,
  showChords: true,
  showLyrics: true,
  showStructure: true,
  showTitle: true,
  showKey: true,
});
