import { atom } from 'nanostores';

export interface ActiveChordData {
  rootNote: string;
  chordQuality?: string;
  slashChord?: string;
  id: number;
  transpose: number;
  startTime: number;
  nextChord?: {
    rootNote: string;
    chordQuality?: string;
    slashChord?: string;
    id: number;
    startTime: number;
  } | null;
}

export interface SongChordContext {
  rootNote: string;
  chordQuality?: string;
  slashChord?: string;
  id: number;
  startTime: number;
}

export interface SongLyricContext {
  id: number;
  lyrics: string;
  startTime: number;
  structureTitle?: string;
}

export const $ActiveChord = atom<ActiveChordData | null>(null);
export const $SongChords = atom<SongChordContext[]>([]);
export const $SongLyrics = atom<SongLyricContext[]>([]);
export const $ActiveLyricId = atom<number | null>(null);
