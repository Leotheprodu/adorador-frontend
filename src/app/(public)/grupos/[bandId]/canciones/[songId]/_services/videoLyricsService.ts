import { FetchData, PostData } from '@global/services/HandleAPI';
import { Server1API } from '@global/config/constants';
import { SongVideoLyrics } from '../../_interfaces/songsInterface';

export interface CreateVideoLyricsDto {
  youtubeId: string;
  title?: string;
  usesVideoLyrics?: boolean;
  videoType?: 'instrumental' | 'full';
  description?: string;
  priority?: number;
  isPreferred?: boolean;
}

export type UpdateVideoLyricsDto = Partial<CreateVideoLyricsDto>;

// GET all video lyrics for a song
export const getVideoLyricsService = ({
  bandId,
  songId,
}: {
  bandId: string;
  songId: string;
}) => {
  return FetchData<SongVideoLyrics[]>({
    key: ['SongVideoLyrics', bandId, songId],
    url: `${Server1API}/bands/${bandId}/songs/${songId}/video-lyrics`,
    refetchOnMount: true,
  });
};

// POST - Create video lyrics
export const createVideoLyricsService = ({
  bandId,
  songId,
}: {
  bandId: string;
  songId: string;
}) => {
  return PostData<SongVideoLyrics, CreateVideoLyricsDto>({
    key: 'CreateVideoLyrics',
    url: `${Server1API}/bands/${bandId}/songs/${songId}/video-lyrics`,
    method: 'POST',
  });
};

// PATCH - Update video lyrics
export const updateVideoLyricsService = ({
  bandId,
  songId,
  videoId,
}: {
  bandId: string;
  songId: string;
  videoId: number;
}) => {
  return PostData<SongVideoLyrics, UpdateVideoLyricsDto>({
    key: 'UpdateVideoLyrics',
    url: `${Server1API}/bands/${bandId}/songs/${songId}/video-lyrics/${videoId}`,
    method: 'PATCH',
  });
};

// DELETE - Delete video lyrics
export const deleteVideoLyricsService = ({
  bandId,
  songId,
  videoId,
}: {
  bandId: string;
  songId: string;
  videoId: number;
}) => {
  return PostData<{ message: string }, null>({
    key: 'DeleteVideoLyrics',
    url: `${Server1API}/bands/${bandId}/songs/${songId}/video-lyrics/${videoId}`,
    method: 'DELETE',
  });
};

// PATCH - Set preferred video lyrics
export const setPreferredVideoLyricsService = ({
  bandId,
  songId,
  videoId,
}: {
  bandId: string;
  songId: string;
  videoId: number;
}) => {
  return PostData<SongVideoLyrics, null>({
    key: 'SetPreferredVideoLyrics',
    url: `${Server1API}/bands/${bandId}/songs/${songId}/video-lyrics/${videoId}/set-preferred`,
    method: 'PATCH',
  });
};
