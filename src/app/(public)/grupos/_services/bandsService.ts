import { Server1API } from '@global/config/constants';
import { FetchData } from '@global/services/HandleAPI';
import {
  BandsProps,
  BandsWithMembersCount,
  BandWithSongsProps,
} from '@bands/_interfaces/bandsInterface';
export const getBands = () => {
  return FetchData<BandsProps[]>({
    key: 'Bands',
    url: `${Server1API}/bands`,
  });
};
export const getBandsOfUser = (isEnabled: boolean = true) => {
  return FetchData<BandsWithMembersCount[]>({
    key: 'BandsOfUser',
    url: `${Server1API}/bands/user-bands`,
    isEnabled,
  });
};
export const getBandById = (bandId: string) => {
  return FetchData<BandWithSongsProps>({
    key: ['BandById', bandId],
    url: `${Server1API}/bands/${bandId}`,
    refetchOnMount: true,
    refetchOnWindowFocus: true,
  });
};
