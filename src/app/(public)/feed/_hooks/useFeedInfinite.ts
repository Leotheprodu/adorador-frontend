import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchAPI } from '@global/utils/fetchAPI';
import { Server1API } from '@global/config/constants';
import { FeedResponse, PostType } from '../_interfaces/feedInterface';

interface UseFeedInfiniteProps {
  limit?: number;
  type?: PostType;
  enabled?: boolean;
}

export const useFeedInfinite = ({
  limit = 10,
  type,
  enabled = true,
}: UseFeedInfiniteProps = {}) => {
  return useInfiniteQuery<FeedResponse, Error>({
    queryKey: ['feed-infinite', type || 'all', limit],
    queryFn: async ({ pageParam }) => {
      const params = new URLSearchParams();
      if (pageParam) params.append('cursor', pageParam.toString());
      params.append('limit', limit.toString());
      if (type) params.append('type', type);

      return await fetchAPI<FeedResponse>({
        url: `${Server1API}/feed?${params.toString()}`,
      });
    },
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.nextCursor : undefined;
    },
    enabled,
    staleTime: 1000 * 60 * 2, // 2 minutos
    gcTime: 1000 * 60 * 10, // 10 minutos
    refetchOnWindowFocus: false,
    refetchOnMount: false,
  });
};
