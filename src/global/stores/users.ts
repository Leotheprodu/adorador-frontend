import { atom } from 'nanostores';

export const $user = atom({
  isLoggedIn: false,
  id: 0,
  name: '',
  email: '',
  status: 'inactive',
  roles: [2],
});
