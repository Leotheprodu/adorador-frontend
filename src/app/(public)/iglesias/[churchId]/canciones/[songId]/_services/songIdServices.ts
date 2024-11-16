import { FetchData } from '@global/services/HandleAPI';
import { SongProps } from '../../_interfaces/songsInterface';
import { Server1API } from '@global/config/constants';

export const getSongData = ({
  params,
}: {
  params: { churchId: string; songId: string };
}) => {
  return FetchData<SongProps>({
    key: 'SongData',
    url: `${Server1API}/churches/${params.churchId}/songs/${params.songId}`,
  });
};
