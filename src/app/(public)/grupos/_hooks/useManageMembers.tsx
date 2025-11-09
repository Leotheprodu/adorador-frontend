import { useState } from 'react';
import { PostData } from '@global/services/HandleAPI';
import { Server1API } from '@global/config/constants';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';

interface UpdateMemberData {
  role?: string;
  isAdmin?: boolean;
  isEventManager?: boolean;
  active?: boolean;
}

export const useUpdateMember = (bandId: number, userId: number) => {
  const [isUpdating, setIsUpdating] = useState(false);
  const queryClient = useQueryClient();

  const { mutateAsync: updateMemberMutation } = PostData<
    unknown,
    UpdateMemberData
  >({
    key: `UpdateMember-${bandId}-${userId}`,
    url: `${Server1API}/bands/${bandId}/members/${userId}`,
    method: 'PATCH',
  });

  const updateMember = async (data: UpdateMemberData) => {
    setIsUpdating(true);

    try {
      await updateMemberMutation(data);

      toast.success('Miembro actualizado exitosamente');

      // Invalidar miembros de la banda
      queryClient.invalidateQueries({
        queryKey: ['BandMembers', bandId.toString()],
      });

      setIsUpdating(false);
      return true;
    } catch (error) {
      setIsUpdating(false);
      const errorMessage =
        error instanceof Error ? error.message : 'Error al actualizar miembro';
      toast.error(errorMessage);
      return false;
    }
  };

  return {
    updateMember,
    isUpdating,
  };
};

export const useRemoveMember = (bandId: number, userId: number) => {
  const [isRemoving, setIsRemoving] = useState(false);
  const queryClient = useQueryClient();

  const { mutateAsync: removeMemberMutation } = PostData<
    { message: string },
    undefined
  >({
    key: `RemoveMember-${bandId}-${userId}`,
    url: `${Server1API}/bands/${bandId}/members/${userId}`,
    method: 'DELETE',
  });

  const removeMember = async () => {
    setIsRemoving(true);

    try {
      await removeMemberMutation(undefined);

      toast.success('Miembro removido exitosamente');

      // Invalidar miembros de la banda
      queryClient.invalidateQueries({
        queryKey: ['BandMembers', bandId.toString()],
      });

      setIsRemoving(false);
      return true;
    } catch (error) {
      setIsRemoving(false);
      const errorMessage =
        error instanceof Error ? error.message : 'Error al remover miembro';
      toast.error(errorMessage);
      return false;
    }
  };

  return {
    removeMember,
    isRemoving,
  };
};
