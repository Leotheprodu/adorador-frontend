import { BandsWithMembersCount } from './bandsInterface';
import { EventsProps } from '../[bandId]/eventos/_interfaces/eventsInterface';

export interface BandCardProps {
    band: BandsWithMembersCount;
}

export interface BandHeaderProps {
    name: string;
    isUserAuthorized: boolean;
    onEditOpen: () => void;
    onDeleteOpen: () => void;
}

export interface BandStatsProps {
    eventCount: number;
    songCount: number;
    memberCount: number;
}

export interface BandEventsProps {
    events: EventsProps[];
    currentEventIndex: number;
    isCurrentEvent: boolean;
    eventTimeLeft: string | null;
    onNextEvent: () => void;
    onPrevEvent: () => void;
}

export interface BandActionsProps {
    bandId: number;
    eventId?: number;
}
