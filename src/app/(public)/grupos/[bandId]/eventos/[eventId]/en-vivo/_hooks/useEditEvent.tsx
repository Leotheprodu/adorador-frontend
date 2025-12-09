import { useDisclosure } from "@heroui/react";
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { updateEventService } from '@bands/[bandId]/eventos/_services/eventsOfBandService';
import { handleOnChange } from '@global/utils/formUtils';
import { useStore } from '@nanostores/react';
import { $event } from '@stores/event';
import { useQueryClient } from '@tanstack/react-query';

interface EventDataForEdit {
  title: string;
  date: string | Date;
}

export const useEditEvent = ({
  bandId,
  eventId,
  refetch,
  eventData,
}: {
  bandId: string;
  eventId: string;
  refetch: () => void;
  eventData?: EventDataForEdit;
}) => {
  const queryClient = useQueryClient();
  const eventDataFromStore = useStore($event);
  const [form, setForm] = useState({
    title: '',
    date: '',
  });
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const {
    mutate: mutateUpdateEvent,
    status: statusUpdateEvent,
    reset,
  } = updateEventService({ bandId, eventId });

  // Usar eventData si está disponible, de lo contrario usar el store
  const currentEventData = eventData || eventDataFromStore;

  // Verificar si el evento ya pasó
  const eventHasPassed = currentEventData.date
    ? new Date(currentEventData.date) < new Date()
    : false;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleOnChange(setForm, e);
  };

  const handleUpdateEvent = () => {
    if (form.title === '') {
      toast.error('El título del evento es obligatorio');
      return;
    }
    if (!form.date) {
      toast.error('La fecha del evento es obligatoria');
      return;
    }
    mutateUpdateEvent({
      title: form.title,
      date: new Date(form.date),
    });
  };

  // Pre-cargar datos del evento cuando se abre el modal
  const handleOpenModal = () => {
    if (currentEventData.title && currentEventData.date) {
      const eventDate = new Date(currentEventData.date);
      // Ajustar la fecha a la zona horaria local para evitar desfase
      const year = eventDate.getFullYear();
      const month = String(eventDate.getMonth() + 1).padStart(2, '0');
      const day = String(eventDate.getDate()).padStart(2, '0');
      const hours = String(eventDate.getHours()).padStart(2, '0');
      const minutes = String(eventDate.getMinutes()).padStart(2, '0');
      const localDateTime = `${year}-${month}-${day}T${hours}:${minutes}`;

      setForm({
        title: currentEventData.title,
        date: localDateTime,
      });
    }
    onOpen();
  };

  useEffect(() => {
    if (statusUpdateEvent === 'success') {
      toast.success('Evento actualizado correctamente');

      // Invalidar y refetchear inmediatamente las queries relacionadas
      queryClient.invalidateQueries({
        queryKey: ['EventsOfBand', bandId],
        refetchType: 'all',
      });
      queryClient.invalidateQueries({
        queryKey: ['BandById', bandId],
        refetchType: 'all',
      });
      queryClient.invalidateQueries({
        queryKey: ['Event', bandId, eventId],
        refetchType: 'all',
      });
      // Invalidar la lista de grupos del usuario (donde se muestran los eventos en las cards)
      queryClient.invalidateQueries({
        queryKey: ['BandsOfUser'],
        refetchType: 'all',
      });

      refetch();
      reset();
      onOpenChange();
    }
    if (statusUpdateEvent === 'error') {
      toast.error('Error al actualizar el evento');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [statusUpdateEvent]);

  return {
    form,
    setForm,
    isOpen,
    onOpenChange,
    handleChange,
    handleUpdateEvent,
    handleOpenModal,
    statusUpdateEvent,
    eventHasPassed,
  };
};
