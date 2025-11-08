import { FetchData } from '@global/services/HandleAPI';
import { Server1API } from '@global/config/constants';

export interface BandMember {
  id: number;
  userId: number;
  bandId: number;
  role: string;
  active: boolean;
  isAdmin: boolean;
  isEventManager: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number;
    name: string;
    email: string | null;
    phone: string;
  };
}

export const useBandMembers = (bandId: number) => {
  return FetchData<BandMember[]>({
    key: `BandMembers-${bandId}`,
    url: `${Server1API}/bands/${bandId}/members`,
  });
};
