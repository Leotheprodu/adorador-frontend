import { FetchData, PostData } from '@global/services/HandleAPI';
import { Server1API } from '@global/config/constants';

export const saveSongService = () => {
  return PostData<
    { id: number; userId: number; songId: number },
    { songId: number }
  >({
    key: 'SaveSong',
    url: `${Server1API}/saved-songs`,
    method: 'POST',
  });
};

export const unsaveSongService = () => {
  return PostData<{ message: string }, void>({
    key: 'UnsaveSong',
    url: `${Server1API}/saved-songs`, // The ID is dynamic, handled in the hook wrapper or here?
    // PostData requires a static URL usually for the mutation key, but the key can be dynamic.
    // However, PostData implementation in HandleAPI takes a generic URL.
    // If we want to use DELETE with param, we might need a wrapper or pass the full URL to the mutate function if propery supported.
    // But looking at PostData implementation: url is passed in the hook creation.
    // So we need a factory or pass it dynamically.
    // Actually standard practice is to use a parametric mutation or pass the ID to the mutation function and construct URL there?
    // No, HandleAPI PostData takes 'url' at hook level.
    // Let's look at `deleteSongService` example from `songsOfBandService.ts`.
    // It takes { bandId, songId } and returns PostData with constructed URL.
    // So I should follow that pattern.
    method: 'DELETE',
  });
};

// Wait, standard mutation in React Query can take variables.
// In `songsOfBandService` (step 128):
/*
export const deleteSongService = ({
  bandId,
  songId,
}: {
  bandId: string;
  songId: string;
}) => {
  return PostData<{ message: string }, void>({
    key: 'DeleteSong',
    url: `${Server1API}/bands/${bandId}/songs/${songId}`,
    method: 'DELETE',
  });
};
*/
// This means the HOOK is created specific to that song? usage in component: `const { mutate } = deleteSongService({...})`.
// If I use it in `OfficialSongRow`, I can pass the songId to the service creator.

export const deleteSavedSongService = (songId: number) => {
  return PostData<{ message: string }, void>({
    key: 'UnsaveSong', // This key might need to be unique per song if used in parallel? No, mutation keys usually generic.
    url: `${Server1API}/saved-songs/${songId}`,
    method: 'DELETE',
  });
};

export const checkIsSavedService = (songId: number) => {
  return FetchData<{ isSaved: boolean }>({
    key: ['CheckSavedSong', String(songId)],
    url: `${Server1API}/saved-songs/${songId}/check`,
    isEnabled: !!songId,
  });
};
