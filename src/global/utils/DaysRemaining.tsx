import { useState, useEffect } from 'react';

export const DaysRemaining = ({
  expirationDate,
}: {
  expirationDate: string | Date;
}) => {
  const [daysRemaining, setDaysRemaining] = useState(0);

  useEffect(() => {
    const days = calculateDaysRemaining(expirationDate);
    setDaysRemaining(days);
  }, [expirationDate]);

  return (
    <>
      {daysRemaining > 0 ? (
        <p className="text-center">
          Se vence en {daysRemaining} dia{daysRemaining > 1 ? 's' : ''}
        </p>
      ) : (
        <p>
          El servicio se ha vencido, debes realizar el pago para evitar
          incovenientes.
        </p>
      )}
    </>
  );
};

// Function to calculate the difference in days
const calculateDaysRemaining = (expirationDate: string | Date) => {
  const today = new Date();
  const expiration = new Date(expirationDate);

  // Adjust so that the time of day does not affect the day count
  today.setHours(0, 0, 0, 0);
  expiration.setHours(0, 0, 0, 0);

  const timeDifference = expiration.getTime() - today.getTime();
  const dayDifference = Math.ceil(timeDifference / (1000 * 60 * 60 * 24));
  return dayDifference;
};
