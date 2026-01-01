import { FetchData } from '@global/services/HandleAPI';
import { Server1API } from '@global/config/constants';
import { SavedSongsResponse } from '../_interfaces/savedSongsInterfaces';

export const getSavedSongsService = (enabled = true) => {
  return FetchData<SavedSongsResponse>({
    key: 'SavedSongs',
    url: `${Server1API}/saved-songs`,
    isEnabled: enabled,
    refetchOnMount: true, // Required because HandleAPI defaults this to false, and we need fresh data on navigation
  });
};
