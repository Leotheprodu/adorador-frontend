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

export const verifyEmailService = ({ token }: { token: string }) => {
  return PostData({
    key: 'verify-email',
    url: `${Server1API}/auth/verify-email/${token}`,
    method: 'GET',
    skipAuth: true,
  });
};

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
