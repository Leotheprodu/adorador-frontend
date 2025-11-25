import { useState, useMemo } from 'react';

interface UseListFilterProps<T> {
    data: T[] | undefined;
    searchFields: (item: T) => string[];
    filterPredicate?: (item: T) => boolean;
    sortComparator?: (a: T, b: T) => number;
}

export const useListFilter = <T,>({
    data,
    searchFields,
    filterPredicate,
    sortComparator,
}: UseListFilterProps<T>) => {
    const [searchTerm, setSearchTerm] = useState('');

    const normalizeText = (text: string) => {
        return text
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '');
    };

    const filteredData = useMemo(() => {
        let filtered = data;

        // Apply search filter
        if (searchTerm !== '') {
            const normalizedSearch = normalizeText(searchTerm);
            filtered = filtered?.filter((item) =>
                searchFields(item).some((field) =>
                    normalizeText(field).includes(normalizedSearch),
                ),
            );
        }

        // Apply custom filter predicate
        if (filterPredicate) {
            filtered = filtered?.filter(filterPredicate);
        }

        // Apply sorting
        if (sortComparator && filtered) {
            filtered = [...filtered].sort(sortComparator);
        }

        return filtered;
    }, [data, searchTerm, filterPredicate, sortComparator, searchFields]);

    return {
        searchTerm,
        setSearchTerm,
        filteredData,
        normalizeText,
    };
};
