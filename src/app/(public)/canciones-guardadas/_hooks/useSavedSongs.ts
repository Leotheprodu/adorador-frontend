import { getSavedSongsService } from '../_services/savedSongsService';
import { useStore } from '@nanostores/react';
import { $user } from '@global/stores/users';

export const useSavedSongs = () => {
  const user = useStore($user);

  const { data, isLoading, status, refetch, error } = getSavedSongsService(
    user.isLoggedIn,
  );

  console.log('Saved Songs Query:', {
    data,
    isLoading,
    status,
    error,
    isLoggedIn: user.isLoggedIn,
  });

  const songs = Array.isArray(data) ? data : data?.data || [];

  return {
    songs,
    isLoading,
    status,
    refetch,
    isLoggedIn: user.isLoggedIn,
    meta: !Array.isArray(data) ? data?.meta : undefined,
  };
};
