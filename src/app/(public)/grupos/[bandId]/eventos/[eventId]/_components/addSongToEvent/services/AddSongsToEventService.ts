import { PostData } from '@global/services/HandleAPI';
import { Server1API } from '@global/config/constants';

export const addSongsToEventService = ({
  params,
}: {
  params: { bandId: string; eventId: string };
}) => {
  const { bandId, eventId } = params;
  return PostData<
    { message: string },
    { songDetails: { songId: number; transpose: number; order: number }[] }
  >({
    key: 'EventAddSongs',
    url: `${Server1API}/bands/${bandId}/events/${eventId}/songs`,
    method: 'POST',
  });
};
