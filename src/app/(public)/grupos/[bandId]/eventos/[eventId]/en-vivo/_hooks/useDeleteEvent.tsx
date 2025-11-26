import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { deleteEventService } from '@bands/[bandId]/eventos/_services/eventsOfBandService';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useInvalidateSubscriptionLimits } from '@bands/[bandId]/suscripcion/_hooks/useInvalidateSubscriptionLimits';

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
  const { invalidateLimits } = useInvalidateSubscriptionLimits();

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
      queryClient.invalidateQueries({ queryKey: ['BandById', bandId] });
      queryClient.invalidateQueries({ queryKey: ['EventsOfBand', bandId] });
      // Invalidar la lista de grupos del usuario (donde se muestran los eventos en las cards)
      queryClient.invalidateQueries({ queryKey: ['BandsOfUser'] });
      // Invalidar límites de suscripción (currentEventsThisMonth disminuyó)
      invalidateLimits(bandId);

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
