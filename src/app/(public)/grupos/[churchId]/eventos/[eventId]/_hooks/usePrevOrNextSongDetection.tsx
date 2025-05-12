import {
  $event,
  $lyricSelected,
  $selectedSongData,
  $selectedSongLyricLength,
} from '@stores/event';
import { useEventGateway } from '@app/(public)/grupos/[churchId]/eventos/[eventId]/_hooks/useEventGateway';
import { useStore } from '@nanostores/react';
import { useEffect } from 'react';

export const usePrevOrNextSongDetection = () => {
  const lyricSelected = useStore($lyricSelected);
  const selectedSongLyricLength = useStore($selectedSongLyricLength);
  const selectedSongData = useStore($selectedSongData);
  const data = useStore($event);

  const { sendMessage } = useEventGateway();
  useEffect(() => {
    if (lyricSelected.position === selectedSongLyricLength + 2) {
      const currentSongIndex = data?.songs.findIndex(
        (song) => song.song.id === selectedSongData?.song.id,
      );
      if (
        currentSongIndex !== undefined &&
        data &&
        currentSongIndex < data.songs.length - 1
      ) {
        const nextSong = data.songs[currentSongIndex + 1];
        sendMessage({ type: 'eventSelectedSong', data: nextSong.song.id });
      }
      sendMessage({
        type: 'lyricSelected',
        data: { position: 0, action: 'forward' },
      });
    } else if (lyricSelected.position === -1) {
      const currentSongIndex = data?.songs.findIndex(
        (song) => song.song.id === selectedSongData?.song.id,
      );
      if (currentSongIndex !== undefined && data && currentSongIndex > 0) {
        const previousSong = data.songs[currentSongIndex - 1];
        sendMessage({
          type: 'eventSelectedSong',
          data: previousSong.song.id,
        });
        sendMessage({
          type: 'lyricSelected',
          data: {
            position: previousSong.song.lyrics.length,
            action: 'backward',
          },
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lyricSelected, selectedSongLyricLength, selectedSongData, data]);
  return {};
};
