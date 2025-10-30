import { PostData } from '@global/services/HandleAPI';
import { Server1API } from '@global/config/constants';
import type { LoginInterface } from '@auth/login/_interfaces/LoginInterface';
import type { BackendLoginResponse } from '@global/utils/jwtUtils';

export const logoutService = () => {
  return PostData<{ message: string }>({
    key: 'logout',
    url: `${Server1API}/auth/logout`,
    method: 'GET',
  });
};

export const loginService = () => {
  return PostData<BackendLoginResponse, LoginInterface>({
    key: 'login',
    url: `${Server1API}/auth/login`,
    method: 'POST',
    skipAuth: true,
  });
};
