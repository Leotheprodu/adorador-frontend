import { PostData } from '@global/services/HandleAPI';
import { Server1API } from '@global/config/constants';
import { EventsProps } from '../_interfaces/eventsInterface';

export interface EventPropsWithoutId {
  title: string;
  date: Date;
}

export const addEventsToBandService = ({ bandId }: { bandId: string }) => {
  return PostData<EventsProps, EventPropsWithoutId>({
    key: 'AddEventsToBand',
    url: `${Server1API}/bands/${bandId}/events`,
    method: 'POST',
  });
};
