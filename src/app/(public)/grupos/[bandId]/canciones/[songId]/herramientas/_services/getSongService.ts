import { FetchData } from '@global/services/HandleAPI';
import { Server1API } from '@global/config/constants';

export interface SongToolsData {
  id: number;
  title: string;
  youtubeLink?: string;
  tempo?: number;
  startTime?: number;
  lyrics?: any[]; // Set to SongLyric[] if imported
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
