import {
  Button,
  Checkbox,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';
import { useEffect, useState } from 'react';
import { addSongsToEventService } from './services/AddSongsToEventService';
import { SongPropsWithoutId } from '@bands/[bandId]/canciones/_interfaces/songsInterface';
import toast from 'react-hot-toast';
import { useStore } from '@nanostores/react';
import { $event } from '@stores/event';
import {
  addSongsToBandService,
  getSongsOfBand,
} from '@bands/[bandId]/canciones/_services/songsOfBandService';
import { handleOnChange } from '@global/utils/formUtils';
import { FormAddNewSong } from './FormAddNewSong';
import { useRouter } from 'next/navigation';
import { useBandSongsWebSocket } from '@global/hooks/useBandSongsWebSocket';

export const AddNewSongtoChurchAndEvent = ({
  params,
  refetch,
  isOpen,
  onClose,
}: {
  params: { bandId: string; eventId: string };
  refetch: () => void;
  eventSongs?: { order: number; transpose: number; song: { id: number } }[];
  isOpen: boolean;
  onClose: () => void;
}) => {
  // Conectar al WebSocket para actualizaciones en tiempo real
  useBandSongsWebSocket({
    bandId: parseInt(params.bandId),
    enabled: isOpen,
  });
  const formInit: SongPropsWithoutId = {
    title: '',
    artist: '',
    songType: 'worship',
    youtubeLink: '',
    key: '',
    tempo: 0,
  };
  const [form, setForm] = useState<SongPropsWithoutId>(formInit);
  const [goToSong, setGoToSong] = useState(false);
  const event = useStore($event);
  const { bandId } = params;
  const router = useRouter();
  const { data: songsOfChurch, status: statusGetSongs } = getSongsOfBand({
    bandId,
  });
  const {
    data: newSong,
    mutate: mutateAddSongToChurch,
    status: statusAddSongToChurch,
    error: errorAddSongToChurch,
  } = addSongsToBandService({ bandId });
  const { status: statusAddSongToEvent, mutate: mutateAddSongToEvent } =
    addSongsToEventService({ params });

  useEffect(() => {
    if (statusAddSongToChurch === 'success') {
      toast.success('Canción agregada al catálogo de la iglesia');
      mutateAddSongToEvent({
        songDetails: [
          {
            songId: newSong.id,
            transpose: 0,
            order: event?.songs.length + 1 || 1,
          },
        ],
      });
    }
    if (statusAddSongToChurch === 'error') {
      // Detectar si es un error de límite de suscripción
      const errorMessage = errorAddSongToChurch?.message || '';

      if (errorMessage.includes('403-') && errorMessage.includes('límite')) {
        // Extraer el mensaje después del código de estado
        const customMessage =
          errorMessage.split('403-')[1] ||
          'Has alcanzado el límite de tu plan';
        toast.error(customMessage, {
          duration: 6000,
          icon: '🚫',
          style: {
            background: '#FEE2E2',
            color: '#991B1B',
            fontWeight: '600',
          },
        });
      } else {
        toast.error('Error al agregar canción al catálogo de la iglesia');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusAddSongToChurch]);

  useEffect(() => {
    if (statusAddSongToEvent === 'success') {
      toast.success('Canción agregada al evento');
      refetch();
      onClose();

      // Resetear formulario solo cuando se agrega exitosamente
      setForm(formInit);
      setGoToSong(false);

      // Emitir evento global para que otras partes de la app actualicen
      const event = new CustomEvent('eventSongsUpdated', {
        detail: {
          eventId: params.eventId,
          changeType: 'song-created-and-added',
        },
      });
      window.dispatchEvent(event);

      // Si el usuario eligió ir a la canción, redirigir
      if (goToSong && newSong?.id) {
        router.push(`/grupos/${bandId}/canciones/${newSong.id}`);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusAddSongToEvent]);

  const handleAddSongToChurchAndEvent = () => {
    if (form.title === '') {
      toast.error('El título de la canción es obligatorio');
      return;
    }
    mutateAddSongToChurch(form);
  };

  const handleClearForm = () => {
    setForm(formInit);
    setGoToSong(false);
    toast.success('Formulario limpiado');
  };

  const handleModalClose = () => {
    // Resetear formulario cuando se cierra el modal
    setForm(formInit);
    setGoToSong(false);
    onClose();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleOnChange(setForm, e);
  };

  useEffect(() => {
    if (statusGetSongs === 'success') {
      const songExists = songsOfChurch.some(
        (song) => song.title.toLowerCase() === form.title.toLowerCase(),
      );
      if (songExists) {
        toast.error('La canción ya existe en el catálogo de la iglesia');
      }
    }
  }, [statusGetSongs, songsOfChurch, form.title]);

  return (
    <Modal
      isOpen={isOpen}
      onOpenChange={(open) => {
        if (!open) {
          handleModalClose();
          onClose();
        }
      }}
      size="lg"
      scrollBehavior="inside"
      classNames={{
        base: 'bg-white max-h-[90vh] dark:bg-gray-900',
        header: 'border-b border-slate-200 py-3',
        body: 'py-3 px-4',
        footer: 'border-t border-slate-200 py-3',
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex items-center justify-between border-b border-slate-200">
              <span className="bg-gradient-to-r from-brand-pink-500 to-brand-purple-600 bg-clip-text text-lg font-bold text-transparent">
                ✨ Crear Nueva Canción
              </span>
              {(form.title || form.artist || form.youtubeLink || form.key) && (
                <button
                  onClick={handleClearForm}
                  className="text-xs text-slate-500 transition-colors hover:text-brand-pink-600"
                  title="Limpiar formulario"
                >
                  🗑️ Limpiar
                </button>
              )}
            </ModalHeader>
            <ModalBody>
              <FormAddNewSong
                form={form}
                setForm={setForm}
                handleChange={handleChange}
              />
              <Checkbox
                isSelected={goToSong}
                onValueChange={setGoToSong}
                size="sm"
                className="mt-2"
                classNames={{
                  label: 'text-sm text-slate-600 dark:text-slate-300',
                }}
              >
                Ir a la canción después de crear
              </Checkbox>
            </ModalBody>
            <ModalFooter className="flex flex-wrap gap-2">
              <Button
                color="danger"
                variant="light"
                onPress={onClose}
                className="whitespace-nowrap font-medium"
              >
                Cancelar
              </Button>
              <Button
                onPress={handleAddSongToChurchAndEvent}
                isDisabled={
                  statusAddSongToChurch === 'pending' ||
                  statusAddSongToEvent === 'pending'
                }
                isLoading={
                  statusAddSongToChurch === 'pending' ||
                  statusAddSongToEvent === 'pending'
                }
                className="whitespace-nowrap bg-gradient-to-r from-brand-pink-500 to-brand-purple-600 font-semibold text-white"
              >
                {statusAddSongToChurch === 'pending' ||
                statusAddSongToEvent === 'pending'
                  ? 'Creando...'
                  : 'Crear Canción'}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
