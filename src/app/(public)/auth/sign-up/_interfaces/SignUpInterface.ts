import { LoginInterface } from '@auth/login/_interfaces/LoginInterface';

export interface SignUpInterface extends LoginInterface {
  name: string;
  phone: string;
  birthdate: string | Date;
}
