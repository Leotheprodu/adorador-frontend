import { formatDate, formatTime } from '@global/utils/dataFormat';
import Link from 'next/link';
import { EventsProps } from '../_interfaces/eventsInterface';
import {
  CalendarIcon,
  ClockIcon,
  CheckIcon,
  EditIcon,
  ArrowRightIcon,
} from '@global/icons';
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import { MenuButtonIcon } from '@global/icons/MenuButtonIcon';
import { useEditEvent } from '@bands/[bandId]/eventos/[eventId]/en-vivo/_hooks/useEditEvent';
import { FormAddNewEvent } from '@bands/[bandId]/eventos/_components/FormAddNewEvent';
import { useEventTimeLeft } from '@global/hooks/useEventTimeLeft';
import { useStore } from '@nanostores/react';
import { $user } from '@stores/users';
import { userRoles } from '@global/config/constants';

export const EventTableRow = ({
  event,
  bandId,
  refetch,
  rowClassName = '',
}: {
  event: EventsProps;
  bandId: string;
  refetch?: () => void;
  rowClassName?: string;
}) => {
  const user = useStore($user);
  const {
    form,
    setForm,
    isOpen,
    onOpenChange,
    handleChange,
    handleUpdateEvent,
    handleOpenModal,
    statusUpdateEvent,
  } = useEditEvent({
    bandId,
    eventId: event.id.toString(),
    refetch: refetch || (() => {}),
    eventData: {
      title: event.title,
      date: event.date,
    },
  });

  const currentDate = new Date();
  const isUpcoming = currentDate < new Date(event.date);
  const { eventTimeLeft } = useEventTimeLeft(event.date);

  // Verificar si el usuario es admin de la banda
  const isAdminEvent =
    user.isLoggedIn &&
    user.membersofBands.some(
      (band) => band.band.id === Number(bandId) && band.isAdmin,
    );
  const isSystemAdmin = user?.roles.includes(userRoles.admin.id);
  const hasPermission = isAdminEvent || isSystemAdmin;

  return (
    <>
      <tr
        className={`group ${rowClassName} ${isUpcoming ? 'bg-emerald-50/30 dark:bg-emerald-900/20' : ''}`}
      >
        {/* Estado - Visible en mobile y desktop */}
        <td className="px-3 py-3 text-slate-700 dark:text-slate-100 sm:px-4 sm:py-3.5">
          <div
            className={`inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-xs font-semibold sm:px-2.5 ${
              isUpcoming
                ? 'bg-emerald-100 text-emerald-700'
                : 'bg-slate-100 text-slate-600'
            }`}
          >
            {isUpcoming ? (
              <>
                <div className="h-1.5 w-1.5 rounded-full bg-emerald-500"></div>
                <span className="hidden sm:inline">Próximo</span>
                <span className="sm:hidden">
                  <CalendarIcon className="h-3 w-3" />
                </span>
              </>
            ) : (
              <>
                <CheckIcon className="h-3 w-3" />
                <span className="hidden sm:inline">Finalizado</span>
              </>
            )}
          </div>
        </td>

        {/* Título y fecha/hora en mobile */}
        <td className="px-3 py-3 text-slate-700 dark:text-slate-100 sm:px-4 sm:py-3.5">
          <Link
            href={`/grupos/${bandId}/eventos/${event.id}`}
            className="flex flex-col gap-1"
          >
            <span className="font-medium text-slate-900 transition-colors group-hover:text-brand-purple-600 dark:text-slate-100 dark:group-hover:text-brand-purple-300">
              {event.title}
            </span>
            {/* Info adicional solo en mobile */}
            <div className="flex flex-wrap gap-2 text-xs text-slate-600 sm:hidden">
              <span className="flex items-center gap-1">
                <CalendarIcon className="h-3 w-3" />
                {formatDate(event.date)}
              </span>
              <span className="flex items-center gap-1">
                <ClockIcon className="h-3 w-3" />
                {formatTime(event.date)}
              </span>
            </div>
            {/* Tiempo restante - Solo mobile y eventos futuros */}
            {isUpcoming && eventTimeLeft && (
              <div className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-brand-purple-600 sm:hidden">
                <ClockIcon className="h-3 w-3" />
                <span>{eventTimeLeft}</span>
              </div>
            )}
          </Link>
        </td>

        {/* Fecha - Solo Desktop */}
        <td className="hidden px-4 py-3.5 text-slate-600 dark:text-slate-100 sm:table-cell">
          <div className="flex items-center gap-2 text-sm">
            <CalendarIcon className="h-4 w-4 text-slate-400 dark:text-slate-300" />
            <span>{formatDate(event.date)}</span>
          </div>
        </td>

        {/* Hora - Solo Desktop */}
        <td className="hidden px-4 py-3.5 text-slate-600 dark:text-slate-100 sm:table-cell">
          <div className="flex items-center gap-2 text-sm">
            <ClockIcon className="h-4 w-4 text-slate-400 dark:text-slate-300" />
            <span>{formatTime(event.date)}</span>
          </div>
        </td>

        {/* Tiempo restante - Solo Desktop y eventos futuros */}
        <td className="hidden px-4 py-3.5 text-slate-600 dark:text-slate-100 sm:table-cell">
          {isUpcoming && eventTimeLeft && (
            <div className="inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-brand-purple-50 to-brand-blue-50 px-3 py-1.5 text-xs font-semibold text-brand-purple-700 ring-1 ring-brand-purple-200/50 dark:bg-gradient-to-r dark:from-brand-purple-900 dark:to-brand-blue-900 dark:text-slate-100">
              <ClockIcon className="h-3 w-3 dark:text-slate-100" />
              <span>{eventTimeLeft}</span>
            </div>
          )}
        </td>

        {/* Acciones */}
        <td className="px-3 py-3 text-right text-slate-700 dark:text-slate-100 sm:px-4 sm:py-3.5">
          <Dropdown>
            <DropdownTrigger>
              <Button
                isIconOnly
                variant="light"
                size="sm"
                className="min-w-0 rounded-lg p-1.5 transition-all hover:bg-brand-purple-100 active:scale-95"
                aria-label="Menú de opciones"
              >
                <MenuButtonIcon />
              </Button>
            </DropdownTrigger>
            <DropdownMenu
              classNames={{
                base: 'p-2 min-w-[220px]',
                list: 'gap-1',
              }}
            >
              <DropdownItem
                as={Link}
                href={`/grupos/${bandId}/eventos/${event.id}`}
                key="ver"
                startContent={
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-purple-100 to-brand-blue-100">
                    <ArrowRightIcon className="h-4 w-4 text-brand-purple-700" />
                  </div>
                }
                classNames={{
                  base: 'rounded-lg px-3 py-2.5 data-[hover=true]:bg-gradient-to-r data-[hover=true]:from-brand-purple-50 data-[hover=true]:to-brand-blue-50',
                  title: 'text-sm font-medium text-slate-700',
                }}
              >
                Ir a evento
              </DropdownItem>
              <DropdownItem
                key="editar"
                onClick={hasPermission ? handleOpenModal : undefined}
                isDisabled={!hasPermission}
                description={
                  !hasPermission
                    ? 'Solo los administradores de la banda pueden editar eventos'
                    : undefined
                }
                startContent={
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-blue-100 to-indigo-100">
                    <EditIcon className="h-4 w-4 text-blue-700" />
                  </div>
                }
                classNames={{
                  base: 'rounded-lg px-3 py-2.5 data-[hover=true]:bg-gradient-to-r data-[hover=true]:from-blue-50 data-[hover=true]:to-indigo-50',
                  title: 'text-sm font-medium text-slate-700',
                  description: 'text-xs text-slate-500',
                }}
              >
                Editar evento
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </td>
      </tr>

      {/* Modal de edición */}
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
