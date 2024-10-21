import { PostData } from '@global/services/HandleAPI';
import { Server1API } from '@global/config/constants';

export const verifyEmailService = ({ token }: { token: string }) => {
  return PostData({
    key: 'verify-email',
    url: `${Server1API}/auth/verify-email/${token}`,
    method: 'GET',
  });
};
