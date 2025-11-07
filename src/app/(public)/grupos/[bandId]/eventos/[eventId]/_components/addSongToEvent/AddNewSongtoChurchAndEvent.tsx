import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
  Checkbox,
} from '@nextui-org/react';
import { useEffect, useState } from 'react';
import { addSongsToEventService } from './services/AddSongsToEventService';
import { SongPropsWithoutId } from '@bands/[bandId]/canciones/_interfaces/songsInterface';
import toast from 'react-hot-toast';
import { useStore } from '@nanostores/react';
import { $event } from '@stores/event';
import { useRouter } from 'next/navigation';
import {
  addSongsToBandService,
  getSongsOfBand,
} from '@bands/[bandId]/canciones/_services/songsOfBandService';
import { handleOnChange } from '@global/utils/formUtils';
import { FormAddNewSong } from './FormAddNewSong';
export const AddNewSongtoChurchAndEvent = ({
  params,
  setIsOpenPopover,
  refetch,
}: {
  params: { bandId: string; eventId: string };
  setIsOpenPopover: (open: boolean) => void;
  refetch: () => void;
}) => {
  const formInit: SongPropsWithoutId = {
    title: '',
    artist: '',
    songType: 'worship',
    youtubeLink: '',
    key: '',
    tempo: 0,
  };
  const [form, setForm] = useState<SongPropsWithoutId>(formInit);
  const router = useRouter();
  const event = useStore($event);
  const [goToSong, setGoToSong] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { bandId } = params;
  const { data: songsOfChurch, status: statusGetSongs } = getSongsOfBand({
    bandId,
  });
  const {
    data: newSong,
    mutate: mutateAddSongToChurch,
    status: statusAddSongToChurch,
  } = addSongsToBandService({ bandId });
  const { status: statusAddSongToEvent, mutate: mutateAddSongToEvent } =
    addSongsToEventService({ params });
  useEffect(() => {
    if (!isOpen) {
      setIsOpenPopover(true);
    }
  }, [isOpen, setIsOpenPopover]);

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
      toast.error('Error al agregar canción al catálogo de la iglesia');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusAddSongToChurch]);

  useEffect(() => {
    if (statusAddSongToEvent === 'success') {
      toast.success('Canción agregada al evento');
      refetch();
      if (goToSong) {
        router.push(`/grupos/${params.bandId}/canciones/${newSong?.id}`);
      }
      onOpenChange();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusAddSongToEvent, newSong, goToSong, params]);

  const handleAddSongToChurchAndEvent = () => {
    if (form.title === '') {
      toast.error('El título de la canción es obligatorio');
      return;
    }
    mutateAddSongToChurch(form);
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
    <>
      <button
        onClick={() => {
          onOpen();
          setIsOpenPopover(false);
        }}
        className="group rounded-lg px-3 py-2.5 transition-all duration-200 hover:bg-gradient-to-r hover:from-brand-pink-50 hover:to-brand-purple-50 hover:shadow-sm"
      >
        <div className="flex flex-col gap-0.5">
          <div className="bg-gradient-to-r from-brand-pink-500 to-brand-purple-600 bg-clip-text text-left text-sm font-semibold text-transparent">
            ✨ Nueva Canción
          </div>
          <div className="text-left text-xs text-slate-600">
            Crea y agrega una canción al catálogo y evento
          </div>
        </div>
      </button>
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        size="lg"
        scrollBehavior="inside"
        classNames={{
          base: 'bg-white max-h-[90vh]',
          header: 'border-b border-slate-200 py-3',
          body: 'py-3 px-4',
          footer: 'border-t border-slate-200 py-3',
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <span className="bg-gradient-to-r from-brand-pink-500 to-brand-purple-600 bg-clip-text text-lg font-bold text-transparent">
                  ✨ Crear Nueva Canción
                </span>
              </ModalHeader>
              <ModalBody>
                <FormAddNewSong
                  form={form}
                  setForm={setForm}
                  handleChange={handleChange}
                />
              </ModalBody>
              <ModalFooter className="flex-col items-stretch gap-3 sm:flex-row sm:items-center">
                <Checkbox
                  isSelected={goToSong}
                  onChange={() => setGoToSong(!goToSong)}
                  classNames={{
                    label: 'text-sm text-slate-700',
                  }}
                >
                  Ir a la canción después de crear
                </Checkbox>
                <div className="flex gap-2">
                  <Button
                    color="danger"
                    variant="light"
                    onPress={onClose}
                    className="font-medium"
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
                    className="bg-gradient-to-r from-brand-pink-500 to-brand-purple-600 font-semibold text-white"
                  >
                    {statusAddSongToChurch === 'pending' ||
                    statusAddSongToEvent === 'pending'
                      ? 'Creando...'
                      : 'Crear Canción'}
                  </Button>
                </div>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
