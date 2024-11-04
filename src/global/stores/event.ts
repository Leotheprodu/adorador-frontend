import {
  EventByIdInterface,
  EventSongsProps,
} from '@iglesias/[churchId]/eventos/_interfaces/eventsInterface';
import { atom } from 'nanostores';
import { Socket } from 'socket.io-client';

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
export const $eventSocket = atom<Socket | null>(null);
export const $eventAdminName = atom<string>('');
export const $eventSelectedSongId = atom<number>(0);
export const $eventLirycSelected = atom<number>(0);
export const $eventLiveMessage = atom<string>('');
export const $lyricSelected = atom<lyricSelectedProps>({
  position: 0,
  action: 'forward',
});
export const $selectedSongData = atom<EventSongsProps | undefined>(undefined);
export const $selectedSongLyricLength = atom<number>(0);

export const $eventConfig = atom({
  showChords: false,
  showKey: true,
  backgroundImage: 1,
});
