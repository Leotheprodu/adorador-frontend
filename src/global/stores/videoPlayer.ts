import { atom } from 'nanostores';

// Video progress state for VideoLyrics events
export const $videoProgress = atom<number>(0); // 0 to 1
export const $videoProgressDuration = atom<string>('0:00'); // Current time
export const $videoDuration = atom<string>('0:00'); // Total duration
export const $videoPlayerReady = atom<boolean>(false); // Is video player loaded and ready
