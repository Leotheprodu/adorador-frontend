import { useStore } from '@nanostores/react';
import { useMemo, useEffect } from 'react';
import {
  $event,
  $eventSelectedSongId,
  $selectedSongData,
  $selectedSongLyricLength,
  $eventConfig,
} from '@stores/event';
import { $user } from '@stores/users';
import { userRoles } from '@global/config/constants';
import { useEventGateway } from '@bands/[bandId]/eventos/[eventId]/_hooks/useEventGateway';

export function useEventSongNavigation() {
  const eventData = useStore($event);
  const eventConfig = useStore($eventConfig);
  const selectedSongId = useStore($eventSelectedSongId);
  const selectedSongData = useStore($selectedSongData);
  const selectedSongLyricLength = useStore($selectedSongLyricLength);
  const user = useStore($user);
  const { sendMessage } = useEventGateway();
  const { songs } = eventData;

  // Verificar si es administrador de la app O event manager
  const isEventManager = useMemo(() => {
    if (user?.isLoggedIn && user?.roles.includes(userRoles.admin.id)) {
      return true;
    }
    if (user?.isLoggedIn && user?.membersofBands) {
      return user.membersofBands.some(
        (band) => band.band.id === eventData?.bandId && band.isEventManager,
      );
    }
    return false;
  }, [user, eventData]);

  // Encontrar índice de la canción actual y verificar si hay anterior/siguiente
  const currentSongIndex = songs.findIndex(
    (song) => song.song.id === selectedSongId,
  );
  const hasPreviousSong = currentSongIndex > 0;
  const hasNextSong =
    currentSongIndex >= 0 && currentSongIndex < songs.length - 1;

  // Funciones para navegar entre canciones
  const goToPreviousSong = () => {
    if (hasPreviousSong && isEventManager) {
      const previousSong = songs[currentSongIndex - 1];
      sendMessage({ type: 'eventSelectedSong', data: previousSong.song.id });
      sendMessage({
        type: 'lyricSelected',
        data: {
          position: 0,
          action: 'forward',
        },
      });
    }
  };

  const goToNextSong = () => {
    if (hasNextSong && isEventManager) {
      const nextSong = songs[currentSongIndex + 1];
      sendMessage({ type: 'eventSelectedSong', data: nextSong.song.id });
      sendMessage({
        type: 'lyricSelected',
        data: {
          position: 0,
          action: 'forward',
        },
      });
    }
  };

  const startSong = () => {
    sendMessage({
      type: 'lyricSelected',
      data: {
        position: 1,
        action: 'forward',
      },
    });
  };

  // Efectos para mantener datos sincronizados
  useEffect(() => {
    const lyricsLength = selectedSongData?.song?.lyrics?.length || 0;
    if (lyricsLength > 0) {
      $selectedSongLyricLength.set(lyricsLength);
    } else {
      $selectedSongLyricLength.set(0);
    }
  }, [selectedSongData]);

  useEffect(() => {
    if (songs) {
      const songId = selectedSongId;
      const song = songs.find((song) => song.song.id === songId);
      if (song) {
        $selectedSongData.set(song);
      }
    }
  }, [songs, selectedSongId]);

  return {
    eventData,
    eventConfig,
    selectedSongId,
    selectedSongData,
    selectedSongLyricLength,
    isEventManager,
    hasPreviousSong,
    hasNextSong,
    goToPreviousSong,
    goToNextSong,
    startSong,
    sendMessage,
  };
}
