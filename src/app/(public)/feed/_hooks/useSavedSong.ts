import { useState, useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import {
  saveSongService,
  deleteSavedSongService,
  checkIsSavedService,
} from '../_services/officialSongsService';
import toast from 'react-hot-toast';

import { useSavedSongs } from '../../canciones-guardadas/_hooks/useSavedSongs';

export const useSavedSong = (songId: number, songTitle?: string) => {
  const { songs: savedSongs } = useSavedSongs();
  const queryClient = useQueryClient();
  const [isSaved, setIsSaved] = useState(false);

  // Check status
  const { data, isLoading: isChecking } = checkIsSavedService(songId);

  useEffect(() => {
    if (data) {
      setIsSaved(data.isSaved);
    }
  }, [data]);

  // Mutations
  const { mutate: saveMutate, isPending: isSaving } = saveSongService();

  // We need to re-instantiate the delete service hook for this specific song ID
  // This pattern of service-creation-as-hook might be slight overhead but it matches the architecture.
  const { mutate: unsaveMutate, isPending: isUnsaving } =
    deleteSavedSongService(songId);

  const toggleSave = () => {
    if (isSaved) {
      unsaveMutate(undefined, {
        onSuccess: () => {
          setIsSaved(false);
          toast.success('Canción eliminada de tus guardados');
          queryClient.invalidateQueries({
            queryKey: ['CheckSavedSong', String(songId)],
          });
          queryClient.invalidateQueries({
            queryKey: ['SavedSongs'],
          });
        },
        onError: () => {
          toast.error('Error al eliminar canción');
        },
      });
    } else {
      // Check for duplicate title if songTitle is provided
      if (
        songTitle &&
        savedSongs.some(
          (s) => s.song.title.toLowerCase() === songTitle.toLowerCase(),
        )
      ) {
        toast.error('Ya tienes una canción guardada con este nombre');
        return;
      }

      saveMutate(
        { songId },
        {
          onSuccess: () => {
            setIsSaved(true);
            toast.success('Canción guardada correctamente');
            queryClient.invalidateQueries({
              queryKey: ['CheckSavedSong', String(songId)],
            });
            queryClient.invalidateQueries({
              queryKey: ['SavedSongs'],
            });
          },
          onError: () => {
            toast.error('Error al guardar canción');
          },
        },
      );
    }
  };

  return {
    isSaved,
    isLoading: isChecking || isSaving || isUnsaving,
    toggleSave,
  };
};
