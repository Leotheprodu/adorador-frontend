import { FetchData, PostData } from '@global/services/HandleAPI';
import { SongPropsWithCount } from '../../_interfaces/songsInterface';
import { Server1API } from '@global/config/constants';
import {
  ChordPropsWithoutId,
  LyricsProps,
} from '@bands/[bandId]/eventos/_interfaces/eventsInterface';

export const getSongData = ({
  params,
}: {
  params: { bandId: string; songId: string };
}) => {
  return FetchData<SongPropsWithCount>({
    key: ['SongData', params.bandId, params.songId],
    url: `${Server1API}/bands/${params.bandId}/songs/${params.songId}`,
  });
};

export const getSongLyrics = ({
  params,
  isEnabled,
}: {
  params: { bandId: string; songId: string };
  isEnabled?: boolean;
}) => {
  return FetchData<LyricsProps[]>({
    key: ['SongLyrics', params.bandId, params.songId],
    url: `${Server1API}/bands/${params.bandId}/songs/${params.songId}/lyrics`,
    isEnabled,
  });
};

export const uploadSongLyrics = ({
  params,
}: {
  params: { bandId: string; songId: string };
}) => {
  return PostData<{ message: string }, FormData>({
    key: 'UploadSongLyrics',
    url: `${Server1API}/bands/${params.bandId}/songs/${params.songId}/lyrics/upload`,
    method: 'POST',
    isFormData: true,
  });
};

export const addNewLyricService = ({
  params,
}: {
  params: { bandId: string; songId: string };
}) => {
  return PostData<
    LyricsProps,
    {
      structureId: number;
      lyrics: string;
      position: number;
      startTime?: number;
    }
  >({
    key: 'CreateNewLyric',
    url: `${Server1API}/bands/${params.bandId}/songs/${params.songId}/lyrics`,
    method: 'POST',
  });
};

export const updateLyricService = ({
  params,
  lyricId,
}: {
  params: { bandId: string; songId: string };
  lyricId: number;
}) => {
  return PostData<
    { message: string },
    { structureId?: number; lyrics?: string; position?: number }
  >({
    key: 'UpdateLyric',
    url: `${Server1API}/bands/${params.bandId}/songs/${params.songId}/lyrics/${lyricId}`,
    method: 'PATCH',
  });
};

export const updateLyricsPositionsService = ({
  params,
}: {
  params: { bandId: string; songId: string };
}) => {
  return PostData<
    { message: string },
    { id: number; position: number; structureId?: number }[]
  >({
    key: 'UpdateLyricsPositions',
    url: `${Server1API}/bands/${params.bandId}/songs/${params.songId}/lyrics`,
    method: 'PATCH',
  });
};

export const deleteLyricService = ({
  params,
  lyricId,
}: {
  params: { bandId: string; songId: string };
  lyricId: number;
}) => {
  return PostData<{ message: string }>({
    key: 'DeleteLyric',
    url: `${Server1API}/bands/${params.bandId}/songs/${params.songId}/lyrics/${lyricId}`,
    method: 'DELETE',
  });
};

export const addChordToLyricService = ({
  params,
  lyricId,
}: {
  params: { bandId: string; songId: string };
  lyricId: number;
}) => {
  return PostData<{ message: string }, ChordPropsWithoutId>({
    key: 'CreateNewChord',
    url: `${Server1API}/bands/${params.bandId}/songs/${params.songId}/lyrics/${lyricId}/chords`,
    method: 'POST',
  });
};

export const changeChordPositionService = ({
  params,
  lyricId,
  chordId,
}: {
  params: { bandId: string; songId: string };
  lyricId: number;
  chordId: number;
}) => {
  return PostData<{ message: string }, { position: number }>({
    key: 'ChangeChordPosition',
    url: `${Server1API}/bands/${params.bandId}/songs/${params.songId}/lyrics/${lyricId}/chords/${chordId}`,
    method: 'PATCH',
  });
};

export const deleteChordService = ({
  params,
  lyricId,
  chordId,
}: {
  params: { bandId: string; songId: string };
  lyricId: number;
  chordId: number;
}) => {
  return PostData<{ message: string }>({
    key: 'DeleteChord',
    url: `${Server1API}/bands/${params.bandId}/songs/${params.songId}/lyrics/${lyricId}/chords/${chordId}`,
    method: 'DELETE',
  });
};

export const parseTextLyricsService = ({
  params,
}: {
  params: { bandId: string; songId: string };
}) => {
  return PostData<{ message: string }, { textContent: string }>({
    key: 'ParseTextLyrics',
    url: `${Server1API}/bands/${params.bandId}/songs/${params.songId}/lyrics/parse-text`,
    method: 'POST',
  });
};

export const deleteAllLyricsService = ({
  params,
}: {
  params: { bandId: string; songId: string };
}) => {
  return PostData<{ message: string }>({
    key: 'DeleteAllLyrics',
    url: `${Server1API}/bands/${params.bandId}/songs/${params.songId}/lyrics/all`,
    method: 'DELETE',
  });
};

export const normalizeLyricsService = ({
  params,
}: {
  params: { bandId: string; songId: string };
}) => {
  return PostData<
    { message: string; normalized: number },
    { lyricIds: number[] }
  >({
    key: 'NormalizeLyrics',
    url: `${Server1API}/bands/${params.bandId}/songs/${params.songId}/lyrics/normalize`,
    method: 'POST',
  });
};

export const parseAndUpdateSingleLyricService = ({
  params,
  lyricId,
}: {
  params: { bandId: string; songId: string };
  lyricId: number;
}) => {
  return PostData<LyricsProps, { textContent: string; structureId?: number }>({
    key: 'ParseAndUpdateSingleLyric',
    url: `${Server1API}/bands/${params.bandId}/songs/${params.songId}/lyrics/${lyricId}/parse-and-update`,
    method: 'PATCH',
  });
};
