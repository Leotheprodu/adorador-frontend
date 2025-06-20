import { keyChordQualities, keys, songKeys } from '@global/config/constants';

export interface EventsProps {
  id: number;
  title: string;
  date: string | Date;
  bandId: number;
}

export interface EventSongsProps {
  transpose: number;
  order: number;
  song: SongEventProps;
}
export type keysType = (typeof songKeys)[number];
export type ChordType = (typeof keys)[number];
export type ChordQualityType = (typeof keyChordQualities)[number];

export interface ChordProps extends ChordPropsWithoutId {
  id: number;
}
export interface ChordPropsWithoutId {
  rootNote: ChordType;
  chordQuality?: ChordQualityType | '' | undefined;
  slashChord?: ChordType | '' | undefined;
  position: number;
}
export interface StructureProps {
  id: number;
  title: string;
}

export interface LyricsProps {
  id: number;
  position: number;
  lyrics: string;
  structure: StructureProps;
  chords: ChordProps[];
}
export interface SongEventProps {
  id: number;
  title: string;
  artist: string | null;
  songType: 'worship' | 'praise';
  key: keysType | null;
  lyrics: LyricsProps[];
}

export interface EventByIdInterface extends EventsProps {
  songs: EventSongsProps[];
}
