import { PostData } from '@global/services/HandleAPI';
import { Server1API } from '@global/config/constants';
import { User } from '@users/_interfaces/UserInterface';
import { SignUpInterface } from '@auth/sign-up/_interfaces/signUpInterface';

export const signUpService = () => {
  return PostData<User, SignUpInterface>({
    key: 'sign-up',
    url: `${Server1API}/users`,
    method: 'POST',
  });
};

export const verifyEmailService = ({ token }: { token: string }) => {
  return PostData({
    key: 'verify-email',
    url: `${Server1API}/auth/verify-email/${token}`,
    method: 'GET',
  });
};
