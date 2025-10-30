import { PostData } from '@global/services/HandleAPI';
import { Server1API } from '@global/config/constants';

export const resetPasswordService = () => {
  return PostData<{ message: string }, { password: string; token: string }>({
    key: 'reset-password',
    url: `${Server1API}/auth/new-password`,
    method: 'POST',
    skipAuth: true,
  });
};
