import { useEffect } from 'react';
import { getEventsById } from '@bands/[bandId]/eventos/[eventId]/en-vivo/_services/eventByIdService';
import {
  $event,
  $eventSelectedSongId,
  $eventLirycSelected,
  $eventLiveMessage,
  $selectedSongData,
  $selectedSongLyricLength,
  $lyricSelected,
} from '@stores/event';
import { useEventWSConexion } from './useEventWSConexion';
import { usePrevOrNextSongDetection } from './usePrevOrNextSongDetection';

export const useEventByIdPage = ({
  params,
}: {
  params: { bandId: string; eventId: string };
}) => {
  // Limpiar estado del evento INMEDIATAMENTE cuando cambia el eventId (antes de cargar datos)
  useEffect(() => {
    // Resetear todos los stores relacionados al evento
    $eventSelectedSongId.set(0);
    $eventLirycSelected.set(0);
    $eventLiveMessage.set('');
    $selectedSongData.set(undefined);
    $selectedSongLyricLength.set(0);
    $lyricSelected.set({ position: 0, action: 'forward' });
    $event.set({
      id: 0,
      title: '',
      date: '',
      bandId: 0,
      songs: [],
    });
  }, [params.eventId]);

  const { data, isLoading, status, refetch } = getEventsById({
    bandId: params.bandId,
    eventId: params.eventId,
  });
  usePrevOrNextSongDetection();
  useEventWSConexion({ params });

  useEffect(() => {
    document.title = `${data?.title}`;
  }, [data]);

  useEffect(() => {
    if (status === 'success' && data) {
      $event.set(data);
    }
  }, [status, data]);

  return {
    isLoading,
    data,
    refetch,
  };
};
