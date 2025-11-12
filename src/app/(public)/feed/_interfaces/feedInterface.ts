export type PostType = 'SONG_REQUEST' | 'SONG_SHARE';
export type PostStatus = 'ACTIVE' | 'RESOLVED' | 'DELETED';

export interface UserBasic {
  id: number;
  name: string;
}

export interface BandBasic {
  id: number;
  name: string;
}

export interface SongBasic {
  id: number;
  title: string;
  artist: string | null;
  key: string | null;
  tempo: number | null;
  songType: 'worship' | 'praise';
}

export interface Blessing {
  id: number;
}

export interface Post {
  id: number;
  type: PostType;
  status: PostStatus;
  title: string; // Título del post
  description: string | null; // Descripción/contenido del post
  requestedSongTitle: string | null;
  requestedSongArtist: string | null;
  requestedYoutubeUrl: string | null; // URL de YouTube para solicitudes
  authorId: number;
  bandId: number;
  sharedSongId: number | null;
  createdAt: string;
  updatedAt: string;
  author: UserBasic;
  band: BandBasic;
  sharedSong: SongBasic | null;
  _count: {
    blessings: number;
    comments: number;
    songCopies: number;
  };
  userBlessing: Blessing[];
}

export interface Comment {
  id: number;
  content: string;
  postId: number;
  authorId: number;
  parentId: number | null;
  createdAt: string;
  author: UserBasic;
  replies?: Comment[];
}

export interface FeedResponse {
  items: Post[];
  nextCursor: number | null;
  hasMore: boolean;
}

export interface BlessingResponse {
  blessed: boolean;
  count: number;
}

export interface CopySongResponse {
  success: boolean;
  copiedSong: {
    id: number;
    title: string;
    bandId: number;
  };
}

export interface CreatePostDto {
  type: PostType;
  bandId: number;
  title: string; // Siempre requerido
  description?: string; // Opcional
  sharedSongId?: number;
  requestedSongTitle?: string;
  requestedArtist?: string;
  requestedYoutubeUrl?: string; // URL de YouTube para solicitudes
}

export interface UpdatePostDto {
  content?: string;
  status?: PostStatus;
}

export interface CreateCommentDto {
  content: string;
  parentId?: number;
}

export interface CopySongDto {
  targetBandId: number;
  newKey?: string;
  newTempo?: number;
}

// WebSocket event types
export interface WebSocketNewPostEvent {
  post: Post;
}

export interface WebSocketPostUpdatedEvent {
  post: Post;
}

export interface WebSocketPostDeletedEvent {
  postId: number;
}

export interface WebSocketNewCommentEvent {
  postId: number;
  comment: Comment;
}

export interface WebSocketBlessingEvent {
  postId: number;
  userId: number;
  count: number;
}

export interface WebSocketSongCopiedEvent {
  postId: number;
  userId: number;
  userName: string;
  targetBandName: string;
  count: number;
}
