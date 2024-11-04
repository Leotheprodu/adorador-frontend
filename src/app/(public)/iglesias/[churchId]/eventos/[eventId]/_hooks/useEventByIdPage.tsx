import { useEffect } from 'react';
import { getEventsById } from '@iglesias/[churchId]/eventos/[eventId]/_services/eventByIdService';
import { $event } from '@stores/event';
import { useEventWSConexion } from './useEventWSConexion';
import { usePrevOrNextSongDetection } from './usePrevOrNextSongDetection';

export const useEventByIdPage = ({
  params,
}: {
  params: { churchId: string; eventId: string };
}) => {
  const { data, isLoading, status, refetch } = getEventsById({
    churchId: params.churchId,
    eventId: params.eventId,
  });
  usePrevOrNextSongDetection();
  useEventWSConexion({ params });

  useEffect(() => {
    if (status === 'success') {
      $event.set(data);
    }
  }, [status, data]);

  useEffect(() => {
    document.title = `${data?.title}`;
  }, [data]);

  useEffect(() => {
    if (status === 'success') {
      $event.set(data);
    }
  }, [status, data]);

  return {
    isLoading,
    data,
    refetch,
  };
};
