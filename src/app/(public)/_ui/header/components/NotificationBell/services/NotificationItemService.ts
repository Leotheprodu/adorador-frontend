import { Server1API } from '@global/config/constants';
import { PostData } from '@global/services/HandleAPI';

export const updateReadNotification = ({
  notificationId,
}: {
  notificationId: number;
}) => {
  return PostData<{ message: string }, null>({
    key: 'update-read-notification',
    url: `${Server1API}/notifications/${notificationId}/read`,
    method: 'PATCH',
  });
};
