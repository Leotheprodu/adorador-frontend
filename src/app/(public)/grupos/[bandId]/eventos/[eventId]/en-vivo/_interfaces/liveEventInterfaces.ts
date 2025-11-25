export interface EventPageHeaderProps {
    bandId: string;
    eventId: string;
    onBack: () => void;
    showActionButtons: boolean;
    isAdminEvent: boolean;
    refetch: () => void;
}

export interface EventControlsProps {
    params: { bandId: string; eventId: string };
    refetch: () => void;
    isLoading: boolean;
}

export interface UseEventNavigationProps {
    bandId: string;
    eventId: string;
}

export interface UseEventSongsListenerProps {
    eventId: string;
    refetch: () => void;
}
