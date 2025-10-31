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
      <Button variant="bordered" color="danger" onClick={handleOpenModal}>
        Editar Información
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
