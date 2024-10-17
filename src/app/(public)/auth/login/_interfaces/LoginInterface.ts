export interface User {
  id: number;
  email: string;
  name: string;
  status: 'active' | 'inactive';
  roles: number[];
}
export interface LoggedUser extends User {
  isLoggedIn: boolean;
}

export interface LoginInterface {
  email: string;
  password: string;
}
export interface SignUpInterface {
  email: string;
  password: string;
  name: string;
}
