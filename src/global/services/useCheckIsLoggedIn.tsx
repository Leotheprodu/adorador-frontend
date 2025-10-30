'use client';

// Versión simplificada - la inicialización se hace en el AuthProvider
// Este hook ahora es prácticamente un no-op para evitar bucles infinitos
export const useCheckIsLoggedIn = () => {
  // La inicialización se hace una vez en AuthProvider usando el singleton
  // Este hook se mantiene para compatibilidad pero no hace nada crítico
};
