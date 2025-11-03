import { User } from '@admin/usuarios/_interfaces/UserInterface';

export interface LoggedUser extends User {
  isLoggedIn: boolean;
}

export interface LoginInterface {
  phone: string; // Cambio de email a phone
  password: string;
}
