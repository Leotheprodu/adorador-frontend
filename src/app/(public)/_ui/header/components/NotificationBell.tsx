'use client';
import { useStore } from '@nanostores/react';
import { $user } from '@global/stores/users';
import { usePendingInvitations } from '@app/(public)/grupos/_hooks/usePendingInvitations';
import { useAcceptInvitation } from '@app/(public)/grupos/_hooks/useAcceptInvitation';
import { useRejectInvitation } from '@app/(public)/grupos/_hooks/useRejectInvitation';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
  Spinner,
} from '@nextui-org/react';
import { updateUserFromToken } from '@global/utils/updateUserFromToken';
import { BellIcon } from '@global/icons/BellIcon';

export const NotificationBell = () => {
  const user = useStore($user);
  const { data: invitations, isLoading } = usePendingInvitations();

  if (!user.isLoggedIn) {
    return null;
  }

  const pendingCount = invitations?.length || 0;

  return (
    <Popover placement="bottom-end">
      <PopoverTrigger>
        <Button
          isIconOnly
          variant="light"
          className="relative"
          aria-label="Notificaciones"
        >
          <BellIcon className="text-2xl text-brand-purple-600" />
          {pendingCount > 0 && (
            <span className="absolute right-0 top-0 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white shadow-lg">
              {pendingCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-4">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Invitaciones</h3>
            {isLoading && <Spinner size="sm" />}
          </div>

          {!isLoading && pendingCount === 0 && (
            <p className="text-sm text-gray-500">
              No tienes invitaciones pendientes
            </p>
          )}

          {invitations && invitations.length > 0 && (
            <div className="max-h-96 space-y-3 overflow-y-auto">
              {invitations.map((invitation) => (
                <InvitationCard key={invitation.id} invitation={invitation} />
              ))}
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
};

interface InvitationCardProps {
  invitation: {
    id: number;
    band: {
      id: number;
      name: string;
    };
    inviter: {
      id: number;
      name: string;
    };
    expiresAt: string;
  };
}

const InvitationCard = ({ invitation }: InvitationCardProps) => {
  const { acceptInvitation, isAccepting } = useAcceptInvitation(invitation.id);
  const { rejectInvitation, isRejecting } = useRejectInvitation(invitation.id);

  const handleAccept = async () => {
    const response = await acceptInvitation();
    if (response) {
      // Actualizar tokens en el store
      updateUserFromToken();
    }
  };

  const handleReject = async () => {
    await rejectInvitation();
  };

  const expiresDate = new Date(invitation.expiresAt);
  const isExpiringSoon =
    expiresDate.getTime() - Date.now() < 7 * 24 * 60 * 60 * 1000; // 7 días

  return (
    <div className="space-y-2 rounded-lg border border-gray-200 p-3">
      <div>
        <p className="text-sm font-medium">{invitation.band.name}</p>
        <p className="text-xs text-gray-500">
          Invitado por {invitation.inviter.name}
        </p>
        {isExpiringSoon && (
          <p className="mt-1 text-xs text-orange-500">Expira pronto</p>
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
        >
          Rechazar
        </Button>
      </div>
    </div>
  );
};
