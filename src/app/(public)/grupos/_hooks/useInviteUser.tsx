import { useState } from 'react';
import { PostData } from '@global/services/HandleAPI';
import { Server1API } from '@global/config/constants';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';
import { getTokens } from '@global/utils/jwtUtils';
import { useInvalidateSubscriptionLimits } from '@bands/[bandId]/suscripcion/_hooks/useInvalidateSubscriptionLimits';

export interface SearchUserResult {
  id: number;
  name: string;
  email: string | null;
  phone: string;
  hasPendingInvitation: boolean;
}

export const useSearchUsers = (bandId: number) => {
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<SearchUserResult[]>([]);

  const searchUsers = async (query: string) => {
    if (!query || query.trim().length < 2) {
      toast.error('Escribe al menos 2 caracteres');
      return;
    }

    setIsSearching(true);

    try {
      const tokens = getTokens();
      if (!tokens?.accessToken) {
        throw new Error('No estás autenticado');
      }

      const response = await fetch(
        `${Server1API}/bands/${bandId}/search-users?q=${encodeURIComponent(query)}`,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${tokens.accessToken}`,
          },
        },
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || 'Error al buscar usuarios');
      }

      const data = await response.json();
      setSearchResults(data);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Error al buscar usuarios';
      toast.error(errorMessage);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  return {
    searchUsers,
    searchResults,
    isSearching,
    clearResults: () => setSearchResults([]),
  };
};

export const useInviteUser = (bandId: number) => {
  const [isInviting, setIsInviting] = useState(false);
  const queryClient = useQueryClient();
  const { invalidateLimits } = useInvalidateSubscriptionLimits();

  const { mutateAsync: inviteUserMutation } = PostData<
    { id: number },
    { invitedUserId: number }
  >({
    key: `InviteUser-${bandId}`,
    url: `${Server1API}/bands/${bandId}/invite`,
    method: 'POST',
  });

  const inviteUser = async (userId: number) => {
    setIsInviting(true);

    try {
      await inviteUserMutation({ invitedUserId: userId });

      toast.success('Invitación enviada exitosamente');

      // Invalidar búsqueda para actualizar estado de invitación
      queryClient.invalidateQueries({ queryKey: [`SearchUsers-${bandId}`] });
      // Invalidar límites de suscripción (currentMembers aumentó)
      invalidateLimits(bandId.toString());

      setIsInviting(false);
      return true;
    } catch (error) {
      setIsInviting(false);
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Error al enviar la invitación';
      toast.error(errorMessage);
      return false;
    }
  };

  return {
    inviteUser,
    isInviting,
  };
};
