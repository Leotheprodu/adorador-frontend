import { useState, useMemo } from 'react';
import { EventsProps } from '@bands/[bandId]/eventos/_interfaces/eventsInterface';

type EventStatusFilter = 'all' | 'upcoming' | 'past';

export const useEventsFilter = () => {
    const [statusFilter, setStatusFilter] = useState<EventStatusFilter>('all');

    const filterPredicate = useMemo(() => {
        return (event: EventsProps) => {
            const currentDate = new Date();
            const eventDate = new Date(event.date);

            if (statusFilter === 'upcoming') {
                return eventDate >= currentDate;
            } else if (statusFilter === 'past') {
                return eventDate < currentDate;
            }
            return true; // 'all'
        };
    }, [statusFilter]);

    const sortComparator = useMemo(() => {
        return (a: EventsProps, b: EventsProps) => {
            const currentDate = new Date();
            const aDate = new Date(a.date).getTime();
            const bDate = new Date(b.date).getTime();
            const aIsUpcoming = new Date(a.date) >= currentDate;
            const bIsUpcoming = new Date(b.date) >= currentDate;

            // If filtering by specific status, sort accordingly
            if (statusFilter === 'upcoming') {
                return aDate - bDate; // Ascending for upcoming
            } else if (statusFilter === 'past') {
                return bDate - aDate; // Descending for past
            }

            // When showing all, prioritize upcoming events first
            if (aIsUpcoming && !bIsUpcoming) return -1;
            if (!aIsUpcoming && bIsUpcoming) return 1;
            // Within same category, upcoming ascending, past descending
            return aIsUpcoming ? aDate - bDate : bDate - aDate;
        };
    }, [statusFilter]);

    return {
        statusFilter,
        setStatusFilter,
        filterPredicate,
        sortComparator,
    };
};
