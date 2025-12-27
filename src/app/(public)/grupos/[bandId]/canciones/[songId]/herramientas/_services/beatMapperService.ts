import { PostData } from '@global/services/HandleAPI';
import { Server1API } from '@global/config/constants';
import { SongToolsData } from './getSongService';

interface SaveSongDataRequest {
  startTime?: number;
  tempo?: number;
  lyrics?: any[]; // Using any[] temporarily or import SongLyric
  chords?: any[];
}

interface SaveSongDataResponse {
  success: boolean;
  data: SongToolsData;
}

export const useSaveSongData = (bandId: string, songId: string) => {
  return PostData<SaveSongDataResponse, SaveSongDataRequest>({
    key: `SaveSongData-${songId}`,
    url: `${Server1API}/bands/${bandId}/songs/${songId}`,
    method: 'PATCH',
  });
};
