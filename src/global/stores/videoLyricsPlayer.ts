import { atom } from 'nanostores';
import type ReactPlayer from 'react-player';

// Store para mantener referencia al player de YouTube en VideoLyrics
export const $videoLyricsPlayerRef = atom<React.RefObject<ReactPlayer> | null>(
  null,
);
