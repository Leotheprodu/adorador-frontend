import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { deleteSongService } from '@bands/[bandId]/canciones/_services/songsOfBandService';
import { useRouter } from 'next/navigation';

export const useDeleteSong = ({
  bandId,
  songId,
}: {
  bandId: string;
  songId: string;
}) => {
  const router = useRouter();
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
      // Redirigir a la lista de canciones después de eliminar
      router.push(`/grupos/${bandId}/canciones`);
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
