import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from '@nextui-org/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { addEventsToBandService } from '@bands/[bandId]/eventos/_services/eventsOfBandService';
import { FormAddNewEvent } from '@bands/[bandId]/eventos/_components/FormAddNewEvent';
import { handleOnChange } from '@global/utils/formUtils';

export const AddEventButton = ({ bandId }: { bandId: string }) => {
  const tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
  const formInit = {
    title: '',
    date: tomorrow.toISOString().slice(0, 16),
  };
  const [form, setForm] = useState(formInit);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const router = useRouter();
  const {
    data: newEvent,
    mutate: mutateAddEventToBand,
    status: statusAddEventToBand,
  } = addEventsToBandService({ bandId });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleOnChange(setForm, e);
  };

  const handleAddEvent = () => {
    if (form.title === '') {
      toast.error('El título del evento es obligatorio');
      return;
    }
    if (!form.date) {
      toast.error('La fecha del evento es obligatoria');
      return;
    }
    mutateAddEventToBand({
      title: form.title,
      date: new Date(form.date),
    });
  };

  useEffect(() => {
    if (statusAddEventToBand === 'success') {
      router.push(`/grupos/${bandId}/eventos/${newEvent?.id}`);
    }
    if (statusAddEventToBand === 'error') {
      toast.error('Error al crear el evento');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusAddEventToBand]);

  return (
    <>
      <Button
        onClick={() => {
          onOpen();
        }}
        className="ml-4"
        color="primary"
      >
        + Crear nuevo evento
      </Button>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                Formulario de nuevo evento
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
                  color="danger"
                  variant="light"
                  onPress={() => {
                    setForm(formInit);
                  }}
                >
                  Limpiar
                </Button>
                <Button
                  isLoading={statusAddEventToBand === 'pending'}
                  disabled={statusAddEventToBand === 'success'}
                  color="primary"
                  onPress={handleAddEvent}
                >
                  Crear
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
};
