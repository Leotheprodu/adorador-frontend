import {
  useQuery,
  useMutation,
  type UseQueryResult,
  type UseMutationResult,
} from '@tanstack/react-query';
import { fetchAPI } from '@global/utils/fetchAPI';

export const FetchData = <TResponse>({
  key,
  url,
  isEnabled = true,
}: {
  key: string;
  url: string;
  isEnabled?: boolean;
}): UseQueryResult<TResponse, Error> => {
  return useQuery<TResponse, Error>({
    queryKey: [key],
    queryFn: () => fetchAPI<TResponse>({ url }),
    enabled: !!isEnabled,
  });
};

export const PostData = <TResponse, TData = undefined>({
  key,
  url,
  method = 'POST',
  isFormData,
}: {
  key: string;
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  isFormData?: boolean;
}): UseMutationResult<TResponse, Error, TData | null, unknown> => {
  return useMutation<TResponse, Error, TData | null, unknown>({
    mutationKey: [key],
    mutationFn: async (data?: TData | null) => {
      return await fetchAPI<TResponse>({
        url,
        method,
        body: (data as FormData | null) ?? undefined,
        isFormData,
      });
    },
    onError: (error) => {
      console.log(error);
      throw new Error(error.message);
    },
  });
};
