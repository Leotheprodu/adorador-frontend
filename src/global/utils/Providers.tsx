'use client';
import { NextUIProvider } from '@nextui-org/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useIsClient } from '@global/hooks/useIsClient';
import { initializeUserOnce } from '@global/services/userInitializer';
import { useEffect } from 'react';
import { useTokenRefresh } from '@global/hooks/useTokenRefresh';
import { useBandInvitationListeners } from '@global/hooks/useBandInvitationListeners';

// Componente separado para manejar el token refresh
function TokenManager() {
  // Siempre llamar el hook - el hook maneja internamente cuándo ejecutar
  useTokenRefresh();

  return null;
}

// Componente para listeners de WebSocket
function WebSocketManager() {
  useBandInvitationListeners();
  return null;
}

function AuthProvider({ children }: { children: React.ReactNode }) {
  const isClient = useIsClient();

  // Inicializar usuario una vez en toda la aplicación
  useEffect(() => {
    if (isClient) {
      // Eliminar timeout - ejecutar inmediatamente para mejor UX
      // El retry logic interno de initializeUserOnce manejará cold starts
      initializeUserOnce();
    }
  }, [isClient]);

  return (
    <>
      <TokenManager />
      <WebSocketManager />
      {children}
    </>
  );
}

// Crear QueryClient fuera del componente para evitar re-creaciones
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      gcTime: 1000 * 60 * 10, // 10 minutos (antes era cacheTime)
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: false,
      retry: 3, // Aumentado de 1 a 3 para mejor tolerancia a cold starts
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 8000), // Exponential backoff: 1s, 2s, 4s, 8s
    },
    mutations: {
      retry: 1, // Mutations generalmente no deben reintentar (pueden duplicar acciones)
    },
  },
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <NextUIProvider>
        <AuthProvider>{children}</AuthProvider>
      </NextUIProvider>
    </QueryClientProvider>
  );
}
