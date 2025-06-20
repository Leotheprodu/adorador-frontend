import { BandsProps } from '@bands/_interfaces/bandsInterface';
import { EventsProps } from '../eventos/_interfaces/eventsInterface';

export interface CountProps {
  events: number;
  songs: number;
  memberships: number;
}

export interface ExtendedChurchProps extends BandsProps {
  _count: CountProps;
  events: EventsProps[];
}
