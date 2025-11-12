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
  bandId: number;
  title: string;
  artist: string | null;
  key: string | null;
  tempo: number | null;
  songType: 'worship' | 'praise';
  youtubeLink?: string | null;
}

// Tipos para la vista completa de la canción
export interface ChordProps {
  id: number;
  rootNote: string;
  chordQuality?: string;
  slashChord?: string;
  position: number;
}

export interface StructureProps {
  id: number;
  title: string;
}

export interface LyricsProps {
  id: number;
  position: number;
  lyrics: string;
  structure: StructureProps;
  chords: ChordProps[];
}

export interface SongWithLyrics {
  id: number;
  title: string;
  artist: string | null;
  key: string | null;
  tempo: number | null;
  songType: 'worship' | 'praise';
  lyrics: LyricsProps[];
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
  requestedArtist: string | null;
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

export interface CommentBlessing {
  id: number;
}

export interface Comment {
  id: number;
  content: string;
  postId: number;
  authorId: number;
  parentId: number | null;
  sharedSongId: number | null; // Para compartir canción en respuesta
  createdAt: string;
  author: UserBasic;
  sharedSong?: SongBasic | null; // Canción compartida en el comentario
  replies?: Comment[];
  _count?: {
    blessings: number;
    songCopies?: number;
  };
  userBlessing?: CommentBlessing[]; // Blessings del usuario actual
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

export interface CommentBlessingResponse {
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
  sharedSongId?: number; // Para compartir canción en respuesta
}

export interface CopySongDto {
  targetBandId: number;
  newKey?: string;
  newTempo?: number;
  commentId?: number;
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

export interface WebSocketCommentBlessingEvent {
  commentId: number;
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
