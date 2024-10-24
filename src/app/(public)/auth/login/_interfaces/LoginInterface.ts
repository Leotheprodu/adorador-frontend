import { User } from '@admin/usuarios/_interfaces/UserInterface';

export interface LoggedUser extends User {
  isLoggedIn: boolean;
}

export interface LoginInterface {
  email: string;
  password: string;
}
