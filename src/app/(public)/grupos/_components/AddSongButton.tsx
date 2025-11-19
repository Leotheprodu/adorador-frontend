import { SongPropsWithoutId } from '@bands/[bandId]/canciones/_interfaces/songsInterface';
import { addSongsToBandService } from '@bands/[bandId]/canciones/_services/songsOfBandService';
import { FormAddNewSong } from '@bands/[bandId]/eventos/[eventId]/en-vivo/_components/addSongToEvent/FormAddNewSong';
import { handleOnChange } from '@global/utils/formUtils';
import { MusicNoteIcon, PlusIcon } from '@global/icons';
import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';

export const AddSongButton = ({ bandId }: { bandId: string }) => {
  const queryClient = useQueryClient();
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
      // Invalidar queries para que se actualicen las listas de canciones
      queryClient.invalidateQueries({ queryKey: ['SongsOfBand', bandId] });
      queryClient.invalidateQueries({ queryKey: ['BandById', bandId] });
      // Invalidar la lista de grupos del usuario (donde se muestra el contador de canciones)
      queryClient.invalidateQueries({ queryKey: ['BandsOfUser'] });
      // Redirigir a la nueva canción
      router.push(`/grupos/${bandId}/canciones/${newSong?.id}`);
    }
    if (statusAddSongToChurch === 'error') {
      toast.error('Error al crear la canción');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusAddSongToChurch]);

  return (
    <>
      <Button
        onClick={() => {
          onOpen();
        }}
        size="sm"
        className="border-2 border-slate-200 bg-white font-semibold text-slate-700 transition-all hover:border-brand-purple-300 hover:bg-brand-purple-50 dark:bg-brand-purple-800 dark:text-slate-100 dark:hover:border-brand-purple-800 dark:hover:bg-brand-purple-950"
      >
        <PlusIcon className="h-5 w-5" /> Añadir canción
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-2 bg-brand-purple-50 pb-4 dark:bg-gray-950">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-brand-purple-500 to-brand-blue-500 shadow-md">
                    <MusicNoteIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="bg-gradient-to-r from-brand-purple-600 to-brand-blue-600 bg-clip-text text-xl font-bold text-transparent">
                      Nueva Canción
                    </h2>
                    <p className="text-xs font-normal text-slate-500">
                      Agrega una canción al repertorio del grupo
                    </p>
                  </div>
                </div>
              </ModalHeader>
              <ModalBody className="py-6">
                <FormAddNewSong
                  form={form}
                  setForm={setForm}
                  handleChange={handleChange}
                />
              </ModalBody>
              <ModalFooter className="gap-2 bg-slate-50 dark:bg-gray-950">
                <Button
                  variant="flat"
                  onPress={onClose}
                  className="font-medium"
                >
                  Cancelar
                </Button>
                <Button
                  variant="flat"
                  color="warning"
                  onPress={() => {
                    setForm(formInit);
                  }}
                  className="font-medium"
                >
                  Limpiar
                </Button>
                <Button
                  isLoading={statusAddSongToChurch === 'pending'}
                  disabled={statusAddSongToChurch === 'success'}
                  onPress={handleAddSong}
                  className="bg-gradient-to-r from-brand-purple-600 to-brand-blue-600 font-semibold text-white shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg"
                >
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
