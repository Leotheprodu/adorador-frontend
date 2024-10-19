import { LoggedUser } from '@/app/(public)/auth/login/_interfaces/LoginInterface';
import { atom } from 'nanostores';

export const $user = atom<LoggedUser>({
  isLoggedIn: false,
  id: 0,
  name: '',
  email: '',
  status: 'inactive',
  roles: [2],
});
