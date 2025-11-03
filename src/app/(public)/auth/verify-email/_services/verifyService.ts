import { PostData } from '@global/services/HandleAPI';
import { Server1API } from '@global/config/constants';

export const verifyWhatsAppTokenService = () => {
  return PostData<{
    success: boolean;
    message: string;
    user?: {
      id: string;
      name: string;
      phone: string;
      email?: string;
    };
  }, { token: string }>({
    key: 'verify-whatsapp-token',
    url: `${Server1API}/temporal-token-pool/verify-whatsapp-token`,
    method: 'POST',
    skipAuth: true,
  });
};
