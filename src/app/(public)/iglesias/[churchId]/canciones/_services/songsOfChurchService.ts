import { FetchData, PostData } from '@global/services/HandleAPI';
import {
  SongProps,
  SongPropsWithCount,
  SongPropsWithoutId,
} from '../_interfaces/songsInterface';
import { Server1API } from '@global/config/constants';

export const getSongsOfChurch = ({ churchId }: { churchId: string }) => {
  return FetchData<SongPropsWithCount[]>({
    key: 'SongsOfChurch',
    url: `${Server1API}/churches/${churchId}/songs`,
  });
};

export const addSongsToChurchService = ({
  params,
}: {
  params: { churchId: string; eventId: string };
}) => {
  const { churchId } = params;
  return PostData<SongProps, SongPropsWithoutId>({
    key: 'AddSongsToChurch',
    url: `${Server1API}/churches/${churchId}/songs`,
    method: 'POST',
  });
};
