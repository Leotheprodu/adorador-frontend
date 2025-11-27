import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/react';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { addSongsToBandService } from '../_services/songsOfBandService';
import { FormAddNewSong } from '@bands/[bandId]/eventos/[eventId]/en-vivo/_components/addSongToEvent/FormAddNewSong';
import { handleOnChange } from '@global/utils/formUtils';
import { PlusIcon, MusicNoteIcon } from '@global/icons';
import { useQueryClient } from '@tanstack/react-query';
import { SongPropsWithoutId } from '../_interfaces/songsInterface';
import { useInvalidateSubscriptionLimits } from '@bands/[bandId]/suscripcion/_hooks/useInvalidateSubscriptionLimits';

export const AddSongButton = ({ bandId }: { bandId: string }) => {
  const queryClient = useQueryClient();
  const { invalidateLimits } = useInvalidateSubscriptionLimits();

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
  const {
    mutate: mutateAddSongToBand,
    status: statusAddSongToBand,
    error: errorAddSongToBand,
  } = addSongsToBandService({ bandId });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleOnChange(setForm, e);
  };

  const handleAddSong = () => {
    if (form.title === '') {
      toast.error('El título de la canción es obligatorio');
      return;
    }
    mutateAddSongToBand(form);
  };

  useEffect(() => {
    if (statusAddSongToBand === 'success') {
      toast.success('Canción creada correctamente');
      // Invalidar queries para que se actualicen las listas de canciones
      queryClient.invalidateQueries({ queryKey: ['SongsOfBand', bandId] });
      queryClient.invalidateQueries({ queryKey: ['BandById', bandId] });
      // Invalidar la lista de grupos del usuario
      queryClient.invalidateQueries({ queryKey: ['BandsOfUser'] });
      // Invalidar límites de suscripción (currentSongs aumentó)
      invalidateLimits(bandId);
      // Cerrar el modal y resetear el formulario
      onOpenChange();
      setForm(formInit);
    }
    if (statusAddSongToBand === 'error') {
      // Detectar si es un error de límite de suscripción
      const errorMessage = errorAddSongToBand?.message || '';

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
        toast.error('Error al crear la canción');
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusAddSongToBand]);

  return (
    <>
      <Button
        onClick={() => {
          onOpen();
        }}
        size="sm"
        className="border-2 border-slate-200 bg-white font-semibold text-slate-700 transition-all hover:border-brand-purple-300 hover:bg-brand-purple-50 dark:border-slate-700 dark:bg-gray-900 dark:text-slate-100 dark:hover:border-brand-purple-400 dark:hover:bg-gray-800"
      >
        <PlusIcon className="h-5 w-5" /> Crear canción
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-2 bg-gradient-to-r from-brand-pink-50 to-brand-purple-50 pb-4 dark:bg-gray-900 dark:bg-none">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-brand-pink-500 to-brand-purple-500 shadow-md">
                    <MusicNoteIcon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <h2 className="bg-gradient-to-r from-brand-pink-500 to-brand-purple-600 bg-clip-text text-xl font-bold text-transparent dark:from-brand-pink-300 dark:to-brand-purple-300">
                      Nueva Canción
                    </h2>
                    <p className="text-xs font-normal text-slate-500 dark:text-slate-300">
                      Agrega una nueva canción al repertorio
                    </p>
                  </div>
                </div>
              </ModalHeader>
              <ModalBody className="py-6 dark:bg-gray-950">
                <FormAddNewSong
                  form={form}
                  setForm={setForm}
                  handleChange={handleChange}
                />
              </ModalBody>
              <ModalFooter className="gap-2 bg-slate-50 dark:bg-gray-900">
                <Button
                  variant="flat"
                  onPress={onClose}
                  className="font-medium dark:bg-gray-900 dark:text-slate-200"
                >
                  Cancelar
                </Button>
                <Button
                  variant="flat"
                  color="warning"
                  onPress={() => {
                    setForm(formInit);
                  }}
                  className="font-medium dark:bg-gray-900 dark:text-slate-200"
                >
                  Limpiar
                </Button>
                <Button
                  isLoading={statusAddSongToBand === 'pending'}
                  disabled={statusAddSongToBand === 'success'}
                  onPress={handleAddSong}
                  className="bg-gradient-to-r from-brand-pink-500 to-brand-purple-600 font-semibold text-white shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg dark:from-brand-pink-400 dark:to-brand-purple-400"
                >
                  Crear Canción
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
