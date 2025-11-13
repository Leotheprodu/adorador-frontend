'use client';
import { useStore } from '@nanostores/react';
import { $user } from '@global/stores/users';
import { usePendingInvitations } from '@app/(public)/grupos/_hooks/usePendingInvitations';
import { useAcceptInvitation } from '@app/(public)/grupos/_hooks/useAcceptInvitation';
import { useRejectInvitation } from '@app/(public)/grupos/_hooks/useRejectInvitation';
import {
  useNotifications,
  useUnreadCount,
} from '@global/hooks/useNotifications';
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Button,
  Spinner,
  Tabs,
  Tab,
} from '@nextui-org/react';
import { updateUserFromToken } from '@global/utils/updateUserFromToken';
import { BellIcon } from '@global/icons/BellIcon';
import {
  Notification,
  NotificationListResponse,
} from '@global/services/notifications.service';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Server1API } from '@global/config/constants';
import { useQueryClient } from '@tanstack/react-query';

export const NotificationBell = () => {
  const user = useStore($user);
  const { data: invitations, isLoading: loadingInvitations } =
    usePendingInvitations();
  const { data: unreadCount } = useUnreadCount();
  const [isOpen, setIsOpen] = useState(false);

  if (!user.isLoggedIn) {
    return null;
  }

  const invitationsCount = invitations?.length || 0;
  const notificationsCount = unreadCount?.count || 0;
  const totalCount = invitationsCount + notificationsCount;

  return (
    <Popover placement="bottom-end" isOpen={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger>
        <Button
          isIconOnly
          variant="light"
          className="relative"
          aria-label="Notificaciones"
          data-testid="notification-bell-button"
        >
          <BellIcon className="text-2xl text-brand-purple-600" />
          {totalCount > 0 && (
            <span
              className="absolute -right-1 -top-1 z-10 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-xs font-bold text-white shadow-lg"
              data-testid="notification-badge"
            >
              {totalCount}
            </span>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="z-50 w-96 max-w-[calc(100vw-2rem)] p-4"
        data-testid="notification-popover"
      >
        <Tabs aria-label="Notificaciones" className="w-full">
          <Tab
            key="notifications"
            title={
              <div className="flex items-center gap-2">
                <span>Notificaciones</span>
                {notificationsCount > 0 && (
                  <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
                    {notificationsCount}
                  </span>
                )}
              </div>
            }
          >
            <NotificationsList onClose={() => setIsOpen(false)} />
          </Tab>
          <Tab
            key="invitations"
            title={
              <div className="flex items-center gap-2">
                <span>Invitaciones</span>
                {invitationsCount > 0 && (
                  <span className="rounded-full bg-red-500 px-2 py-0.5 text-xs text-white">
                    {invitationsCount}
                  </span>
                )}
              </div>
            }
          >
            <InvitationsList
              invitations={invitations}
              isLoading={loadingInvitations}
            />
          </Tab>
        </Tabs>
      </PopoverContent>
    </Popover>
  );
};

// Componente para la lista de notificaciones
function NotificationsList({ onClose }: { onClose: () => void }) {
  const { data, isLoading } = useNotifications();
  const router = useRouter();

  const handleNotificationClick = (
    notificationId: number,
    notification: Notification,
  ) => {
    // Cerrar el popover
    onClose();

    // Construir la URL de redirección y navegar
    if (notification.metadata?.postId) {
      // Si tiene commentId, agregar parámetros para abrir modal y hacer scroll
      if (notification.metadata?.commentId) {
        const url = `/feed?postId=${notification.metadata.postId}#comment-${notification.metadata.commentId}`;
        router.push(url);
      } else {
        // Si no tiene commentId (ej: blessing en post), solo hacer scroll al post sin abrir modal
        const url = `/feed#post-${notification.metadata.postId}`;
        router.push(url);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner />
      </div>
    );
  }

  if (!data || data.items.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-gray-500">
        No tienes notificaciones
      </p>
    );
  }

  return (
    <div className="max-h-96 space-y-2 overflow-y-auto py-2">
      {data.items.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onClick={() => handleNotificationClick(notification.id, notification)}
        />
      ))}
    </div>
  );
}

// Componente para un item de notificación
function NotificationItem({
  notification,
  onClick,
}: {
  notification: Notification;
  onClick: () => void;
}) {
  const queryClient = useQueryClient();
  const [isMarking, setIsMarking] = useState(false);

  const handleMouseEnter = async () => {
    console.log(
      'Mouse entered notification:',
      notification.id,
      'read:',
      notification.read,
      'isMarking:',
      isMarking,
    );

    // Solo marcar como leída si no lo está y no se está marcando ya
    if (!notification.read && !isMarking) {
      setIsMarking(true);

      try {
        console.log('Marking notification as read:', notification.id);

        // Usar fetch directamente para manejar 204 No Content
        const { getTokens } = await import('@global/utils/jwtUtils');
        const tokens = getTokens();

        const response = await fetch(
          `${Server1API}/notifications/${notification.id}/read`,
          {
            method: 'PATCH',
            headers: {
              Authorization: `Bearer ${tokens?.accessToken}`,
              'Content-Type': 'application/json',
            },
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        console.log('Notification marked as read successfully');

        // Actualizar directamente los datos en cache para que la notificación se vea como leída
        queryClient.setQueryData(
          ['Notifications', 'initial', 'false'],
          (oldData: NotificationListResponse | undefined) => {
            if (oldData?.items) {
              return {
                ...oldData,
                items: oldData.items.map((item: Notification) =>
                  item.id === notification.id
                    ? { ...item, read: true, readAt: new Date().toISOString() }
                    : item,
                ),
              };
            }
            return oldData;
          },
        );

        // Solo invalidar el contador para que se actualice
        await queryClient.invalidateQueries({
          queryKey: ['UnreadNotificationsCount'],
        });

        console.log('Cache updated and counter invalidated');
      } catch (error) {
        console.error('Error marking notification as read:', error);
      } finally {
        setIsMarking(false);
      }
    }
  };

  return (
    <div
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      className={`cursor-pointer rounded-lg border p-3 transition-all duration-300 hover:bg-gray-50 ${
        !notification.read
          ? 'border-brand-purple-300 bg-brand-purple-100/50 shadow-sm'
          : 'border-gray-200 bg-white opacity-70'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <p
            className={`text-sm ${!notification.read ? 'font-semibold' : 'font-medium'}`}
          >
            {notification.title}
          </p>
          <p className="text-xs text-gray-600">{notification.message}</p>
          <p className="mt-1 text-xs text-gray-400">
            {new Date(notification.createdAt).toLocaleDateString('es-ES', {
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
            })}
          </p>
        </div>
        {!notification.read && (
          <div
            className={`h-2.5 w-2.5 rounded-full shadow-sm transition-colors ${
              isMarking
                ? 'animate-pulse bg-brand-purple-400'
                : 'bg-brand-purple-600'
            }`}
          />
        )}
      </div>
    </div>
  );
}

// Componente para la lista de invitaciones
function InvitationsList({
  invitations,
  isLoading,
}: {
  invitations:
    | {
        id: number;
        band: { id: number; name: string };
        inviter: { id: number; name: string };
        expiresAt: string;
      }[]
    | undefined;
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner />
      </div>
    );
  }

  if (!invitations || invitations.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-gray-500">
        No tienes invitaciones pendientes
      </p>
    );
  }

  return (
    <div className="max-h-96 space-y-3 overflow-y-auto py-2">
      {invitations.map((invitation) => (
        <InvitationCard key={invitation.id} invitation={invitation} />
      ))}
    </div>
  );
}

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
