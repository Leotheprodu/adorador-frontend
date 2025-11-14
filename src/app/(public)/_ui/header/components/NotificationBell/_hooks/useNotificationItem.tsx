'use client';
import { useEffect, useState } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import type {
  Notification,
  NotificationListResponse,
} from '@global/services/notifications.service';
import { updateReadNotification } from '../services/NotificationItemService';

export const useNotificationItem = (notification: Notification) => {
  const queryClient = useQueryClient();
  const [isMarking, setIsMarking] = useState(false);

  const { status, mutate } = updateReadNotification({
    notificationId: notification.id,
  });
  useEffect(() => {
    if (status === 'success') {
      setIsMarking(false);
    }
  }, [status]);

  const handleMouseEnter = async () => {
    if (!notification.read && !isMarking) {
      setIsMarking(true);

      mutate(null, {
        onSuccess: async () => {
          queryClient.setQueryData(
            ['Notifications', 'initial', 'false'],
            (oldData: NotificationListResponse | undefined) => {
              if (oldData?.items) {
                return {
                  ...oldData,
                  items: oldData.items.map((item: Notification) =>
                    item.id === notification.id
                      ? {
                          ...item,
                          read: true,
                          readAt: new Date().toISOString(),
                        }
                      : item,
                  ),
                };
              }
              return oldData;
            },
          );

          await queryClient.invalidateQueries({
            queryKey: ['UnreadNotificationsCount'],
          });
        },
      });
    }
  };
  return {
    isMarking,
    handleMouseEnter,
  };
};
