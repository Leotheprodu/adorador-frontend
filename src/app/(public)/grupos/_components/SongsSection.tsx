import { SongPropsWithoutId } from '@bands/[bandId]/canciones/_interfaces/songsInterface';
import { addSongsToBandService } from '@bands/[bandId]/canciones/_services/songsOfBandService';
import { FormAddNewSong } from '@bands/[bandId]/eventos/[eventId]/_components/addSongToEvent/FormAddNewSong';
import { handleOnChange } from '@global/utils/formUtils';
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';

export const SongsSection = ({ data, bandId }) => {
  const formInit: SongPropsWithoutId = {
    title: '',
    artist: '',
    songType: 'worship',
    youtubeLink: '',
    key: '',
    tempo: 0,
  };
  const [form, setForm] = useState<SongPropsWithoutId>(formInit);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const router = useRouter();
  const {
    data: newSong,
    mutate: mutateAddSongToChurch,
    status: statusAddSongToChurch,
  } = addSongsToBandService({ bandId });
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleOnChange(setForm, e);
  };
  const handleAddSong = () => {
    if (form.title === '') {
      toast.error('El título de la canción es obligatorio');
      return;
    }
    mutateAddSongToChurch(form);
  };
  useEffect(() => {
    if (statusAddSongToChurch === 'success') {
      router.push(`/grupos/${bandId}/canciones/${newSong?.id}`);
    }
    if (statusAddSongToChurch === 'error') {
      toast.error('Error al crear la canción');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusAddSongToChurch]);

  return (
    <div className="my-4 flex flex-col justify-center">
      <div className="my-6 flex items-center">
        <h2 className="text-lg">Canciones</h2>
        <Button
          onClick={() => {
            onOpen();
          }}
          className="ml-4"
          color="primary"
        >
          + Añadir canción
        </Button>
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
                  <Button color="warning" variant="light" onPress={onClose}>
                    Cerrar
                  </Button>
                  <Button
                    color="danger"
                    variant="light"
                    onPress={() => {
                      setForm(formInit);
                    }}
                  >
                    Limpiar
                  </Button>

                  <Button
                    isLoading={statusAddSongToChurch === 'pending'}
                    disabled={statusAddSongToChurch === 'success'}
                    color="primary"
                    onPress={handleAddSong}
                  >
                    Crear
                  </Button>
                </ModalFooter>
              </>
            )}
          </ModalContent>
        </Modal>
      </div>
      <ul className="flex flex-wrap justify-center gap-3">
        {data &&
          data.songs?.map((song) => (
            <li key={song.id}>
              <Link href={`/grupos/${bandId}/canciones/${song.id}`}>
                <div className="rounded-md border p-2 hover:cursor-pointer hover:bg-gray-100">
                  <h3>{song.title}</h3>
                  <p>{song.artist}</p>
                </div>
              </Link>
            </li>
          ))}
      </ul>
      {data && data?._count.songs > 5 && (
        <div className="flex justify-center">
          <Button
            color="primary"
            variant="ghost"
            as={Link}
            href={`/grupos/${bandId}/canciones`}
            className="mt-4 w-48"
          >
            Ver todas las canciones ({data?._count.songs})
          </Button>
        </div>
      )}
    </div>
  );
};
