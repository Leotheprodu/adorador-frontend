export interface ChurchRolesProps {
  id: number;
  name: string;
  churchRoleId: number;
}

export interface MembershipsProps {
  id: number;
  church: {
    id: number;
    name: string;
  };
  roles: ChurchRolesProps[];
  since: Date;
}

export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  birthdate: string;
  status: 'active' | 'inactive';
  roles: number[];
  memberships: MembershipsProps[];
}
