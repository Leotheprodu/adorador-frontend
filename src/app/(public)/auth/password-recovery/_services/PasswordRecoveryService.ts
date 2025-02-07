import { PostData } from '@global/services/HandleAPI';
import { Server1API } from '@global/config/constants';

export const PasswordRecoveryService = () => {
  return PostData<{ message: string }, { email: string }>({
    key: 'password-recovery',
    url: `${Server1API}/auth/forgot-password`,
    method: 'POST',
  });
};
