import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/react';
import { useDeleteSong } from '@bands/[bandId]/canciones/_hooks/useDeleteSong';

export const DeleteSongButton = ({
  bandId,
  songId,
  songTitle,
}: {
  bandId: string;
  songId: string;
  songTitle: string;
}) => {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { handleDeleteSong, statusDeleteSong } = useDeleteSong({
    bandId,
    songId,
  });

  return (
    <>
      <Button variant="bordered" color="danger" onClick={onOpen}>
        Eliminar Canción
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Confirmar eliminación
              </ModalHeader>
              <ModalBody>
                <p>
                  ¿Estás seguro de que deseas eliminar la canción{' '}
                  <strong>&quot;{songTitle}&quot;</strong>?
                </p>
                <p className="text-sm text-danger">
                  Esta acción no se puede deshacer.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  Cancelar
                </Button>
                <Button
                  isLoading={statusDeleteSong === 'pending'}
                  disabled={statusDeleteSong === 'success'}
                  color="danger"
                  onPress={handleDeleteSong}
                >
                  Eliminar
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
