'use client';

import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
} from '@nextui-org/react';
import { EventsProps } from '@bands/[bandId]/eventos/_interfaces/eventsInterface';
import { useEventTimeLeft } from '@global/hooks/useEventTimeLeft';
import { CalendarIcon, ArrowRightIcon } from '@global/icons';

interface AddSongToEventModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  upcomingEvents: EventsProps[];
  onSelectEvent: (eventId: number) => void;
  isLoading: boolean;
  songTitle: string;
}

// Componente interno para cada evento que usa el hook
const EventItem = ({
  event,
  onSelect,
  isLoading,
}: {
  event: EventsProps;
  onSelect: () => void;
  isLoading: boolean;
}) => {
  const { eventTimeLeft } = useEventTimeLeft(event.date);

  return (
    <button
      onClick={onSelect}
      disabled={isLoading}
      className="w-full rounded-lg border-2 border-slate-200 bg-white p-4 text-left transition-all hover:border-brand-purple-400 hover:bg-brand-purple-50 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h4 className="font-semibold text-slate-800">{event.title}</h4>
          <p className="mt-1 text-sm text-slate-600">
            {new Date(event.date).toLocaleDateString('es-ES', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
          <p className="mt-1 text-xs text-brand-purple-600">{eventTimeLeft}</p>
        </div>
        <div className="ml-4">
          <ArrowRightIcon className="h-6 w-6 text-brand-purple-600" />
        </div>
      </div>
    </button>
  );
};

export const AddSongToEventModal = ({
  isOpen,
  onOpenChange,
  upcomingEvents,
  onSelectEvent,
  isLoading,
  songTitle,
}: AddSongToEventModalProps) => {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="2xl">
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-2 bg-gradient-to-r from-brand-purple-50 to-brand-blue-50 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-brand-purple-500 to-brand-blue-500 shadow-md">
                  <CalendarIcon className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h2 className="bg-gradient-to-r from-brand-purple-600 to-brand-blue-600 bg-clip-text text-xl font-bold text-transparent">
                    Agregar a Evento
                  </h2>
                  <p className="text-xs font-normal text-slate-500">
                    Canción: {songTitle}
                  </p>
                </div>
              </div>
            </ModalHeader>
            <ModalBody className="py-6">
              {upcomingEvents.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-8">
                  <div className="mb-4">
                    <CalendarIcon className="h-16 w-16 text-slate-300" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-slate-700">
                    No hay eventos próximos
                  </h3>
                  <p className="text-center text-sm text-slate-500">
                    Crea un evento futuro para poder agregar canciones
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-slate-600">
                    Selecciona el evento al que deseas agregar esta canción:
                  </p>
                  <div className="max-h-96 space-y-2 overflow-y-auto">
                    {upcomingEvents.map((event) => (
                      <EventItem
                        key={event.id}
                        event={event}
                        onSelect={() => {
                          onSelectEvent(event.id);
                          onClose();
                        }}
                        isLoading={isLoading}
                      />
                    ))}
                  </div>
                </div>
              )}
            </ModalBody>
            <ModalFooter className="bg-slate-50">
              <Button variant="flat" onPress={onClose} className="font-medium">
                Cancelar
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};
