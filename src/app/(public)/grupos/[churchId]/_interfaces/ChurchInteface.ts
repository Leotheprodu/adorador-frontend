import { ChurchProps } from '@app/(public)/grupos/_interfaces/churchesInterface';
import { EventsProps } from '../eventos/_interfaces/eventsInterface';

export interface CountProps {
  events: number;
  songs: number;
  memberships: number;
}

export interface ExtendedChurchProps extends ChurchProps {
  _count: CountProps;
  events: EventsProps[];
}
