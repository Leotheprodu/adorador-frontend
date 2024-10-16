import { $user } from "@/global/stores/users";
import { getLocalStorage } from "../utils/handleLocalStorage";

export const CheckIsLoggedIn = () => {
  const checkLocalData = getLocalStorage("user");

  if (checkLocalData) {
    $user.set(checkLocalData);
  }
};
