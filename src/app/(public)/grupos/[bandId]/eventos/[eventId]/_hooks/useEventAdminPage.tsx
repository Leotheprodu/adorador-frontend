'use client';
import { getEventsById } from '@bands/[bandId]/eventos/[eventId]/en-vivo/_services/eventByIdService';

export const useEventAdminPage = ({
  params,
}: {
  params: { bandId: string; eventId: string };
}) => {
  const { data: event, isLoading, error, refetch } = getEventsById(params);

  return {
    event,
    isLoading,
    error,
    refetch,
  };
};
