import { EventSongsProps } from '../../_interfaces/eventsInterface';
import { CheckUserStatus } from '@global/utils/checkUserStatus';
import { EventControlsButtons } from './EventControlsButtons';
import { EventControlsSongsList } from './EventControlsSongsList';
import { EventControlsLyricsSelect } from './EventControlsLyricsSelect';
import { churchRoles } from '@global/config/constants';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from '@nextui-org/react';
import { eventAdminChange } from '../_services/eventByIdService';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
export const EventControls = ({
  songs,
  churchId,
  eventId,
  refetch,
}: {
  songs: EventSongsProps[];
  churchId: string;
  eventId: string;
  refetch: () => void;
}) => {
  const { mutate, error, status } = eventAdminChange({
    churchId,
    eventId,
  });

  useEffect(() => {
    if (status === 'success') {
      refetch();
      toast.success('Ahora eres el administrador de este evento');
    } else if (status === 'error') {
      toast.error('Error al cambiar el administrador de este evento');
    }
  }, [refetch, status, error]);
  const checkUserMembership = CheckUserStatus({
    isLoggedIn: true,
    checkChurchId: parseInt(churchId),
    churchRoles: [
      churchRoles.worshipLeader.id,
      churchRoles.musician.id,
      churchRoles.eventWebManager.id,
    ],
  });
  const checkAdminEvent = CheckUserStatus({
    isLoggedIn: true,
    checkAdminEvent: true,
  });
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const handleChangeEventAdmin = () => {
    mutate(null);
    onOpenChange();
  };

  return (
    <div>
      {checkUserMembership && (
        <div className="mt-2 flex flex-col items-center gap-1 pl-2 md:flex-row">
          <h2
            className={`${checkAdminEvent ? 'text-sm text-slate-400' : 'text-base text-negro'}`}
          >
            {checkAdminEvent
              ? 'Administras este evento'
              : 'No administras este evento'}
          </h2>
          {!checkAdminEvent && (
            <div className="flex items-center justify-center gap-1">
              <p>¿Quieres administrar este evento?</p>
              <Button onPress={onOpen} variant="bordered" color="danger">
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
                      <ModalHeader className="flex flex-col gap-1">
                        Cambiar de administrador de este evento
                      </ModalHeader>
                      <ModalBody>
                        <div className="flex flex-col items-center justify-center gap-3">
                          <h4 className="text-center font-semibold">
                            ¿Estas seguro que quieres ser el administrador?
                          </h4>
                          <p>
                            Ten en cuenta que solo puede haber un administrador
                            de evento, si lo cambias, el administrador actual
                            perderá los permisos.
                          </p>
                          <p className="font-bold uppercase text-danger">
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
                          Close
                        </Button>
                        <Button
                          color="primary"
                          onPress={handleChangeEventAdmin}
                        >
                          Action
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
      <section
        className={`mt-5 grid w-full items-center justify-center gap-3 bg-slate-50 p-4 ${checkAdminEvent ? 'grid-cols-2 grid-rows-3 md:grid-cols-3 md:grid-rows-1' : 'grid-cols-1 grid-rows-1'}`}
      >
        {checkAdminEvent && <EventControlsSongsList songs={songs} />}
        {checkAdminEvent && <EventControlsLyricsSelect />}
        <EventControlsButtons
          churchId={parseInt(churchId)}
          isEventAdmin={checkAdminEvent}
        />
      </section>
    </div>
  );
};
