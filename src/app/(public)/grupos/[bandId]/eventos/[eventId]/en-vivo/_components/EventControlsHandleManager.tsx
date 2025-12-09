import { useState, useEffect } from 'react';
import { useStore } from '@nanostores/react';
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";
import { $eventAdminName } from '@stores/event';
import { eventAdminChange } from '@bands/[bandId]/eventos/[eventId]/en-vivo/_services/eventByIdService';
import { refreshAccessToken } from '@global/utils/jwtUtils';
import toast from 'react-hot-toast';
import { $user } from '@stores/users';
export const EventControlsHandleManager = ({
  params,
  checkAdminEvent,
  isEventManager,
  isSystemAdmin,
}: {
  params: { bandId: string; eventId: string };
  checkAdminEvent: boolean;
  isEventManager: boolean;
  isSystemAdmin: boolean;
}) => {
  const { mutate, error, status, data } = eventAdminChange({
    params,
  });
  const user = useStore($user);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (status === 'success') {
      $eventAdminName.set(data?.eventManager);

      // Obtener el usuario actual directamente del store para evitar loops
      const currentUser = $user.get();

      // Actualizar inmediatamente el store local del usuario
      const updatedUser = {
        ...currentUser,
        membersofBands: currentUser.membersofBands?.map((band) => {
          if (band.band.id === parseInt(params.bandId)) {
            return {
              ...band,
              isEventManager: true,
            };
          }
          return band;
        }),
      };

      console.log('[EventAdmin] Actualizando usuario local:', updatedUser);
      $user.set(updatedUser);

      // También actualizar localStorage para persistir el cambio
      import('@global/utils/handleLocalStorage').then(({ setLocalStorage }) => {
        setLocalStorage('user', updatedUser);
        console.log('[EventAdmin] Usuario guardado en localStorage');
      });

      // Disparar evento para actualizar la tabla de miembros de banda
      window.dispatchEvent(
        new CustomEvent('bandMemberRoleChanged', {
          detail: {
            bandId: parseInt(params.bandId),
            userId: currentUser.id,
            newEventManagerName: data?.eventManager || currentUser.name,
          },
        }),
      );

      toast.success('Ahora eres el administrador de este evento');

      // Opcional: renovar token en segundo plano para sincronizar con el backend
      refreshAccessToken()
        .then(() => {
          console.log('[EventAdmin] Token renovado en segundo plano');
        })
        .catch((error) => {
          console.warn(
            '[EventAdmin] Error renovando token (no crítico):',
            error,
          );
        });
    } else if (status === 'error') {
      toast.error('Error al cambiar el administrador de este evento');
      console.error('[EventAdmin] Error en cambio de administrador:', error);
    }
  }, [status, error, data, params.bandId]);

  const eventAdminName = useStore($eventAdminName);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const handleChangeEventAdmin = () => {
    mutate(null);
    onOpenChange();
  };

  // Don't render until mounted to avoid hydration mismatch
  if (!mounted) {
    return null;
  }

  return (
    <>
      <div className="mt-2 flex flex-col items-center gap-1 pl-2 md:flex-row">
        {user.isLoggedIn && checkAdminEvent && (
          <h2
            className={`${checkAdminEvent ? 'text-xs text-slate-400' : 'text-xs text-negro'}`}
          >
            {checkAdminEvent
              ? isSystemAdmin
                ? 'Tienes permisos de administrador del sistema'
                : 'Manejas los eventos'
              : eventAdminName
                ? `${eventAdminName} maneja los eventos`
                : 'Nadie maneja los eventos'}
          </h2>
        )}
        {user.isLoggedIn && isEventManager && (
          <h2 className="text-xs text-slate-400">
            Eres el event manager - Puedes cambiar canciones durante el evento,
            pero solo el admin de la banda puede modificar el evento
          </h2>
        )}
        {!checkAdminEvent && !isEventManager && user.isLoggedIn && (
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
                    <ModalFooter className="flex-wrap gap-2">
                      <Button
                        color="danger"
                        variant="light"
                        onPress={onClose}
                        className="whitespace-nowrap"
                      >
                        Cerrar
                      </Button>
                      <Button
                        color="primary"
                        onPress={handleChangeEventAdmin}
                        className="whitespace-nowrap"
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
    </>
  );
};
