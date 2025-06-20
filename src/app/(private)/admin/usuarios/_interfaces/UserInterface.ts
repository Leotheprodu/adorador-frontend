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

export interface MembersofBandsProps {
  id: number;
  isActive: boolean;
  isAdmin: boolean;
  isEventManager: boolean;
  role: string;
  band: {
    id: number;
    name: string;
  };
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
  membersofBands: MembersofBandsProps[];
}
