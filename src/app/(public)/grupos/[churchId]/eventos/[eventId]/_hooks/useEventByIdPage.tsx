import { useEffect } from 'react';
import { getEventsById } from '@app/(public)/grupos/[churchId]/eventos/[eventId]/_services/eventByIdService';
import { $event } from '@stores/event';
import { useEventWSConexion } from './useEventWSConexion';
import { usePrevOrNextSongDetection } from './usePrevOrNextSongDetection';

export const useEventByIdPage = ({
  params,
}: {
  params: { churchId: string; eventId: string };
}) => {
  const { data, isLoading, status, refetch, isRefetching } = getEventsById({
    churchId: params.churchId,
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
      console.log('data', data);
    }
  }, [status, data, isRefetching]);

  return {
    isLoading,
    data,
    refetch,
  };
};
