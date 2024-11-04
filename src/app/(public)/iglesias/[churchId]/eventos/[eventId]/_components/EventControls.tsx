import { EventSongsProps } from '@iglesias/[churchId]/eventos/_interfaces/eventsInterface';
import { CheckUserStatus } from '@global/utils/checkUserStatus';
import { EventControlsButtons } from '@iglesias/[churchId]/eventos/[eventId]/_components/EventControlsButtons';
import { EventControlsSongsList } from '@iglesias/[churchId]/eventos/[eventId]/_components/EventControlsSongsList';
import { EventControlsLyricsSelect } from '@iglesias/[churchId]/eventos/[eventId]/_components/EventControlsLyricsSelect';
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
import { eventAdminChange } from '@iglesias/[churchId]/eventos/[eventId]/_services/eventByIdService';
import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useStore } from '@nanostores/react';
import { $eventAdminName } from '@stores/event';
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
  const { mutate, error, status, data } = eventAdminChange({
    churchId,
    eventId,
  });

  const eventAdminName = useStore($eventAdminName);

  useEffect(() => {
    refetch();
  }, [refetch, eventAdminName]);

  useEffect(() => {
    if (status === 'success') {
      $eventAdminName.set(data?.eventManager);
      toast.success('Ahora eres el administrador de este evento');
    } else if (status === 'error') {
      toast.error('Error al cambiar el administrador de este evento');
    }
  }, [refetch, status, error, data]);
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
    </div>
  );
};
