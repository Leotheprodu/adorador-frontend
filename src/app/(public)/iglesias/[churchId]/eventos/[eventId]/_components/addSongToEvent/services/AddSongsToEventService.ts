import { PostData } from '@global/services/HandleAPI';
import { Server1API } from '@global/config/constants';

export const addSongsToEventService = ({
  params,
}: {
  params: { churchId: string; eventId: string };
}) => {
  const { churchId, eventId } = params;
  return PostData<
    { message: string },
    { songDetails: { songId: number; transpose: number; order: number }[] }
  >({
    key: 'EventAddSongs',
    url: `${Server1API}/churches/${churchId}/events/${eventId}/songs`,
    method: 'POST',
  });
};
