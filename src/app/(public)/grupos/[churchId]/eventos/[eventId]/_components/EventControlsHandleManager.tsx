import { churchRoles } from '@global/config/constants';
import { CheckUserStatus } from '@global/utils/checkUserStatus';
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
import { eventAdminChange } from '@app/(public)/grupos/[churchId]/eventos/[eventId]/_services/eventByIdService';
import toast from 'react-hot-toast';
import { useEffect } from 'react';
export const EventControlsHandleManager = ({
  params,
  checkAdminEvent,
}: {
  params: { churchId: string; eventId: string };
  checkAdminEvent: boolean;
}) => {
  const { mutate, error, status, data } = eventAdminChange({
    params,
  });
  const { churchId } = params;
  useEffect(() => {
    if (status === 'success') {
      $eventAdminName.set(data?.eventManager);
      toast.success('Ahora eres el administrador de este evento');
    } else if (status === 'error') {
      toast.error('Error al cambiar el administrador de este evento');
    }
  }, [status, error, data]);

  const eventAdminName = useStore($eventAdminName);
  const checkUserMembership = CheckUserStatus({
    isLoggedIn: true,
    checkChurchId: parseInt(churchId),
    churchRoles: [
      churchRoles.worshipLeader.id,
      churchRoles.musician.id,
      churchRoles.eventWebManager.id,
    ],
  });
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const handleChangeEventAdmin = () => {
    mutate(null);
    onOpenChange();
  };

  return (
    <>
      {checkUserMembership && (
        <div className="mt-2 flex flex-col items-center gap-1 pl-2 md:flex-row">
          <h2
            className={`${checkAdminEvent ? 'text-xs text-slate-400' : 'text-xs text-negro'}`}
          >
            {checkAdminEvent
              ? 'Manejas este evento'
              : `${eventAdminName} maneja el evento`}
          </h2>
          {!checkAdminEvent && (
            <div className="flex items-center justify-center gap-1 text-xs">
              <p>¿Quieres Manejar este evento?</p>
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
                        Cambiar de Manejador de este evento
                      </ModalHeader>
                      <ModalBody>
                        <div className="flex flex-col items-center justify-center gap-12">
                          <h4 className="text-center font-semibold">
                            ¿Estas seguro que quieres ser el manejador?
                          </h4>
                          <p>
                            Ten en cuenta que solo puede haber un manejador en
                            este evento, si lo cambias, el manejador actual no
                            podrá serguir manejando el evento.
                          </p>
                          <p className="uppercase text-danger">
                            {' '}
                            Ten cuidado si en este momentos están en vivo
                          </p>
                        </div>
                      </ModalBody>
                      <ModalFooter>
                        <Button
                          color="danger"
                          variant="light"
                          onPress={onClose}
                        >
                          Cerrar
                        </Button>
                        <Button
                          color="primary"
                          onPress={handleChangeEventAdmin}
                        >
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
      )}
    </>
  );
};
