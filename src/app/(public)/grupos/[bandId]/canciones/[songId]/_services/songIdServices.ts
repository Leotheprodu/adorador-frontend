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
    key: 'SongData',
    url: `${Server1API}/bands/${params.bandId}/songs/${params.songId}`,
  });
};

export const getSongLyrics = ({
  params,
}: {
  params: { bandId: string; songId: string };
}) => {
  return FetchData<LyricsProps[]>({
    key: 'SongLyrics',
    url: `${Server1API}/bands/${params.bandId}/songs/${params.songId}/lyrics`,
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
    { message: string },
    { structureId: number; lyrics: string; position: number }
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
  return PostData<{ message: string }, { id: number; position: number }[]>({
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
