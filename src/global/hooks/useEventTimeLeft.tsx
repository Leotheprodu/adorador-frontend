import { formatTimeLeft } from '@global/utils/dataFormat';
import { useEffect, useState } from 'react';

/**
 * Hook reutilizable para calcular y formatear el tiempo restante hasta un evento
 * @param date - Fecha del evento
 * @returns eventTimeLeft - Texto formateado con el tiempo restante o estado del evento
 */
export const useEventTimeLeft = (date: string | Date | undefined) => {
  const [eventTimeLeft, setEventTimeLeft] = useState<string>('');
  const [timeLeft, setTimeLeft] = useState<number>(0);

  // Calcular tiempo restante
  useEffect(() => {
    if (!date) return;

    const targetTime = new Date(date).getTime();

    const updateTimeLeft = () => {
      const now = new Date().getTime();
      const difference = targetTime - now;
      setTimeLeft(difference);
    };

    updateTimeLeft(); // Actualizar inmediatamente
    const intervalId = setInterval(updateTimeLeft, 1000);

    return () => clearInterval(intervalId);
  }, [date]);

  // Formatear mensaje basado en tiempo restante
  useEffect(() => {
    if (!date) {
      setEventTimeLeft('');
      return;
    }

    const handleEventTime = (timeLeft: number, date: string | Date): string => {
      if (timeLeft <= 0) {
        const now = new Date();
        const eventDate = new Date(date);

        // Comparar solo las fechas (año, mes, día) en hora local
        const isSameDay =
          now.getFullYear() === eventDate.getFullYear() &&
          now.getMonth() === eventDate.getMonth() &&
          now.getDate() === eventDate.getDate();

        // Si es el mismo día (hoy), el evento ya comenzó
        if (isSameDay) {
          return 'El evento ha comenzado';
        } else {
          // Si es un día diferente (ayer o anterior), el evento ya pasó
          return 'El evento ya ha pasado';
        }
      } else if (timeLeft <= 60000) {
        return 'El evento comenzará en menos de un minuto';
      } else {
        return formatTimeLeft(timeLeft);
      }
    };

    setEventTimeLeft(handleEventTime(timeLeft, date));
  }, [timeLeft, date]);

  return {
    eventTimeLeft,
    timeLeft, // También retornamos el tiempo en milisegundos por si se necesita
  };
};
