import { PostData } from '@global/services/HandleAPI';
import { Server1API } from '@global/config/constants';

export const PasswordRecoveryService = () => {
  return PostData<
    {
      status: string;
      resetToken: string;
      phone: string;
      whatsappMessage: string;
      message: string;
    },
    { phone: string }
  >({
    key: 'password-recovery',
    url: `${Server1API}/auth/forgot-password`,
    method: 'POST',
    skipAuth: true,
  });
};
