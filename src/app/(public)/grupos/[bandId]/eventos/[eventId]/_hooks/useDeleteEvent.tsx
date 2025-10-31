import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { deleteEventService } from '@bands/[bandId]/eventos/_services/eventsOfBandService';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';

export const useDeleteEvent = ({
  bandId,
  eventId,
  onSuccess,
  redirectOnDelete = true,
}: {
  bandId: string;
  eventId: string;
  onSuccess?: () => void;
  redirectOnDelete?: boolean;
}) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const {
    mutate: mutateDeleteEvent,
    status: statusDeleteEvent,
    reset,
  } = deleteEventService({ bandId, eventId });

  const handleDeleteEvent = () => {
    mutateDeleteEvent(null);
  };

  useEffect(() => {
    if (statusDeleteEvent === 'success') {
      toast.success('Evento eliminado correctamente');
      reset();

      // Invalidar las queries relacionadas para forzar refetch
      queryClient.invalidateQueries({ queryKey: ['BandById'] });
      queryClient.invalidateQueries({ queryKey: ['EventsOfBand'] });

      // Ejecutar callback personalizado si existe
      if (onSuccess) {
        onSuccess();
      }

      // Redirigir solo si está habilitado
      if (redirectOnDelete) {
        router.push(`/grupos/${bandId}/eventos`);
      }
    }
    if (statusDeleteEvent === 'error') {
      toast.error('Error al eliminar el evento');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusDeleteEvent]);

  return {
    handleDeleteEvent,
    statusDeleteEvent,
  };
};
