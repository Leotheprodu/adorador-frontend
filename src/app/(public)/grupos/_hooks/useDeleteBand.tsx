import { useState } from 'react';
import { PostData } from '@global/services/HandleAPI';
import { Server1API } from '@global/config/constants';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';

interface DeleteBandParams {
  password: string;
  confirmation: string;
}

export const useDeleteBand = (bandId: number) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const queryClient = useQueryClient();

  const { mutateAsync: deleteBandMutation, status: deleteBandStatus } =
    PostData<void, DeleteBandParams>({
      key: `DeleteBand-${bandId}`,
      url: `${Server1API}/bands/${bandId}`,
      method: 'DELETE',
    });

  const deleteBand = async (password: string, confirmation: string) => {
    if (!password || !confirmation) {
      toast.error('Todos los campos son obligatorios');
      return false;
    }

    const confirmationText = 'estoy seguro que esto es irreversible';
    if (confirmation.toLowerCase() !== confirmationText) {
      toast.error(`Debes escribir exactamente: "${confirmationText}"`);
      return false;
    }

    setIsDeleting(true);

    try {
      await deleteBandMutation({ password, confirmation });
      toast.success('Grupo eliminado exitosamente');

      // Invalidar queries para refrescar la lista de grupos
      queryClient.invalidateQueries({ queryKey: ['Bands'] });
      queryClient.invalidateQueries({ queryKey: ['BandsOfUser'] });

      return true;
    } catch (error) {
      setIsDeleting(false);

      // Manejar mensajes de error específicos del backend
      const errorMessage = error instanceof Error ? error.message : '';

      if (errorMessage.includes('Invalid password')) {
        toast.error('Contraseña incorrecta');
      } else if (errorMessage.includes('Confirmation text does not match')) {
        toast.error('El texto de confirmación no coincide');
      } else {
        toast.error('Error al eliminar el grupo');
      }

      return false;
    }
  };
  return {
    deleteBand,
    isDeleting: isDeleting || deleteBandStatus === 'pending',
    deleteBandStatus,
  };
};
