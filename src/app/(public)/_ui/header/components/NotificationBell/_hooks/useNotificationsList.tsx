'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useNotifications } from '@global/hooks/useNotifications';
import {
  setNavigationToComment,
  setNavigationToPost,
} from '@stores/feedNavigation';
import type { Notification } from '@global/services/notifications.service';

export const useNotificationsList = ({
  isOpen,
  notificationsCount,
}: {
  isOpen: boolean;
  notificationsCount?: number;
}) => {
  const [cursor, setCursor] = useState<number | undefined>(undefined);
  const { data, isLoading, isFetching, refetch } = useNotifications(cursor);
  const [allItems, setAllItems] = useState<Notification[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (data?.items) {
      setAllItems((prev) => {
        const existingIds = new Set(prev.map((n) => n.id));
        const newOnes = data.items.filter((n) => !existingIds.has(n.id));
        return [...prev, ...newOnes];
      });
    }
  }, [data?.items]);
  useEffect(() => {
    if (isOpen && notificationsCount && notificationsCount > 0) {
      refetch();
    }
  }, [isOpen, notificationsCount, refetch]);

  const handleNotificationClick = (
    notificationId: number,
    notification: Notification,
    onClose: () => void,
  ) => {
    onClose();

    if (notification.metadata?.postId) {
      if (notification.metadata?.commentId) {
        setNavigationToComment(
          notification.metadata.postId,
          notification.metadata.commentId,
        );
      } else {
        setNavigationToPost(notification.metadata.postId);
      }
      router.push('/feed');
    }
  };

  const loadMore = () => {
    if (data?.nextCursor) {
      setCursor(data.nextCursor);
    }
  };

  return {
    data,
    isLoading,
    isFetching,
    allItems,
    handleNotificationClick,
    loadMore,
  };
};
