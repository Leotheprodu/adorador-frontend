import { PostData } from '@global/services/HandleAPI';
import { Server1API } from '@global/config/constants';

export const eventUpdateSongs = ({
  params,
}: {
  params: { bandId: string; eventId: string };
}) => {
  const { bandId, eventId } = params;
  return PostData<
    { message: string },
    { songDetails: { songId: number; transpose: number; order: number }[] }
  >({
    key: 'EventSongUpdate',
    url: `${Server1API}/bands/${bandId}/events/${eventId}/songs`,
    method: 'PATCH',
  });
};
export const eventDeleteSongs = ({
  params,
}: {
  params: { bandId: string; eventId: string };
}) => {
  const { bandId, eventId } = params;
  return PostData<{ message: string }, { songIds: number[] }>({
    key: 'EventSongDelete',
    url: `${Server1API}/bands/${bandId}/events/${eventId}/songs`,
    method: 'DELETE',
  });
};
