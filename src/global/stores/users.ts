import { LoggedUser } from '@auth/login/_interfaces/LoginInterface';
import { atom } from 'nanostores';

export const $user = atom<LoggedUser>({
  id: 0,
  name: '',
  isLoggedIn: false,
  email: '',
  status: 'inactive',
  roles: [],
  memberships: [],
  phone: '',
  birthdate: '',
});
