import { atom } from 'nanostores';

// Store para mantener referencia al player de YouTube en VideoLyrics
export const $videoLyricsPlayerRef = atom<any>(null);
