'use client';

import { useState, useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import {
  createVideoLyricsService,
  updateVideoLyricsService,
  deleteVideoLyricsService,
  setPreferredVideoLyricsService,
  UpdateVideoLyricsDto,
} from '../_services/videoLyricsService';
import { CreateVideoLyricsDto } from '../_services/videoLyricsService';
import { extractYouTubeId } from '@global/utils/formUtils';

/**
 * Hook for managing video lyrics CRUD operations
 * Handles creation, update, deletion and setting preferred video lyrics
 */
export const useVideoLyrics = ({
  bandId,
  songId,
}: {
  bandId: string;
  songId: string;
}) => {
  const queryClient = useQueryClient();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [videoIdState, setVideoIdState] = useState<number>(0);

  // Mutation hooks - MUST be at top level
  const { mutate: createMutate, isPending: isCreating } =
    createVideoLyricsService({ bandId, songId });

  const { mutate: deleteMutate, isPending: isDeleting } =
    deleteVideoLyricsService({ bandId, songId, videoId: videoIdState });

  const { mutate: setPreferredMutate, isPending: isSettingPreferred } =
    setPreferredVideoLyricsService({ bandId, songId, videoId: videoIdState });

  const { mutate: updateMutate, isPending: isUpdating } =
    updateVideoLyricsService({ bandId, songId, videoId: videoIdState });

  // Create video lyrics
  const handleCreate = (data: CreateVideoLyricsDto) => {
    const youtubeId = extractYouTubeId(data.youtubeId);

    if (!youtubeId) {
      toast.error('URL de YouTube inválida');
      return;
    }

    createMutate(
      { ...data, youtubeId },
      {
        onSuccess: () => {
          toast.success('Video con lyrics agregado exitosamente');
          // Invalidar queries relacionadas con el song
          queryClient.invalidateQueries({
            queryKey: ['SongVideoLyrics', bandId, songId],
          });
          queryClient.invalidateQueries({
            queryKey: ['Song', bandId, songId],
          });
          // Invalidar queries del grupo y lista de canciones
          queryClient.invalidateQueries({ queryKey: ['SongsOfBand', bandId] });
          queryClient.invalidateQueries({ queryKey: ['BandById', bandId] });
          // Invalidar queries de eventos que puedan usar esta canción
          queryClient.invalidateQueries({ queryKey: ['EventsOfBand', bandId] });
          setIsFormOpen(false);
        },
        onError: (error) => {
          toast.error('Error al agregar video con lyrics');
          console.error(error);
        },
      },
    );
  };

  // Update video lyrics - Must use mutation from update service
  const handleUpdate = (videoId: number, data: UpdateVideoLyricsDto) => {
    setVideoIdState(videoId);

    setTimeout(() => {
      updateMutate(data, {
        onSuccess: () => {
          toast.success('Video actualizado exitosamente');
          // Invalidar queries relacionadas con el song
          queryClient.invalidateQueries({
            queryKey: ['SongVideoLyrics', bandId, songId],
          });
          queryClient.invalidateQueries({
            queryKey: ['Song', bandId, songId],
          });
          // Invalidar queries del grupo y lista de canciones
          queryClient.invalidateQueries({ queryKey: ['SongsOfBand', bandId] });
          queryClient.invalidateQueries({ queryKey: ['BandById', bandId] });
          // Invalidar queries de eventos que puedan usar esta canción
          queryClient.invalidateQueries({ queryKey: ['EventsOfBand', bandId] });
        },
        onError: (error) => {
          toast.error('Error al actualizar video');
          console.error(error);
        },
      });
    }, 1000);
  };

  // Delete video lyrics  - Use single deleteMutate
  const handleDelete = (videoId: number) => {
    setVideoIdState(videoId);
    setTimeout(() => {
      deleteMutate(null, {
        onSuccess: () => {
          toast.success('Video eliminado exitosamente');
          // Invalidar queries relacionadas con el song
          queryClient.invalidateQueries({
            queryKey: ['SongVideoLyrics', bandId, songId],
          });
          queryClient.invalidateQueries({
            queryKey: ['Song', bandId, songId],
          });
          // Invalidar queries del grupo y lista de canciones
          queryClient.invalidateQueries({ queryKey: ['SongsOfBand', bandId] });
          queryClient.invalidateQueries({ queryKey: ['BandById', bandId] });
          // Invalidar queries de eventos que puedan usar esta canción
          queryClient.invalidateQueries({ queryKey: ['EventsOfBand', bandId] });
        },
        onError: (error) => {
          toast.error('Error al eliminar video');
          console.error(error);
        },
      });
    }, 1000);
  };

  // Set preferred video lyrics
  const handleSetPreferred = (videoId: number) => {
    setVideoIdState(videoId);
    setPreferredMutate(null, {
      onSuccess: () => {
        toast.success('Video marcado como preferido');
        // Invalidar queries relacionadas con el song
        queryClient.invalidateQueries({
          queryKey: ['SongVideoLyrics', bandId, songId],
        });
        queryClient.invalidateQueries({
          queryKey: ['Song', bandId, songId],
        });
        // Invalidar queries del grupo y lista de canciones
        queryClient.invalidateQueries({ queryKey: ['SongsOfBand', bandId] });
        queryClient.invalidateQueries({ queryKey: ['BandById', bandId] });
        // Invalidar queries de eventos que puedan usar esta canción
        queryClient.invalidateQueries({ queryKey: ['EventsOfBand', bandId] });
      },
      onError: (error) => {
        toast.error('Error al marcar como preferido');
        console.error(error);
      },
    });
  };

  return {
    // State
    isFormOpen,
    setIsFormOpen,

    // Actions
    handleCreate,
    handleUpdate,
    handleDelete,
    handleSetPreferred,

    //Loading states
    isCreating,
    isDeleting,
    isSettingPreferred,
    isLoading: isCreating || isDeleting || isSettingPreferred,
  };
};
