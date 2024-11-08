import { FetchData } from '@global/services/HandleAPI';
import { SongProps } from '../_interfaces/songsInterface';
import { Server1API } from '@global/config/constants';

export const getSongsOfChurch = ({ churchId }: { churchId: string }) => {
  return FetchData<SongProps[]>({
    key: 'SongsOfChurch',
    url: `${Server1API}/churches/${churchId}/songs`,
  });
};
