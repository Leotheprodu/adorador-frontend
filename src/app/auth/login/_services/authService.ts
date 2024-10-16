import { PostData } from "@/global/services/HandleAPI";
import { Server1API } from "@/global/config/constants";
import type {
  LoggedUser,
  LoginInterface,
  SignUpInterface,
} from "../_interfaces/LoginInterface";

export const logoutService = () => {
  return PostData<LoggedUser>({
    key: "logout",
    url: `${Server1API}/auth/logout`,
    method: "GET",
  });
};
export const loginService = () => {
  return PostData<LoggedUser, LoginInterface>({
    key: "login",
    url: `${Server1API}/auth/login`,
    method: "POST",
  });
};
export const signUpService = () => {
  return PostData<LoggedUser, SignUpInterface>({
    key: "sign-up",
    url: `${Server1API}/users`,
    method: "POST",
  });
};

export const verifyEmailService = ({ token }: { token: string }) => {
  return PostData({
    key: "verify-email",
    url: `${Server1API}/auth/verify-email/${token}`,
    method: "GET",
  });
};
