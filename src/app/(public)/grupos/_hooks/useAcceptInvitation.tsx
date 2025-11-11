import { useState } from 'react';
import { PostData } from '@global/services/HandleAPI';
import { Server1API } from '@global/config/constants';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { setTokens, getTokenExpirationTime } from '@global/utils/jwtUtils';

interface AcceptInvitationResponse {
  membership: {
    id: number;
    userId: number;
    bandId: number;
    role: string;
    isAdmin: boolean;
    isEventManager: boolean;
    user: {
      id: number;
      name: string;
      email: string | null;
      phone: string;
    };
    band: {
      id: number;
      name: string;
    };
  };
  accessToken: string;
  refreshToken: string;
}

export const useAcceptInvitation = (invitationId: number) => {
  const [isAccepting, setIsAccepting] = useState(false);
  const queryClient = useQueryClient();

  const {
    mutateAsync: acceptInvitationMutation,
    status: acceptInvitationStatus,
  } = PostData<AcceptInvitationResponse, undefined>({
    key: `AcceptInvitation-${invitationId}`,
    url: `${Server1API}/bands/invitations/${invitationId}/accept`,
    method: 'POST',
  });

  const acceptInvitation = async () => {
    setIsAccepting(true);

    try {
      const response = await acceptInvitationMutation(undefined);

      // Guardar nuevos tokens usando setTokens de jwtUtils
      setTokens({
        accessToken: response.accessToken,
        refreshToken: response.refreshToken,
        expiresAt: getTokenExpirationTime(response.accessToken),
      });

      // Invalidar queries
      queryClient.invalidateQueries({ queryKey: ['PendingInvitations'] });
      queryClient.invalidateQueries({ queryKey: ['BandsOfUser'] });
      queryClient.invalidateQueries({ queryKey: ['Bands'] });
      // Invalidar los miembros de la banda a la que se acaba de unir
      queryClient.invalidateQueries({
        queryKey: ['BandMembers', response.membership.bandId.toString()],
      });

      toast.success(`Te uniste a ${response.membership.band.name}!`);

      setIsAccepting(false);
      return response;
    } catch (error) {
      setIsAccepting(false);
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Error al aceptar la invitación';
      toast.error(errorMessage);
      return null;
    }
  };

  return {
    acceptInvitation,
    isAccepting,
    acceptInvitationStatus,
  };
};
