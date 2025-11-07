import { PostData } from '@global/services/HandleAPI';
import { Server1API } from '@global/config/constants';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';

interface UpdateBandParams {
  name: string;
}

export const useUpdateBand = (bandId: number) => {
  const queryClient = useQueryClient();

  const { mutateAsync: updateBandMutation, status: updateBandStatus } =
    PostData<void, UpdateBandParams>({
      key: `UpdateBand-${bandId}`,
      url: `${Server1API}/bands/${bandId}`,
      method: 'PATCH',
    });

  const updateBand = async (name: string) => {
    if (!name || name.trim() === '') {
      toast.error('El nombre del grupo es obligatorio');
      return false;
    }

    try {
      await updateBandMutation({ name });
      toast.success('Grupo actualizado exitosamente');

      // Invalidar queries para refrescar la lista de grupos
      queryClient.invalidateQueries({ queryKey: ['Bands'] });
      queryClient.invalidateQueries({ queryKey: ['BandsOfUser'] });
      queryClient.invalidateQueries({ queryKey: ['BandById'] });

      return true;
    } catch {
      toast.error('Error al actualizar el grupo');
      return false;
    }
  };

  return {
    updateBand,
    isUpdating: updateBandStatus === 'pending',
    updateBandStatus,
  };
};
