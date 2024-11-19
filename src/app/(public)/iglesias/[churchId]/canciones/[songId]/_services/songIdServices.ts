import { FetchData, PostData } from '@global/services/HandleAPI';
import { SongProps } from '../../_interfaces/songsInterface';
import { Server1API } from '@global/config/constants';
import { LyricsProps } from '@iglesias/[churchId]/eventos/_interfaces/eventsInterface';

export const getSongData = ({
  params,
}: {
  params: { churchId: string; songId: string };
}) => {
  return FetchData<SongProps>({
    key: 'SongData',
    url: `${Server1API}/churches/${params.churchId}/songs/${params.songId}`,
  });
};

export const getSongLyrics = ({
  params,
}: {
  params: { churchId: string; songId: string };
}) => {
  return FetchData<LyricsProps[]>({
    key: 'SongLyrics',
    url: `${Server1API}/churches/${params.churchId}/songs/${params.songId}/lyrics`,
  });
};

export const uploadSongLyrics = ({
  params,
}: {
  params: { churchId: string; songId: string };
}) => {
  return PostData<{ message: string }, FormData>({
    key: 'UploadSongLyrics',
    url: `${Server1API}/churches/${params.churchId}/songs/${params.songId}/lyrics/upload`,
    method: 'POST',
    isFormData: true,
  });
};
