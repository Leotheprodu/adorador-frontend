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

export const $ActiveChord = atom<ActiveChordData | null>(null);
