import { formatTimeLeft } from '@global/utils/dataFormat';
import { useEffect, useState } from 'react';

export const useHandleEventLeft = ({
  timeLeft,
  date,
}: {
  timeLeft: number;
  date: string | Date | undefined;
}) => {
  const [eventDateLeft, setEventDateLeft] = useState<string>('');

  useEffect(() => {
    setEventDateLeft(handleEventTime(timeLeft, date));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, date]);

  const handleEventTime = (
    timeLeft: number,
    date: string | Date | undefined,
  ) => {
    if (timeLeft <= 0) {
      const now = new Date();
      const eventDate = new Date(date ?? '');
      if (now.toDateString() === eventDate.toDateString()) {
        if (now.getTime() < eventDate.getTime()) {
          return formatTimeLeft(timeLeft);
        } else {
          return 'El evento ha comenzado';
        }
      } else {
        return 'El evento ya ha pasado';
      }
    } else if (timeLeft <= 60000) {
      return 'El evento comenzará en menos de un minuto';
    } else {
      return formatTimeLeft(timeLeft);
    }
  };

  return {
    eventDateLeft,
  };
};
