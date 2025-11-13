export interface NotificationMetadata {
  postId?: number;
  commentId?: number;
  authorId?: number;
  authorName?: string;
  [key: string]: unknown;
}

export interface Notification {
  id: number;
  userId: number;
  type: string;
  title: string;
  message: string;
  metadata?: NotificationMetadata;
  read: boolean;
  createdAt: string;
  readAt?: string;
}

export interface NotificationListResponse {
  items: Notification[];
  nextCursor: number | null;
  hasMore: boolean;
  unreadCount: number;
}

export interface UnreadCountResponse {
  count: number;
}

export interface MarkAllAsReadResponse {
  count: number;
}
