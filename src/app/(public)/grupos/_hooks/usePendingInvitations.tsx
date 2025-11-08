import { FetchData } from '@global/services/HandleAPI';
import { Server1API } from '@global/config/constants';

export interface PendingInvitation {
  id: number;
  bandId: number;
  invitedUserId: number;
  invitedBy: number;
  status: string;
  createdAt: string;
  expiresAt: string;
  band: {
    id: number;
    name: string;
  };
  inviter: {
    id: number;
    name: string;
  };
}

export const usePendingInvitations = () => {
  return FetchData<PendingInvitation[]>({
    key: 'PendingInvitations',
    url: `${Server1API}/bands/invitations/pending`,
  });
};
