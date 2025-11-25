import { EventByIdInterface } from '@bands/[bandId]/eventos/_interfaces/eventsInterface';

export interface EventAdminPageProps {
    params: {
        bandId: string;
        eventId: string;
    };
}

export interface EventAdminHeaderProps {
    bandId: string;
    eventId: string;
    showActionButtons: boolean;
    isAdminEvent: boolean;
    refetch: () => void;
}

export interface EventInfoCardProps {
    event: EventByIdInterface;
    isUpcoming: boolean;
    eventTimeLeft: string | null;
}

export interface EventQuickActionsProps {
    bandId: string;
    eventId: string;
}

export interface EventStatsCardProps {
    event: EventByIdInterface;
    isUpcoming: boolean;
}

