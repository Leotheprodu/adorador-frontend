import { EventsProps } from '@iglesias/[churchId]/eventos/_interfaces/eventsInterface';

export interface ChurchProps {
  id: number;
  name: string;
  address: string;
  country: string;
  email: string;
  aniversary: string;
  events: EventsProps[];
}
