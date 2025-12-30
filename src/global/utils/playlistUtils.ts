import { $PlayList, selectedSongProps } from '@stores/player';

export interface BaseSongForPlaylist {
  id: number;
  title: string;
  youtubeLink?: string | null;
  key?: string;
  tempo?: number;
  startTime?: number;
  hasSyncedLyrics?: boolean;
  hasSyncedChords?: boolean;
}

/**
 * Synchronizes the global playback playlist with a given list of songs.
 * Only songs with a valid youtubeLink are included in the playlist.
 *
 * @param songs - Array of songs to be included in the playlist
 * @param shouldSort - Whether to sort the playlist alphabetically by name
 */
export const syncGlobalPlaylist = (
  songs: BaseSongForPlaylist[] | undefined,
  shouldSort = false,
  bandId?: string,
) => {
  if (!songs) return;

  const songsWithYoutubeLink = songs.filter(
    (song) =>
      song.youtubeLink !== undefined &&
      song.youtubeLink !== null &&
      song.youtubeLink !== '',
  );

  if (songsWithYoutubeLink.length > 0) {
    const playlist: selectedSongProps[] = songsWithYoutubeLink.map((song) => ({
      id: song.id,
      youtubeLink: song.youtubeLink!,
      name: song.title,
      bandId: bandId,
      key: song.key,
      tempo: song.tempo,
      startTime: song.startTime,
      hasSyncedLyrics: song.hasSyncedLyrics,
      hasSyncedChords: song.hasSyncedChords,
    }));

    if (shouldSort) {
      playlist.sort((a, b) => a.name.localeCompare(b.name));
    }

    $PlayList.set(playlist);
  }
};
