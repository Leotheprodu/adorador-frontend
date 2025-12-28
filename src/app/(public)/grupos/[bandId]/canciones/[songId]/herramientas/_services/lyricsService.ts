import { PostData } from '@global/services/HandleAPI';
import { Server1API } from '@global/config/constants';

interface UpdateSongsLyricDto {
  id?: number;
  lyrics?: string;
  position?: number;
  startTime?: number;
}

export const useSaveLyricsData = (bandId: string, songId: string) => {
  return PostData<{ message: string }, UpdateSongsLyricDto[]>({
    key: `SaveLyricsData-${songId}`,
    url: `${Server1API}/bands/${bandId}/songs/${songId}/lyrics`,
    method: 'PATCH',
  });
};

interface UpdateSongsChordDto {
  id: number;
  startTime: number;
}

export const useSaveChordsData = (bandId: string, songId: string) => {
  return PostData<{ message: string }, { chords: UpdateSongsChordDto[] }>({
    key: `SaveChordsData-${songId}`,
    url: `${Server1API}/bands/${bandId}/songs/${songId}/lyrics/chords`,
    method: 'POST',
  });
};
