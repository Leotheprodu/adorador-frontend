'use client';
import { useTheme } from '@global/hooks/useTheme';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useTheme(); // Inicializa y maneja el tema

  return <>{children}</>;
}
