import { useDisclosure } from '@nextui-org/react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { updateSongService } from '@bands/[bandId]/canciones/_services/songsOfBandService';
import { SongPropsWithoutId } from '@bands/[bandId]/canciones/_interfaces/songsInterface';
import { handleOnChange } from '@global/utils/formUtils';
import { useQueryClient } from '@tanstack/react-query';

export const useEditSong = ({
  bandId,
  songId,
  refetch,
  songData,
}: {
  bandId: string;
  songId: string;
  refetch: () => void;
  songData: SongPropsWithoutId | undefined;
}) => {
  const queryClient = useQueryClient();
  const [form, setForm] = useState<SongPropsWithoutId>({
    title: '',
    artist: '',
    songType: 'worship',
    youtubeLink: '',
    key: '',
    tempo: 0,
  });
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    mutate: mutateUpdateSong,
    status: statusUpdateSong,
    reset,
  } = updateSongService({ bandId, songId });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleOnChange(setForm, e);
  };

  const handleUpdateSong = () => {
    if (form.title === '') {
      toast.error('El título de la canción es obligatorio');
      return;
    }
    mutateUpdateSong(form);
  };

  // Pre-cargar datos de la canción cuando se abre el modal
  const handleOpenModal = () => {
    if (songData) {
      setForm({
        title: songData.title || '',
        artist: songData.artist || '',
        songType: songData.songType || 'worship',
        youtubeLink: songData.youtubeLink || '',
        key: songData.key || '',
        tempo: songData.tempo || 0,
      });
    }
    onOpen();
  };

  useEffect(() => {
    if (statusUpdateSong === 'success') {
      toast.success('Canción actualizada correctamente');

      // Invalidar las queries relacionadas para forzar refetch
      queryClient.invalidateQueries({ queryKey: ['SongsOfBand', bandId] });
      queryClient.invalidateQueries({ queryKey: ['BandById', bandId] });
      queryClient.invalidateQueries({ queryKey: ['SongData', bandId, songId] });

      refetch();
      reset();
      onOpenChange();
    }
    if (statusUpdateSong === 'error') {
      toast.error('Error al actualizar la canción');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusUpdateSong]);

  return {
    form,
    setForm,
    isOpen,
    onOpenChange,
    handleChange,
    handleUpdateSong,
    handleOpenModal,
    statusUpdateSong,
  };
};
