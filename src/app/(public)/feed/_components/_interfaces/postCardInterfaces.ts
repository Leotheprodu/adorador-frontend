export interface PostHeaderProps {
  authorName: string;
  bandName: string;
  isSongShare: boolean;
}

export interface SongShareContentProps {
  postId: number;
  song: {
    id: number;
    bandId: number;
    title: string;
    artist: string | null;
    key: string | null;
    tempo: number | null;
    songType: 'worship' | 'praise';
    youtubeLink?: string | null;
    hasSyncedLyrics?: boolean;
    hasSyncedChords?: boolean;
    hasLyrics?: boolean;
    hasChords?: boolean;
  };
  onViewSong?: (postId: number) => void;
  onCopySong?: (postId: number) => void;
}

export interface SongRequestContentProps {
  postId: number;
  requestedSongTitle: string | null;
  requestedArtist: string | null;
  requestedYoutubeUrl: string | null;
}

export interface PostFooterProps {
  isBlessed: boolean;
  blessingCount: number;
  commentCount: number;
  songCopyCount?: number;
  isSongShare: boolean;
  onToggleBlessing: () => void;
  onToggleComments: () => void;
  isBlessingLoading: boolean;
}

export interface PostCardProps {
  post: {
    id: number;
    type: 'SONG_SHARE' | 'SONG_REQUEST';
    title: string;
    description: string | null;
    createdAt: string;
    author: { id: number; name: string };
    band: { id: number; name: string };
    sharedSong?: {
      id: number;
      bandId: number;
      title: string;
      artist: string | null;
      key: string | null;
      tempo: number | null;
      songType: 'worship' | 'praise';
      youtubeLink?: string | null;
      hasSyncedLyrics?: boolean;
      hasSyncedChords?: boolean;
      hasLyrics?: boolean;
      hasChords?: boolean;
    } | null;
    sharedSongId: number | null;
    requestedSongTitle: string | null;
    requestedArtist: string | null;
    requestedYoutubeUrl: string | null;
    userBlessing: unknown[];
    _count: {
      blessings: number;
      comments: number;
      songCopies: number;
    };
  };
  onCopySong?: (postId: number) => void;
  onViewSong?: (postId: number) => void;
  userBands?: Array<{ id: number; name: string }>;
  onCopySongFromComment?: (
    songId: number,
    key?: string,
    tempo?: number,
  ) => void;
  onViewSongFromComment?: (songId: number, bandId: number) => void;
}
