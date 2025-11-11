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
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { addEventsToBandService } from '@bands/[bandId]/eventos/_services/eventsOfBandService';
import { FormAddNewEvent } from '@bands/[bandId]/eventos/_components/FormAddNewEvent';
import { handleOnChange } from '@global/utils/formUtils';
import { PlusIcon, CalendarIcon } from '@global/icons';
import { useQueryClient } from '@tanstack/react-query';
import { useStore } from '@nanostores/react';
import { $user } from '@stores/users';
import { userRoles } from '@global/config/constants';

export const AddEventButton = ({ bandId }: { bandId: string }) => {
  const queryClient = useQueryClient();
  const user = useStore($user);
  const tomorrow = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
  const formInit = {
    title: '',
    date: tomorrow.toISOString().slice(0, 16),
  };
  const [form, setForm] = useState(formInit);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const { mutate: mutateAddEventToBand, status: statusAddEventToBand } =
    addEventsToBandService({ bandId });

  // Verificar si el usuario es admin de la banda
  const isAdminBand =
    user.isLoggedIn &&
    user.membersofBands.some(
      (band) => band.band.id === Number(bandId) && band.isAdmin,
    );
  const isSystemAdmin = user?.roles.includes(userRoles.admin.id);
  const hasPermission = isAdminBand || isSystemAdmin;

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
      toast.success('Evento creado correctamente');
      // Invalidar queries para que se actualicen las listas de eventos
      queryClient.invalidateQueries({ queryKey: ['EventsOfBand', bandId] });
      queryClient.invalidateQueries({ queryKey: ['BandById', bandId] });
      // Invalidar la lista de grupos del usuario (donde se muestran los eventos en las cards)
      queryClient.invalidateQueries({ queryKey: ['BandsOfUser'] });
      // Cerrar el modal y resetear el formulario
      onOpenChange();
      setForm(formInit);
    }
    if (statusAddEventToBand === 'error') {
      toast.error('Error al crear el evento');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusAddEventToBand]);

  return (
    <>
      <Tooltip
        content={
          hasPermission
            ? 'Crear evento'
            : 'Solo los administradores de la banda pueden crear eventos'
        }
      >
        <div className="inline-block">
          <Button
            onClick={hasPermission ? onOpen : undefined}
            size="sm"
            isDisabled={!hasPermission}
            className="border-2 border-slate-200 bg-white font-semibold text-slate-700 transition-all hover:border-brand-purple-300 hover:bg-brand-purple-50"
          >
            <PlusIcon className="h-5 w-5" /> Crear evento
          </Button>
        </div>
      </Tooltip>
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-2 bg-gradient-to-r from-brand-pink-50 to-brand-purple-50 pb-4">
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
              <ModalFooter className="gap-2 bg-slate-50">
                <Button
                  variant="flat"
                  onPress={onClose}
                  className="font-medium"
                >
                  Cancelar
                </Button>
                <Button
                  variant="flat"
                  color="warning"
                  onPress={() => {
                    setForm(formInit);
                  }}
                  className="font-medium"
                >
                  Limpiar
                </Button>
                <Button
                  isLoading={statusAddEventToBand === 'pending'}
                  disabled={statusAddEventToBand === 'success'}
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
    </>
  );
};
