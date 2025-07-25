import { Server1API } from '@global/config/constants';
import { FetchData } from '@global/services/HandleAPI';
import { BandsProps } from '@bands/_interfaces/bandsInterface';
export const getBands = () => {
  return FetchData<BandsProps[]>({
    key: 'Bands',
    url: `${Server1API}/bands`,
  });
};
export const getBandsOfUser = () => {
  return FetchData<BandsProps[]>({
    key: 'BandsOfUser',
    url: `${Server1API}/bands/user-bands`,
  });
};
export const getBandById = (bandId: string) => {
  return FetchData<BandsProps>({
    key: 'BandById',
    url: `${Server1API}/bands/${bandId}`,
  });
};
