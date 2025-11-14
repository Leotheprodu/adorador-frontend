'use client';
import { Spinner, Button } from '@nextui-org/react';
import { updateUserFromToken } from '@global/utils/updateUserFromToken';
import { useAcceptInvitation } from '@app/(public)/grupos/_hooks/useAcceptInvitation';
import { useRejectInvitation } from '@app/(public)/grupos/_hooks/useRejectInvitation';

interface Invitation {
  id: number;
  band: { id: number; name: string };
  inviter: { id: number; name: string };
  expiresAt: string;
}

interface InvitationsListProps {
  invitations: Invitation[] | undefined;
  isLoading: boolean;
}

export const InvitationsList = ({
  invitations,
  isLoading,
}: InvitationsListProps) => {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner />
      </div>
    );
  }

  if (!invitations || invitations.length === 0) {
    return (
      <p
        className="py-8 text-center text-sm text-gray-500"
        data-testid="invitations-empty-message"
      >
        No tienes invitaciones pendientes
      </p>
    );
  }

  return (
    <div
      className="max-h-96 space-y-3 overflow-y-auto py-2"
      data-testid="invitations-list"
    >
      {invitations.map((invitation) => (
        <InvitationCard key={invitation.id} invitation={invitation} />
      ))}
    </div>
  );
};

interface InvitationCardProps {
  invitation: Invitation;
}

const InvitationCard = ({ invitation }: InvitationCardProps) => {
  const { acceptInvitation, isAccepting } = useAcceptInvitation(invitation.id);
  const { rejectInvitation, isRejecting } = useRejectInvitation(invitation.id);

  const handleAccept = async () => {
    const response = await acceptInvitation();
    if (response) {
      updateUserFromToken();
    }
  };

  const handleReject = async () => {
    await rejectInvitation();
  };

  const expiresDate = new Date(invitation.expiresAt);
  const isExpiringSoon =
    expiresDate.getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000;

  return (
    <div
      className="space-y-2 rounded-lg border border-gray-200 p-3"
      data-testid={`invitation-card-${invitation.id}`}
    >
      <div>
        <p className="text-sm font-medium" data-testid="band-name">
          {invitation.band.name}
        </p>
        <p className="text-xs text-gray-500" data-testid="inviter-name">
          Invitado por {invitation.inviter.name}
        </p>
        {isExpiringSoon && (
          <p
            className="mt-1 text-xs text-orange-500"
            data-testid="expiring-warning"
          >
            Expira pronto
          </p>
        )}
      </div>

      <div className="flex gap-2">
        <Button
          size="sm"
          color="success"
          className="flex-1"
          onPress={handleAccept}
          isLoading={isAccepting}
          isDisabled={isRejecting}
          data-testid="accept-button"
        >
          Aceptar
        </Button>
        <Button
          size="sm"
          color="danger"
          variant="flat"
          className="flex-1"
          onPress={handleReject}
          isLoading={isRejecting}
          isDisabled={isAccepting}
          data-testid="reject-button"
        >
          Rechazar
        </Button>
      </div>
    </div>
  );
};
