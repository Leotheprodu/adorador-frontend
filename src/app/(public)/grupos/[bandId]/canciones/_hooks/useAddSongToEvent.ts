import { useMemo, useState, useEffect } from 'react';
import { useDisclosure } from '@nextui-org/react';
import { getEventsOfBand } from '@bands/[bandId]/eventos/_services/eventsOfBandService';
import { getEventsById } from '@bands/[bandId]/eventos/[eventId]/_services/eventByIdService';
import { addSongsToEventService } from '@bands/[bandId]/eventos/[eventId]/_components/addSongToEvent/services/AddSongsToEventService';
import { useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';

export const useAddSongToEvent = ({
  bandId,
  songId,
  songTitle,
}: {
  bandId: string;
  songId: number;
  songTitle: string;
}) => {
  const queryClient = useQueryClient();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [lastError, setLastError] = useState<string>('');

  // Obtener todos los eventos de la banda
  const { data: events } = getEventsOfBand({ bandId });

  // Obtener el evento seleccionado para conocer cuántas canciones tiene
  const { data: selectedEvent } = getEventsById({
    bandId,
    eventId: selectedEventId || '',
  });

  // Filtrar solo eventos futuros
  const upcomingEvents = useMemo(() => {
    if (!events) return [];
    const now = new Date();
    return events
      .filter((event) => new Date(event.date) > now)
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [events]);

  // Verificar si hay eventos futuros disponibles
  const hasUpcomingEvents = upcomingEvents.length > 0;

  // Servicio para agregar canción al evento
  const { mutate, status } = addSongsToEventService({
    params: { bandId, eventId: selectedEventId || '' },
  });

  // Manejar el éxito/error de la mutación
  useEffect(() => {
    if (status === 'success') {
      const eventIdForInvalidation = selectedEventId;
      toast.success(`"${songTitle}" agregada al evento exitosamente`);
      // Invalidar queries para actualizar la UI
      queryClient.invalidateQueries({
        queryKey: ['Event', bandId, eventIdForInvalidation],
      });
      queryClient.invalidateQueries({
        queryKey: ['EventsOfBand', bandId],
      });
      setSelectedEventId(null);
      setLastError('');
    }
    if (status === 'error') {
      // Si el error es de unique constraint/canción ya existente
      if (
        lastError.includes('Unique constraint failed') ||
        lastError.includes('PRIMARY') ||
        lastError.includes('already') ||
        lastError.includes('exist')
      ) {
        toast.error('La canción ya está en el evento');
      } else {
        toast.error('Error al agregar la canción al evento');
      }
      setSelectedEventId(null);
      setLastError('');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, songTitle, queryClient, bandId]);

  // Función para agregar la canción a un evento
  const handleAddSongToEvent = (eventId: number) => {
    setSelectedEventId(eventId.toString());

    // Esperar a que se cargue el evento seleccionado
    // El useEffect se encargará de hacer la mutación cuando tengamos los datos
  };

  // Cuando tengamos el evento seleccionado y sus canciones, hacer la mutación
  useEffect(() => {
    if (selectedEventId && selectedEvent && status === 'idle') {
      const eventSongsLength = selectedEvent.songs.length;
      const newOrder = eventSongsLength + 1;
      mutate(
        {
          songDetails: [
            {
              songId,
              transpose: 0,
              order: newOrder,
            },
          ],
        },
        {
          onError: (error: unknown) => {
            let msg = '';
            if (error instanceof Error) {
              msg = error.message || '';
            } else if (typeof error === 'string') {
              msg = error;
            }
            setLastError(msg);
          },
        },
      );
    }
  }, [selectedEventId, selectedEvent, songId, mutate, status]);

  return {
    isOpen,
    onOpen,
    onOpenChange,
    upcomingEvents,
    hasUpcomingEvents,
    handleAddSongToEvent,
    isAdding: status === 'pending',
  };
};
