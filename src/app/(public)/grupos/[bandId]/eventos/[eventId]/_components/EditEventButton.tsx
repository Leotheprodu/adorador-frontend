import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@nextui-org/react';
import { FormAddNewEvent } from '@bands/[bandId]/eventos/_components/FormAddNewEvent';
import { EditIcon } from '@global/icons/EditIcon';
import { useEditEvent } from '@bands/[bandId]/eventos/[eventId]/_hooks/useEditEvent';

export const EditEventButton = ({
  bandId,
  eventId,
  refetch,
}: {
  bandId: string;
  eventId: string;
  refetch: () => void;
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

  // Si el evento ya pasó, no mostrar el botón
  if (eventHasPassed) {
    return null;
  }

  return (
    <>
      <Button
        onClick={handleOpenModal}
        className="ml-4"
        color="primary"
        variant="light"
        size="md"
        isIconOnly
      >
        <EditIcon />
      </Button>
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
              <ModalFooter>
                <Button color="warning" variant="light" onPress={onClose}>
                  Cerrar
                </Button>
                <Button
                  isLoading={statusUpdateEvent === 'pending'}
                  disabled={statusUpdateEvent === 'success'}
                  color="primary"
                  onPress={handleUpdateEvent}
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
