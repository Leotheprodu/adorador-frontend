import { PostData } from '@global/services/HandleAPI';
import { Server1API } from '@global/config/constants';
import { User } from '@admin/usuarios/_interfaces/UserInterface';
import { SignUpInterface } from '@auth/sign-up/_interfaces/SignUpInterface';

export interface SignUpResponse {
  user: User;
  verificationToken: string;
  whatsappMessage: string;
  message: string;
}

export const signUpService = () => {
  return PostData<SignUpResponse, SignUpInterface>({
    key: 'sign-up',
    url: `${Server1API}/users`,
    method: 'POST',
    skipAuth: true,
  });
};

// Servicio de verificación removido - ahora usamos WhatsApp

export const resendVerificationService = () => {
  return PostData<
    {
      success: boolean;
      message: string;
      verificationToken?: string;
      whatsappMessage?: string;
    },
    { phone: string }
  >({
    key: 'resend-verification',
    url: `${Server1API}/users/resend-verification`,
    method: 'POST',
    skipAuth: true,
  });
};
