import { formatDate, formatTime } from '@global/utils/dataFormat';
import { useEffect, useState } from 'react';
import { CheckUserStatus } from '@global/utils/checkUserStatus';
import {
  GuitarIcon,
  EditIcon,
  TrashIcon,
  CalendarIcon,
  MusicNoteIcon,
  MicrophoneIcon,
  UsersIcon,
  ClockIcon,
  FolderMusicIcon,
} from '@global/icons';
import { BandsWithMembersCount } from '@bands/_interfaces/bandsInterface';
import { PrimaryButton, IconButton } from '@global/components/buttons';
import { EditBandModal } from './EditBandModal';
import { DeleteBandModal } from './DeleteBandModal';
import { useDisclosure } from '@nextui-org/react';
import { useEventTimeLeft } from '@global/hooks/useEventTimeLeft';

export const BandCard = ({ band }: { band: BandsWithMembersCount }) => {
  const [currentEventIndex, setCurrentEventIndex] = useState(0);
  const events =
    band.events?.sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime(),
    ) ?? [];

  //si el evento actual es igual a la fecha actual, el valor de la variable isCurrentEvent es verdadero
  const [isCurrentEvent, setIsCurrentEvent] = useState(false);

  // Hook para calcular tiempo restante del evento actual
  const { eventTimeLeft } = useEventTimeLeft(events[currentEventIndex]?.date);

  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure();

  useEffect(() => {
    setIsCurrentEvent(
      new Date(events[currentEventIndex]?.date).setHours(0, 0, 0, 0) ===
        new Date().setHours(0, 0, 0, 0),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentEventIndex]);

  const isUserAuthorized = CheckUserStatus({
    isLoggedIn: true,
    checkBandId: band.id,
    checkBandAdmin: true,
  });

  return (
    <div className="group relative w-full max-w-sm overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-slate-200/50 transition-all duration-300 hover:shadow-2xl hover:ring-slate-300/50">
      {/* Header con patrón decorativo */}
      <div className="relative overflow-hidden bg-brand-purple-600 px-6 py-8">
        {/* Patrón de fondo con GuitarIcon */}
        <div className="absolute inset-0 opacity-10">
          <GuitarIcon className="absolute -right-16 -top-8 h-64 w-64 rotate-12 text-white" />
          <div className="absolute left-0 top-0 h-32 w-32 rounded-full bg-white blur-3xl"></div>
          <div className="absolute bottom-0 right-0 h-32 w-32 rounded-full bg-white blur-3xl"></div>
        </div>

        {/* Contenido del header */}
        <div className="relative z-10">
          <div className="mb-2 flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
              <GuitarIcon className="h-5 w-5 text-white" />
            </div>
            <h2 className="flex-1 text-2xl font-bold text-white">
              {band.name}
            </h2>
            {/* Botones de administración */}
            {isUserAuthorized && (
              <div className="flex gap-2">
                <IconButton
                  onClick={onEditOpen}
                  variant="circular"
                  size="sm"
                  ariaLabel="Editar grupo"
                  className="border border-white/30 bg-white/10 text-white shadow-lg backdrop-blur-md transition-all hover:scale-105 hover:border-white/50 hover:bg-white/20 hover:shadow-xl"
                >
                  <EditIcon className="h-4 w-4" />
                </IconButton>
                <IconButton
                  onClick={onDeleteOpen}
                  variant="circular"
                  size="sm"
                  ariaLabel="Eliminar grupo"
                  className="border border-white/30 bg-white/10 text-white shadow-lg backdrop-blur-md transition-all hover:scale-105 hover:border-red-300/50 hover:bg-red-500/30 hover:shadow-xl"
                >
                  <TrashIcon className="h-4 w-4" />
                </IconButton>
              </div>
            )}
          </div>

          {/* Stats con badges modernos */}
          <div className="mt-4 flex flex-wrap gap-2">
            <div className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5 backdrop-blur-sm">
              <CalendarIcon className="h-3 w-3 text-white" />
              <span className="text-xs font-semibold text-white">
                {band._count.events} eventos
              </span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5 backdrop-blur-sm">
              <MusicNoteIcon className="h-3 w-3 text-white" />
              <span className="text-xs font-semibold text-white">
                {band._count.songs} canciones
              </span>
            </div>
            <div className="flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1.5 backdrop-blur-sm">
              <UsersIcon className="h-3 w-3 text-white" />
              <span className="text-xs font-semibold text-white">
                {band._count.members} miembros
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Body - Próximos eventos */}
      {events.length > 0 && (
        <div className="border-b border-slate-100 px-6 py-5">
          <div className="mb-3 flex items-center justify-between">
            <h3 className="flex items-center gap-2 text-sm font-bold text-slate-700">
              <CalendarIcon className="h-4 w-4 text-brand-purple-600" />
              Próximos Eventos
            </h3>
            <span className="text-xs text-slate-500">
              {currentEventIndex + 1} / {events.length}
            </span>
          </div>

          <div className="flex items-center gap-3">
            {/* Botón anterior */}
            <IconButton
              onClick={() =>
                setCurrentEventIndex((prevIndex) => Math.max(prevIndex - 1, 0))
              }
              disabled={currentEventIndex === 0}
              variant="circular"
              size="md"
              ariaLabel="Evento anterior"
            >
              <span className="font-bold">‹</span>
            </IconButton>

            {/* Contenido del evento */}
            <div className="flex-1 rounded-xl bg-gradient-to-br from-slate-50 to-slate-100 p-4 shadow-sm ring-1 ring-slate-200/50">
              <h4 className="mb-2 text-center font-semibold text-slate-800">
                {events[currentEventIndex].title}
              </h4>
              <div className="space-y-1 text-center text-xs text-slate-600">
                <p className="flex items-center justify-center gap-1 font-medium">
                  <CalendarIcon className="h-3 w-3" />
                  {formatDate(events[currentEventIndex].date, true)}
                </p>
                <p className="flex items-center justify-center gap-1">
                  <ClockIcon className="h-3 w-3" />
                  {formatTime(events[currentEventIndex].date)}
                </p>
              </div>
              {isCurrentEvent && (
                <div className="mt-2 flex items-center justify-center gap-1">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500"></span>
                  </span>
                  <span className="text-xs font-semibold text-green-600">
                    Hoy
                  </span>
                </div>
              )}
              {/* Tiempo restante - Solo para eventos futuros */}
              {eventTimeLeft &&
                new Date(events[currentEventIndex].date) > new Date() && (
                  <div className="mt-2 rounded-lg bg-gradient-to-r from-brand-purple-50 to-brand-blue-50 px-3 py-2 ring-1 ring-brand-purple-200/50">
                    <p className="text-center text-xs font-semibold text-brand-purple-700">
                      ⏱️ {eventTimeLeft}
                    </p>
                  </div>
                )}
            </div>

            {/* Botón siguiente */}
            <IconButton
              onClick={() =>
                setCurrentEventIndex((prevIndex) =>
                  Math.min(prevIndex + 1, events.length - 1),
                )
              }
              disabled={currentEventIndex === events.length - 1}
              variant="circular"
              size="md"
              ariaLabel="Evento siguiente"
            >
              <span className="font-bold">›</span>
            </IconButton>
          </div>
        </div>
      )}

      {/* Footer - Botones de acción */}
      <div className="px-6 py-5">
        <div className="flex flex-col gap-3">
          {events.length > 0 && (isCurrentEvent || isUserAuthorized) && (
            <PrimaryButton
              href={`/grupos/${band.id}/eventos/${events[currentEventIndex].id}`}
              startContent={<MicrophoneIcon className="h-4 w-4" />}
              className="w-full bg-gradient-to-r from-brand-pink-500 to-brand-purple-600"
            >
              Ver Evento
            </PrimaryButton>
          )}

          <PrimaryButton
            href={`/grupos/${band.id}`}
            startContent={<FolderMusicIcon className="h-5 w-5" />}
            className="w-full"
          >
            Administrar Grupo
          </PrimaryButton>
        </div>
      </div>

      {/* Efecto de hover en toda la card */}
      <div className="pointer-events-none absolute inset-0 rounded-3xl ring-2 ring-transparent transition-all duration-300 group-hover:ring-brand-purple-200"></div>

      {/* Modales */}
      <EditBandModal
        isOpen={isEditOpen}
        onClose={onEditClose}
        bandId={band.id}
        currentName={band.name}
      />
      <DeleteBandModal
        isOpen={isDeleteOpen}
        onClose={onDeleteClose}
        bandId={band.id}
        bandName={band.name}
      />
    </div>
  );
};
