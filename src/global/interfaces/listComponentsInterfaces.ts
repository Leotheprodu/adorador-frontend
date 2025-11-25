import { ReactNode } from 'react';

export interface ListHeaderProps {
    title: string;
    subtitle: string;
    onBack: () => void;
    actionButton: ReactNode;
    gradientFrom: string;
    gradientTo: string;
}

export interface SearchAndFilterProps {
    searchTerm: string;
    onSearchChange: (value: string) => void;
    searchPlaceholder: string;
    filterButtons: ReactNode;
}

export interface EmptyStateProps {
    icon: string;
    title: string;
    description: string;
    actionButton?: ReactNode;
}
