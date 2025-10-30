'use client';
import { NextUIProvider } from '@nextui-org/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useIsClient } from '@global/hooks/useIsClient';
import { initializeUserOnce } from '@global/services/userInitializer';
import { useEffect } from 'react';
import { useTokenRefresh } from '@global/hooks/useTokenRefresh';

// Componente separado para manejar el token refresh
function TokenManager() {
  // Siempre llamar el hook - el hook maneja internamente cuándo ejecutar
  useTokenRefresh();

  return null;
}

function AuthProvider({ children }: { children: React.ReactNode }) {
  const isClient = useIsClient();

  // Inicializar usuario una vez en toda la aplicación
  useEffect(() => {
    if (isClient) {
      // Usar timeout para asegurar que todo esté cargado
      const timeoutId = setTimeout(() => {
        initializeUserOnce();
      }, 200);

      return () => clearTimeout(timeoutId);
    }
  }, [isClient]);

  return (
    <>
      <TokenManager />
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
      retry: 1,
    },
    mutations: {
      retry: 1,
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
