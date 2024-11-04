import { FetchData, PostData } from '@global/services/HandleAPI';
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

export const eventAdminChange = ({
  params,
}: {
  params: { churchId: string; eventId: string };
}) => {
  const { churchId, eventId } = params;
  return PostData<{ message: string; eventManager: string }>({
    key: 'Event-Admin-Change',
    url: `${Server1API}/churches/${churchId}/events/${eventId}/change-event-manager`,
    method: 'GET',
  });
};
