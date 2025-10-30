'use client';
import { NextUIProvider } from '@nextui-org/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import { useTokenRefresh } from '@global/hooks/useTokenRefresh';

function AuthProvider({ children }: { children: React.ReactNode }) {
  // Temporalmente deshabilitado para debug
  // useTokenRefresh();
  return <>{children}</>;
}

export function Providers({ children }: { children: React.ReactNode }) {
  // Crear QueryClient con configuración estable para evitar re-creaciones
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

  return (
    <QueryClientProvider client={queryClient}>
      <NextUIProvider>
        <AuthProvider>{children}</AuthProvider>
      </NextUIProvider>
    </QueryClientProvider>
  );
}
