import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from '@heroui/react';
import { CalendarIcon } from '@global/icons';
import { FormAddNewEvent } from '@bands/[bandId]/eventos/_components/FormAddNewEvent';

interface AddEventModalProps {
  isOpen: boolean;
  onOpenChange: () => void;
  onClose: () => void;
  form: { title: string; date: string; eventMode: 'live' | 'videolyrics' };
  setForm: (form: {
    title: string;
    date: string;
    eventMode: 'live' | 'videolyrics';
  }) => void;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleAddEvent: () => void;
  handleClear: () => void;
  isSubmitting: boolean;
  isSuccess: boolean;
}

export const AddEventModal = ({
  isOpen,
  onOpenChange,
  onClose,
  form,
  setForm,
  handleChange,
  handleAddEvent,
  handleClear,
  isSubmitting,
  isSuccess,
}: AddEventModalProps) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
      <ModalContent>
        {() => (
          <>
            <ModalHeader className="flex flex-col gap-2 bg-brand-purple-50 pb-4 dark:bg-gray-900">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-brand-pink-500 to-brand-purple-500 shadow-md">
                  <CalendarIcon className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h2 className="bg-gradient-to-r from-brand-pink-500 to-brand-purple-600 bg-clip-text text-xl font-bold text-transparent">
                    Nuevo Evento
                  </h2>
                  <p className="text-xs font-normal text-slate-500">
                    Programa un nuevo evento de adoración
                  </p>
                </div>
              </div>
            </ModalHeader>
            <ModalBody className="py-6">
              <FormAddNewEvent
                form={form}
                setForm={setForm}
                handleChange={handleChange}
              />
            </ModalBody>
            <ModalFooter className="gap-2 bg-slate-50 dark:bg-gray-900">
              <Button variant="flat" onPress={onClose} className="font-medium">
                Cancelar
              </Button>
              <Button
                variant="flat"
                color="warning"
                onPress={handleClear}
                className="font-medium"
              >
                Limpiar
              </Button>
              <Button
                isLoading={isSubmitting}
                disabled={isSuccess}
                onPress={handleAddEvent}
                className="bg-gradient-to-r from-brand-pink-500 to-brand-purple-600 font-semibold text-white shadow-md transition-all duration-200 hover:scale-105 hover:shadow-lg"
              >
                Crear Evento
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
