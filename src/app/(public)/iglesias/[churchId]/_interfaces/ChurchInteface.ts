import {
  ChurchProps,
  EventsProps,
} from '@iglesias/_interfaces/churchesInterface';

export interface CountProps {
  events: number;
  songs: number;
  memberships: number;
}

export interface ExtendedChurchProps extends ChurchProps {
  _count: CountProps;
  events: EventsProps[];
}
