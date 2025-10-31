import { FetchData, PostData } from '@global/services/HandleAPI';
import { Server1API } from '@global/config/constants';
import { EventsProps } from '../_interfaces/eventsInterface';

export interface EventPropsWithoutId {
  title: string;
  date: Date;
}

export const getEventsOfBand = ({ bandId }: { bandId: string }) => {
  return FetchData<EventsProps[]>({
    key: 'EventsOfBand',
    url: `${Server1API}/bands/${bandId}/events`,
    refetchOnMount: true,
  });
};

export const addEventsToBandService = ({ bandId }: { bandId: string }) => {
  return PostData<EventsProps, EventPropsWithoutId>({
    key: 'AddEventsToBand',
    url: `${Server1API}/bands/${bandId}/events`,
    method: 'POST',
  });
};

export const updateEventService = ({
  bandId,
  eventId,
}: {
  bandId: string;
  eventId: string;
}) => {
  return PostData<EventsProps, Partial<EventPropsWithoutId>>({
    key: 'UpdateEvent',
    url: `${Server1API}/bands/${bandId}/events/${eventId}`,
    method: 'PATCH',
  });
};

export const deleteEventService = ({
  bandId,
  eventId,
}: {
  bandId: string;
  eventId: string;
}) => {
  return PostData<EventsProps, null>({
    key: 'DeleteEvent',
    url: `${Server1API}/bands/${bandId}/events/${eventId}`,
    method: 'DELETE',
  });
};
