import { useEffect } from 'react';
import { EventSongsProps } from '@bands/[bandId]/eventos/_interfaces/eventsInterface';
import { syncGlobalPlaylist } from '@global/utils/playlistUtils';

/**
 * Hook to synchronize the global playlist with the songs from an event.
 *
 * @param eventSongs - The list of songs the event has.
 */
export const useEventPlaylist = (eventSongs: EventSongsProps[] | undefined) => {
  useEffect(() => {
    if (eventSongs) {
      // Map event songs to the structure expected by the playlist utility
      // and maintain the order specified in the event.
      const songsForPlaylist = eventSongs.map((item) => ({
        id: item.song.id,
        title: item.song.title,
        youtubeLink: item.song.youtubeLink,
      }));

      // In the event page, we don't sort alphabetically,
      // we keep the order of the event (shouldSort = false).
      syncGlobalPlaylist(songsForPlaylist, false);
    }
  }, [eventSongs]);
};
