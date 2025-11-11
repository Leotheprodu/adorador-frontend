import { Server1API } from '@global/config/constants';
import { PostData } from '@global/services/HandleAPI';
import { lyricSelectedProps } from '@stores/event';

export const lyricSelectedGateway = () => {
  return PostData<null, { message: lyricSelectedProps; id: string }>({
    key: 'lyricSelectedGateway',
    url: `${Server1API}/events-ws/lyric-selected`,
    method: 'POST',
  });
};
export const eventSelectedSongGateway = () => {
  return PostData<null, { message: number; id: string }>({
    key: 'eventSelectedSongGateway',
    url: `${Server1API}/events-ws/event-selected-song`,
    method: 'POST',
  });
};
