'use client';
import type { Notification } from '@global/services/notifications.service';
import { useNotificationItem } from '../_hooks/useNotificationItem';

interface NotificationItemProps {
  notification: Notification;
  onClick: () => void;
}

export const NotificationItem = ({
  notification,
  onClick,
}: NotificationItemProps) => {
  const { isMarking, handleMouseEnter } = useNotificationItem(notification);

  return (
    <div
      onClick={onClick}
      onMouseLeave={handleMouseEnter}
      className={`cursor-pointer rounded-lg border p-3 transition-all duration-300 hover:bg-gray-50 ${
        !notification.read
          ? 'border-brand-purple-300 bg-brand-purple-100/50 shadow-sm'
          : 'border-gray-200 bg-white opacity-70'
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1">
          <p
            className={`text-sm ${
              !notification.read ? 'font-semibold' : 'font-medium'
            }`}
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
};
