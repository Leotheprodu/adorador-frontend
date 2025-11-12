import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Tooltip,
} from '@nextui-org/react';
import { FormAddNewEvent } from '@bands/[bandId]/eventos/_components/FormAddNewEvent';
import { EditIcon } from '@global/icons/EditIcon';
import { useEditEvent } from '@bands/[bandId]/eventos/[eventId]/en-vivo/_hooks/useEditEvent';
import { useStore } from '@nanostores/react';
import { $user } from '@stores/users';
import { userRoles } from '@global/config/constants';

export const EditEventButton = ({
  bandId,
  eventId,
  refetch,
  isAdminEvent,
}: {
  bandId: string;
  eventId: string;
  refetch: () => void;
  isAdminEvent?: boolean;
}) => {
  const {
    form,
    setForm,
    isOpen,
    onOpenChange,
    handleChange,
    handleUpdateEvent,
    handleOpenModal,
    statusUpdateEvent,
    eventHasPassed,
  } = useEditEvent({ bandId, eventId, refetch });

  const user = useStore($user);
  const isAdmin = user?.roles.includes(userRoles.admin.id);

  // Determinar si el botón debe estar deshabilitado
  const isDisabled = eventHasPassed && !isAdmin;
  const hasPermission = isAdminEvent !== undefined ? isAdminEvent : true;

  const tooltipContent = !hasPermission
    ? 'Solo los administradores de la banda pueden editar eventos'
    : isDisabled
      ? 'No se pueden editar eventos que ya pasaron'
      : 'Editar evento';

  return (
    <>
      <Tooltip content={tooltipContent}>
        <div className="inline-block">
          <Button
            onClick={handleOpenModal}
            className="ml-4"
            color="primary"
            variant="light"
            size="md"
            isIconOnly
            isDisabled={!hasPermission || isDisabled}
          >
            <EditIcon />
          </Button>
        </div>
      </Tooltip>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Editar evento
              </ModalHeader>
              <ModalBody>
                <FormAddNewEvent
                  form={form}
                  setForm={setForm}
                  handleChange={handleChange}
                />
              </ModalBody>
              <ModalFooter className="flex-wrap gap-2">
                <Button
                  color="warning"
                  variant="light"
                  onPress={onClose}
                  className="whitespace-nowrap"
                >
                  Cerrar
                </Button>
                <Button
                  isLoading={statusUpdateEvent === 'pending'}
                  disabled={statusUpdateEvent === 'success'}
                  color="primary"
                  onPress={handleUpdateEvent}
                  className="whitespace-nowrap"
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
