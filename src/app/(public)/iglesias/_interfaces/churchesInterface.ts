export interface EventsProps {
  id: number;
  title: string;
  date: string | Date;
}

export interface ChurchProps {
  id: number;
  name: string;
  address: string;
  country: string;
  email: string;
  aniversary: string;
  events: EventsProps[];
}
