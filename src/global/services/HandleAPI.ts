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
  skipAuth = false,
  refetchOnMount = false,
}: {
  key: string | string[];
  url: string;
  isEnabled?: boolean;
  skipAuth?: boolean;
  refetchOnMount?: boolean;
}): UseQueryResult<TResponse, Error> => {
  return useQuery<TResponse, Error>({
    queryKey: Array.isArray(key) ? key : [key],
    queryFn: () => fetchAPI<TResponse>({ url, skipAuth }),
    enabled: !!isEnabled,
    staleTime: 1000 * 60 * 5, // 5 minutos
    gcTime: 1000 * 60 * 10, // 10 minutos
    refetchOnWindowFocus: false,
    refetchOnMount: refetchOnMount,
    refetchOnReconnect: false,
    // retry está heredado de QueryClient defaultOptions (3 intentos con exponential backoff)
    // Si se necesita diferente, se puede override aquí
  });
};

export const PostData = <TResponse, TData = undefined>({
  key,
  url,
  method = 'POST',
  isFormData,
  skipAuth = false,
}: {
  key: string;
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  isFormData?: boolean;
  skipAuth?: boolean;
}): UseMutationResult<TResponse, Error, TData | null, unknown> => {
  return useMutation<TResponse, Error, TData | null, unknown>({
    mutationKey: [key],
    mutationFn: async (data?: TData | null) => {
      return await fetchAPI<TResponse>({
        url,
        method,
        body: (data as FormData | null) ?? undefined,
        isFormData,
        skipAuth,
      });
    },
    onError: (error) => {
      console.log(error);
      throw new Error(error.message);
    },
  });
};
