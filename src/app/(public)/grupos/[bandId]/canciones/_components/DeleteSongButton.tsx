import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@heroui/react';
import { useDeleteSong } from '@bands/[bandId]/canciones/_hooks/useDeleteSong';
import { TrashIcon } from '@global/icons';

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
      <Button
        size="sm"
        variant="flat"
        color="danger"
        onPress={onOpen}
        startContent={<TrashIcon className="h-4 w-4" />}
      >
        Eliminar
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1 dark:bg-gray-900">
                Confirmar eliminación
              </ModalHeader>
              <ModalBody className="dark:bg-gray-950">
                <p>
                  ¿Estás seguro de que deseas eliminar la canción{' '}
                  <strong>&quot;{songTitle}&quot;</strong>?
                </p>
                <p className="text-sm text-danger">
                  Esta acción no se puede deshacer.
                </p>
              </ModalBody>
              <ModalFooter className="dark:bg-gray-900">
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
