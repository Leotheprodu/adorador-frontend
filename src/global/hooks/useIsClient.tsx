'use client';
import { useEffect, useState } from 'react';

// Hook para detectar si estamos en el cliente (después de la hidratación)
export const useIsClient = () => {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return isClient;
};
