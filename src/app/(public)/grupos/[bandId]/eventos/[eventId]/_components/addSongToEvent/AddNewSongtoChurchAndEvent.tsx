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
        className="rounded-xl px-1 py-2 duration-200 hover:bg-slate-200"
      >
        <div className="px-1 py-2">
          <div className="text-left text-small font-bold">
            Agregar nueva canción al catálogo
          </div>
          <div className="text-left text-tiny">
            Agrega una nueva canción al catálogo de la iglesia y al evento.
          </div>
        </div>
      </button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Formulario de nueva canción
              </ModalHeader>
              <ModalBody>
                <FormAddNewSong
                  form={form}
                  setForm={setForm}
                  handleChange={handleChange}
                />
              </ModalBody>
              <ModalFooter>
                <Checkbox
                  isSelected={goToSong}
                  onChange={() => setGoToSong(!goToSong)}
                >
                  <p className="text-sm">Al crear, ¿ir a canción?</p>
                </Checkbox>
                <Button color="danger" variant="light" onPress={onClose}>
                  Cerrar
                </Button>
                <Button color="primary" onPress={handleAddSongToChurchAndEvent}>
                  Crear
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
