import { FetchData } from '@/global/services/HandleAPI';
import { Server1API } from '@global/config/constants';
import { EventByIdInterface } from '@iglesias/[churchId]/eventos/_interfaces/eventsInterface';

export const getEventsById = ({ churchId, eventId }) => {
  return FetchData<EventByIdInterface[]>({
    key: 'event',
    url: `${Server1API}/churches/${churchId}/events/${eventId}`,
  });
};
