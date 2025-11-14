'use client';
import { Spinner } from '@nextui-org/react';
import { Notification } from '@global/services/notifications.service';
import { useNotificationsList } from '../_hooks/useNotificationsList';
import { NotificationItem } from './NotificationItem';

interface NotificationsListProps {
  notificationsCount: number;
  onClose: () => void;
  isOpen: boolean;
}

export const NotificationsList = ({
  notificationsCount,
  isOpen,
  onClose,
}: NotificationsListProps) => {
  const {
    data,
    isLoading,
    isFetching,
    allItems,
    handleNotificationClick,
    loadMore,
  } = useNotificationsList({ isOpen, notificationsCount });

  if (isLoading) {
    return (
      <div className="flex justify-center py-8">
        <Spinner />
      </div>
    );
  }

  if (!allItems.length && !isLoading) {
    return (
      <p className="py-8 text-center text-sm text-gray-500">
        No tienes notificaciones
      </p>
    );
  }

  return (
    <div className="max-h-96 space-y-2 overflow-y-auto py-2">
      {allItems.map((notification: Notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onClick={() =>
            handleNotificationClick(notification.id, notification, onClose)
          }
        />
      ))}

      {data?.hasMore && (
        <button
          type="button"
          className="mt-2 w-full rounded-md border border-gray-200 py-2 text-sm text-gray-700 hover:bg-gray-50"
          onClick={loadMore}
          disabled={isFetching}
        >
          {isFetching ? 'Cargando...' : 'Ver más'}
        </button>
      )}
    </div>
  );
};
