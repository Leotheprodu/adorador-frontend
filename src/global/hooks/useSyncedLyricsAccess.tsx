import { useStore } from '@nanostores/react';
import { $user } from '@stores/users';

const VALID_STATUSES = ['ACTIVE', 'TRIAL', 'GRACE_PERIOD'];

export const useSyncedLyricsAccess = () => {
  const user = useStore($user);

  if (!user.isLoggedIn) return false;

  return user.membersofBands.some((member) => {
    const status = member.band.subscription?.status;
    return status && VALID_STATUSES.includes(status);
  });
};
