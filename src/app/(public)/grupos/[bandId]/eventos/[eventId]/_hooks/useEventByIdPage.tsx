import { useEffect } from 'react';
import { getEventsById } from '@bands/[bandId]/eventos/[eventId]/_services/eventByIdService';
import { $event } from '@stores/event';
import { useEventWSConexion } from './useEventWSConexion';
import { usePrevOrNextSongDetection } from './usePrevOrNextSongDetection';

export const useEventByIdPage = ({
  params,
}: {
  params: { bandId: string; eventId: string };
}) => {
  const { data, isLoading, status, refetch, isRefetching } = getEventsById({
    bandId: params.bandId,
    eventId: params.eventId,
  });
  usePrevOrNextSongDetection();
  useEventWSConexion({ params });

  useEffect(() => {
    document.title = `${data?.title}`;
  }, [data]);

  useEffect(() => {
    if (status === 'success') {
      $event.set(data);
    }
  }, [status, data, isRefetching]);

  return {
    isLoading,
    data,
    refetch,
  };
};
