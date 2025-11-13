import { FetchData, PostData } from '@global/services/HandleAPI';
import { Server1API } from '@global/config/constants';
import {
  FeedResponse,
  CommentsResponse,
  Post,
  Comment,
  BlessingResponse,
  CopySongResponse,
  CreatePostDto,
  UpdatePostDto,
  CreateCommentDto,
  CopySongDto,
  PostType,
  SongWithLyrics,
} from '../_interfaces/feedInterface';

/**
 * Obtener feed con paginación por cursor
 */
export const getFeedService = ({
  cursor,
  limit = 10,
  type,
}: {
  cursor?: number;
  limit?: number;
  type?: PostType;
}) => {
  const params = new URLSearchParams();
  if (cursor) params.append('cursor', cursor.toString());
  if (limit) params.append('limit', limit.toString());
  if (type) params.append('type', type);

  return FetchData<FeedResponse>({
    key: ['feed', cursor?.toString() || 'initial', type || 'all'],
    url: `${Server1API}/feed?${params.toString()}`,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
  });
};

/**
 * Obtener un post específico por ID
 */
export const getPostByIdService = ({ postId }: { postId: number }) => {
  return FetchData<Post>({
    key: ['post', postId.toString()],
    url: `${Server1API}/feed/posts/${postId}`,
    refetchOnMount: true,
  });
};

/**
 * Crear un nuevo post
 */
export const createPostService = () => {
  return PostData<Post, CreatePostDto>({
    key: 'createPost',
    url: `${Server1API}/feed/posts`,
    method: 'POST',
  });
};

/**
 * Actualizar un post
 */
export const updatePostService = ({ postId }: { postId: number }) => {
  return PostData<Post, UpdatePostDto>({
    key: 'updatePost',
    url: `${Server1API}/feed/posts/${postId}`,
    method: 'PATCH',
  });
};

/**
 * Eliminar un post (soft delete)
 */
export const deletePostService = ({ postId }: { postId: number }) => {
  return PostData<void, null>({
    key: 'deletePost',
    url: `${Server1API}/feed/posts/${postId}`,
    method: 'DELETE',
  });
};

/**
 * Obtener comentarios de un post con paginación
 */
export const getCommentsService = ({
  postId,
  cursor,
  limit = 10,
  isEnabled = true,
}: {
  postId: number;
  cursor?: number;
  limit?: number;
  isEnabled?: boolean;
}) => {
  const params = new URLSearchParams();
  if (cursor) params.append('cursor', cursor.toString());
  params.append('limit', limit.toString()); // Siempre enviar limit

  console.log(
    '🌐 URL de comentarios:',
    `${Server1API}/feed/posts/${postId}/comments?${params.toString()}`,
  );

  return FetchData<CommentsResponse>({
    key: ['comments', postId.toString(), cursor?.toString() || 'initial'],
    url: `${Server1API}/feed/posts/${postId}/comments?${params.toString()}`,
    refetchOnMount: true,
    isEnabled,
  });
};

/**
 * Crear un comentario
 */
export const createCommentService = ({ postId }: { postId: number }) => {
  return PostData<Comment, CreateCommentDto>({
    key: 'createComment',
    url: `${Server1API}/feed/posts/${postId}/comments`,
    method: 'POST',
  });
};

/**
 * Toggle blessing (dar o quitar)
 */
export const toggleBlessingService = ({
  postId,
}: {
  postId: number | null;
}) => {
  return PostData<BlessingResponse, null>({
    key: 'toggleBlessing',
    url: `${Server1API}/feed/posts/${postId}/blessings`,
    method: 'POST',
  });
};

/**
 * Toggle blessing en comentario (dar o quitar)
 */
export const toggleCommentBlessingService = ({
  commentId,
}: {
  commentId: number;
}) => {
  return PostData<BlessingResponse, null>({
    key: 'toggleCommentBlessing',
    url: `${Server1API}/feed/comments/${commentId}/blessings`,
    method: 'POST',
  });
};

/**
 * Copiar canción compartida
 */
export const copySongService = ({ postId }: { postId: number }) => {
  return PostData<CopySongResponse, CopySongDto>({
    key: 'copySong',
    url: `${Server1API}/feed/posts/${postId}/copy-song`,
    method: 'POST',
  });
};

/**
 * Copiar canción directamente por songId (desde comentarios)
 */
export const copySongDirectService = ({ songId }: { songId: number }) => {
  return PostData<CopySongResponse, CopySongDto>({
    key: 'copySongDirect',
    url: `${Server1API}/feed/songs/${songId}/copy`,
    method: 'POST',
  });
};

/**
 * Obtener canciones de una banda (para el modal de crear post)
 */
export const getSongsOfBandForFeed = (
  bandId: number,
  isEnabled: boolean = true,
) => {
  return FetchData<Array<{ id: number; title: string; artist: string | null }>>(
    {
      key: ['songsForFeed', bandId.toString()],
      url: `${Server1API}/bands/${bandId}/songs`,
      isEnabled,
      refetchOnMount: false,
    },
  );
};

/**
 * Obtener canción completa con letra y acordes
 */
export const getSongWithLyricsService = ({
  songId,
  bandId,
  isEnabled = true,
}: {
  songId: number;
  bandId: number;
  isEnabled?: boolean;
}) => {
  return FetchData<SongWithLyrics>({
    key: ['songWithLyrics', bandId.toString(), songId.toString()],
    url: `${Server1API}/bands/${bandId}/songs/${songId}`,
    isEnabled,
    refetchOnMount: false,
  });
};
