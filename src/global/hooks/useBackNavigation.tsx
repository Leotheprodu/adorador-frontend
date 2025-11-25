import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback } from 'react';

interface UseBackNavigationProps {
    bandId: string;
    targetPath: string;
    queryKeysToInvalidate?: string[][];
}

export const useBackNavigation = ({
    bandId,
    targetPath,
    queryKeysToInvalidate = [],
}: UseBackNavigationProps) => {
    const router = useRouter();
    const queryClient = useQueryClient();

    const handleBack = useCallback(() => {
        // Invalidate specified queries
        queryKeysToInvalidate.forEach((queryKey) => {
            queryClient.invalidateQueries({ queryKey });
        });

        // Default: always invalidate band query
        queryClient.invalidateQueries({ queryKey: ['BandById', bandId] });

        // Navigate
        router.push(targetPath);
    }, [bandId, targetPath, queryClient, router, queryKeysToInvalidate]);

    return { handleBack };
};
