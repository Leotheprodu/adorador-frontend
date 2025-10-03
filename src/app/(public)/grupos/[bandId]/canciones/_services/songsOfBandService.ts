import { FetchData, PostData } from '@global/services/HandleAPI';
import {
  SongProps,
  SongPropsWithCount,
  SongPropsWithoutId,
} from '../_interfaces/songsInterface';
import { Server1API } from '@global/config/constants';

export const getSongsOfBand = ({ bandId }: { bandId: string }) => {
  return FetchData<SongPropsWithCount[]>({
    key: 'SongsOfBand',
    url: `${Server1API}/bands/${bandId}/songs`,
  });
};

export const addSongsToBandService = ({ bandId }: { bandId: string }) => {
  return PostData<SongProps, SongPropsWithoutId>({
    key: 'AddSongsToBand',
    url: `${Server1API}/bands/${bandId}/songs`,
    method: 'POST',
  });
};
