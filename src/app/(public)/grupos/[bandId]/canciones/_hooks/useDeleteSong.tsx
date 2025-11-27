import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { deleteSongService } from '@bands/[bandId]/canciones/_services/songsOfBandService';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useInvalidateSubscriptionLimits } from '@bands/[bandId]/suscripcion/_hooks/useInvalidateSubscriptionLimits';

export const useDeleteSong = ({
  bandId,
  songId,
  onSuccess,
  redirectOnDelete = true,
}: {
  bandId: string;
  songId: string;
  onSuccess?: () => void;
  redirectOnDelete?: boolean;
}) => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { invalidateLimits } = useInvalidateSubscriptionLimits();

  const {
    mutate: mutateDeleteSong,
    status: statusDeleteSong,
    reset,
  } = deleteSongService({ bandId, songId });

  const handleDeleteSong = () => {
    mutateDeleteSong();
  };

  useEffect(() => {
    if (statusDeleteSong === 'success') {
      toast.success('Canción eliminada correctamente');
      reset();

      // Invalidar las queries relacionadas para forzar refetch
      queryClient.invalidateQueries({ queryKey: ['SongsOfBand', bandId] });
      queryClient.invalidateQueries({ queryKey: ['BandById', bandId] });
      // Invalidar la lista de grupos del usuario (donde se muestra el contador de canciones)
      queryClient.invalidateQueries({ queryKey: ['BandsOfUser'] });
      // Invalidar límites de suscripción (currentSongs disminuyó)
      invalidateLimits(bandId);

      // Ejecutar callback personalizado si existe
      if (onSuccess) {
        onSuccess();
      }

      // Redirigir solo si está habilitado
      if (redirectOnDelete) {
        router.push(`/grupos/${bandId}/canciones`);
      }
    }
    if (statusDeleteSong === 'error') {
      toast.error('Error al eliminar la canción');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusDeleteSong]);

  return {
    handleDeleteSong,
    statusDeleteSong,
  };
};
