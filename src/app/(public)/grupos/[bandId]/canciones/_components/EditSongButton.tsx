import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';
import { FormAddNewSong } from '@bands/[bandId]/eventos/[eventId]/_components/addSongToEvent/FormAddNewSong';
import { useEditSong } from '@bands/[bandId]/canciones/_hooks/useEditSong';
import { SongPropsWithoutId } from '@bands/[bandId]/canciones/_interfaces/songsInterface';
import { EditIcon } from '@global/icons';

export const EditSongButton = ({
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
  const {
    form,
    setForm,
    isOpen,
    onOpenChange,
    handleChange,
    handleUpdateSong,
    handleOpenModal,
    statusUpdateSong,
  } = useEditSong({ bandId, songId, refetch, songData });

  return (
    <>
      <Button
        size="sm"
        onClick={handleOpenModal}
        className="border-2 border-slate-200 bg-white font-semibold text-slate-700 transition-all hover:border-brand-purple-300 hover:bg-brand-purple-50"
        startContent={<EditIcon className="h-4 w-4" />}
      >
        Editar Detalles
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Editar canción
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
                  isLoading={statusUpdateSong === 'pending'}
                  disabled={statusUpdateSong === 'success'}
                  color="primary"
                  onPress={handleUpdateSong}
                >
                  Actualizar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
