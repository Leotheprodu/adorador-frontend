import { useEffect, useState } from 'react';

export const useLeftTime = ({ date }: { date: string | Date | undefined }) => {
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    if (!date) return;

    const targetTime = new Date(date).getTime();
    const intervalId = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetTime - now;

      if (difference <= 0) {
        clearInterval(intervalId);
        setTimeLeft(0);
      } else {
        setTimeLeft(difference);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [date]);

  return {
    timeLeft,
  };
};
