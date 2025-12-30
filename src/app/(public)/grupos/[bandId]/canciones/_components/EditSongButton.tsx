import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/react';
import { FormAddNewSong } from '@bands/[bandId]/eventos/[eventId]/en-vivo/_components/addSongToEvent/FormAddNewSong';
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
        variant="flat"
        onPress={handleOpenModal}
        startContent={<EditIcon className="h-4 w-4" />}
      >
        Editar Detalles
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 dark:bg-gray-900">
                Editar canción
              </ModalHeader>
              <ModalBody className="dark:bg-gray-950">
                <FormAddNewSong
                  form={form}
                  setForm={setForm}
                  handleChange={handleChange}
                />
              </ModalBody>
              <ModalFooter className="dark:bg-gray-900">
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
