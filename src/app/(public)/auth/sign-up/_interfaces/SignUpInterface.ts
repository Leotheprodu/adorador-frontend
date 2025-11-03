import { LoginInterface } from '@auth/login/_interfaces/LoginInterface';

export interface SignUpInterface extends LoginInterface {
  name: string;
  email?: string; // Email ahora es opcional
  birthdate?: string | Date;
}
