import { FetchData, PostData } from '@global/services/HandleAPI';
import { Server1API } from '@global/config/constants';
import { EventByIdInterface } from '@bands/[bandId]/eventos/_interfaces/eventsInterface';

export const getEventsById = ({
  bandId,
  eventId,
}: {
  bandId: string;
  eventId: string;
}) => {
  return FetchData<EventByIdInterface>({
    key: ['Event', bandId, eventId],
    url: `${Server1API}/bands/${bandId}/events/${eventId}`,
  });
};

export const eventAdminChange = ({
  params,
}: {
  params: { bandId: string; eventId: string };
}) => {
  const { bandId, eventId } = params;
  return PostData<{ message: string; eventManager: string }>({
    key: 'Event-Admin-Change',
    url: `${Server1API}/bands/${bandId}/events/${eventId}/change-event-manager`,
    method: 'GET',
  });
};
