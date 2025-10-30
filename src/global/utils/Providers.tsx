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
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <NextUIProvider>
        <AuthProvider>{children}</AuthProvider>
      </NextUIProvider>
    </QueryClientProvider>
  );
}
