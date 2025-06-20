import { useStore } from '@nanostores/react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from '@nextui-org/react';
import { $eventAdminName } from '@stores/event';
import { eventAdminChange } from '@bands/[bandId]/eventos/[eventId]/_services/eventByIdService';
import toast from 'react-hot-toast';
import { useEffect } from 'react';
import { $user } from '@stores/users';
export const EventControlsHandleManager = ({
  params,
  checkAdminEvent,
}: {
  params: { bandId: string; eventId: string };
  checkAdminEvent: boolean;
}) => {
  const { mutate, error, status, data } = eventAdminChange({
    params,
  });
  const user = useStore($user);
  useEffect(() => {
    if (status === 'success') {
      $eventAdminName.set(data?.eventManager);
      toast.success('Ahora eres el administrador de este evento');
      $user.set({
        ...user,
        membersofBands: user.membersofBands?.map((band) => {
          if (band.band.id === parseInt(params.bandId)) {
            return {
              ...band,
              isEventManager: true,
            };
          }
          return band;
        }),
      });
    } else if (status === 'error') {
      toast.error('Error al cambiar el administrador de este evento');
    }
  }, [status, error, data]);

  const eventAdminName = useStore($eventAdminName);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const handleChangeEventAdmin = () => {
    mutate(null);
    onOpenChange();
  };

  return (
    <>
      <div className="mt-2 flex flex-col items-center gap-1 pl-2 md:flex-row">
        {user.isLoggedIn && checkAdminEvent && (
          <h2
            className={`${checkAdminEvent ? 'text-xs text-slate-400' : 'text-xs text-negro'}`}
          >
            {checkAdminEvent
              ? 'Manejas los eventos'
              : eventAdminName
                ? `${eventAdminName} maneja los eventos`
                : 'Nadie maneja los eventos'}
          </h2>
        )}
        {!checkAdminEvent && user.isLoggedIn && (
          <div className="flex items-center justify-center gap-1 text-xs">
            <p>¿Quieres Manejar los eventos de tu grupo?</p>
            <Button onPress={onOpen} variant="light" color="danger" size="sm">
              Aceptar
            </Button>
            <Modal
              isOpen={isOpen}
              onOpenChange={onOpenChange}
              isDismissable={false}
              isKeyboardDismissDisabled={true}
            >
              <ModalContent>
                {(onClose) => (
                  <>
                    <ModalHeader className="flex flex-col">
                      Cambiar de Manejador de eventos
                    </ModalHeader>
                    <ModalBody>
                      <div className="flex flex-col items-center justify-center gap-12">
                        <h4 className="text-center font-semibold">
                          ¿Estas seguro que quieres ser el que maneje los
                          eventos?
                        </h4>
                        <p>
                          Ten en cuenta que solo puede haber un manejador de los
                          eventos activo en cada grupo de alabanza, si lo
                          cambias, el manejador actual no podrá serguir
                          manejando eventos.
                        </p>
                        <p className="uppercase text-danger">
                          {' '}
                          Ten cuidado si en este momentos están en vivo
                        </p>
                      </div>
                    </ModalBody>
                    <ModalFooter>
                      <Button color="danger" variant="light" onPress={onClose}>
                        Cerrar
                      </Button>
                      <Button color="primary" onPress={handleChangeEventAdmin}>
                        Aceptar
                      </Button>
                    </ModalFooter>
                  </>
                )}
              </ModalContent>
            </Modal>
          </div>
        )}
      </div>
    </>
  );
};
