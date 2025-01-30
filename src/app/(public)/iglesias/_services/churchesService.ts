import { Server1API } from '@global/config/constants';
import { FetchData } from '@global/services/HandleAPI';
import { ChurchProps } from '@iglesias/_interfaces/churchesInterface';

export const getChurches = () => {
  return FetchData<ChurchProps[]>({
    key: 'Churches',
    url: `${Server1API}/churches`,
  });
};
export const getChurchById = (churchId: string) => {
  return FetchData<ChurchProps>({
    key: 'ChurchById',
    url: `${Server1API}/churches/${churchId}`,
  });
};
