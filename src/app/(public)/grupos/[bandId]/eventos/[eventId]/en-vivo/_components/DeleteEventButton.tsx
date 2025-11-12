import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tooltip,
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
  isAdminEvent,
}: {
  bandId: string;
  eventId: string;
  isAdminEvent?: boolean;
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

  // Determinar si el botón debe estar deshabilitado
  const hasPermission = isAdminEvent !== undefined ? isAdminEvent : true;
  const canDeleteWithSongs = event.songs.length > 0 && !isAdmin;

  const tooltipContent = !hasPermission
    ? 'Solo los administradores de la banda pueden eliminar eventos'
    : canDeleteWithSongs
      ? 'No se pueden eliminar eventos con canciones'
      : 'Eliminar evento';

  return (
    <>
      <Tooltip content={tooltipContent}>
        <div className="inline-block">
          <Button
            onClick={onOpen}
            className="ml-4"
            color="danger"
            variant="light"
            size="md"
            isIconOnly
            isDisabled={!hasPermission || canDeleteWithSongs}
          >
            <DeleteMusicIcon />
          </Button>
        </div>
      </Tooltip>
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
              <ModalFooter className="flex-wrap gap-2">
                <Button
                  color="default"
                  variant="light"
                  onPress={onClose}
                  className="whitespace-nowrap"
                >
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
                  className="whitespace-nowrap"
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
