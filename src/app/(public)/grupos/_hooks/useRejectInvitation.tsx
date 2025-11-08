import { useState } from 'react';
import { PostData } from '@global/services/HandleAPI';
import { Server1API } from '@global/config/constants';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';

interface RejectInvitationResponse {
  message: string;
}

export const useRejectInvitation = (invitationId: number) => {
  const [isRejecting, setIsRejecting] = useState(false);
  const queryClient = useQueryClient();

  const {
    mutateAsync: rejectInvitationMutation,
    status: rejectInvitationStatus,
  } = PostData<RejectInvitationResponse, undefined>({
    key: `RejectInvitation-${invitationId}`,
    url: `${Server1API}/bands/invitations/${invitationId}/reject`,
    method: 'POST',
  });

  const rejectInvitation = async () => {
    setIsRejecting(true);

    try {
      await rejectInvitationMutation(undefined);

      // Invalidar queries
      queryClient.invalidateQueries({ queryKey: ['PendingInvitations'] });

      toast.success('Invitación rechazada');

      setIsRejecting(false);
      return true;
    } catch (error) {
      setIsRejecting(false);
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Error al rechazar la invitación';
      toast.error(errorMessage);
      return false;
    }
  };

  return {
    rejectInvitation,
    isRejecting,
    rejectInvitationStatus,
  };
};
