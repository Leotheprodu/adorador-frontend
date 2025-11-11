import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/react';
import { DeleteMusicIcon } from '@global/icons/DeleteMusicIcon';
import { useDeleteEvent } from '@bands/[bandId]/eventos/[eventId]/en-vivo/_hooks/useDeleteEvent';
import { useStore } from '@nanostores/react';
import { $event } from '@stores/event';
import { $user } from '@stores/users';
import { userRoles } from '@global/config/constants';

export const DeleteEventButton = ({
  bandId,
  eventId,
}: {
  bandId: string;
  eventId: string;
}) => {
  const event = useStore($event);
  const user = useStore($user);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { handleDeleteEvent, statusDeleteEvent } = useDeleteEvent({
    bandId,
    eventId,
    redirectOnDelete: true,
  });

  const isAdmin = user?.roles.includes(userRoles.admin.id);

  // Solo mostrar el botón si el evento no tiene canciones
  // Los administradores pueden eliminar eventos incluso con canciones
  if (event.songs.length > 0 && !isAdmin) {
    return null;
  }

  return (
    <>
      <Button
        onClick={onOpen}
        className="ml-4"
        color="danger"
        variant="light"
        size="md"
        isIconOnly
      >
        <DeleteMusicIcon />
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Eliminar evento
              </ModalHeader>
              <ModalBody>
                <p>
                  ¿Estás seguro de que deseas eliminar el evento &ldquo;
                  {event.title}&rdquo;?
                </p>
                <p className="text-sm text-gray-500">
                  Esta acción no se puede deshacer.
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="light" onPress={onClose}>
                  Cancelar
                </Button>
                <Button
                  isLoading={statusDeleteEvent === 'pending'}
                  disabled={statusDeleteEvent === 'success'}
                  color="danger"
                  onPress={() => {
                    handleDeleteEvent();
                    onClose();
                  }}
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
