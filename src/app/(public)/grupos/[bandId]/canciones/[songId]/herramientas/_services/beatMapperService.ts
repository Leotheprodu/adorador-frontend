import { PostData } from '@global/services/HandleAPI';
import { Server1API } from '@global/config/constants';
import { SongToolsData } from './getSongService';
import {
  SongLyric,
  SongChord,
} from '@bands/[bandId]/canciones/_interfaces/songsInterface';

interface SaveSongDataRequest {
  startTime?: number;
  tempo?: number;
  lyrics?: Partial<SongLyric>[];
  chords?: Partial<SongChord>[];
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
