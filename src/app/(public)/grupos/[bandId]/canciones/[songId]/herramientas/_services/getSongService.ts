import { FetchData } from '@global/services/HandleAPI';
import { Server1API } from '@global/config/constants';
import { SongLyric } from '@bands/[bandId]/canciones/_interfaces/songsInterface';

export interface SongToolsData {
  id: number;
  title: string;
  youtubeLink?: string;
  tempo?: number;
  startTime?: number;
  lyrics?: SongLyric[];
}

export const getSongToolsData = ({
  bandId,
  songId,
}: {
  bandId: string;
  songId: string;
}) => {
  return FetchData<SongToolsData>({
    key: [`SongToolsData`, bandId, songId],
    url: `${Server1API}/bands/${bandId}/songs/${songId}`,
    isEnabled: !!bandId && !!songId,
  });
};
