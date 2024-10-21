import { PostData } from '@global/services/HandleAPI';
import { Server1API } from '@global/config/constants';
import type {
  LoggedUser,
  LoginInterface,
} from '@auth/login/_interfaces/LoginInterface';

export const logoutService = () => {
  return PostData<LoggedUser>({
    key: 'logout',
    url: `${Server1API}/auth/logout`,
    method: 'GET',
  });
};
export const loginService = () => {
  return PostData<LoggedUser, LoginInterface>({
    key: 'login',
    url: `${Server1API}/auth/login`,
    method: 'POST',
  });
};
