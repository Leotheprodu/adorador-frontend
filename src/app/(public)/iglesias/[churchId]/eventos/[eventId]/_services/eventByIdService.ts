import { FetchData } from '@global/services/HandleAPI';
import { Server1API } from '@global/config/constants';
import { EventByIdInterface } from '@iglesias/[churchId]/eventos/_interfaces/eventsInterface';

export const getEventsById = ({
  churchId,
  eventId,
}: {
  churchId: string;
  eventId: string;
}) => {
  return FetchData<EventByIdInterface>({
    key: 'Event',
    url: `${Server1API}/churches/${churchId}/events/${eventId}`,
  });
};
