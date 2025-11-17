'use client';
import { useTheme } from '@global/hooks/useTheme';
import { MoonIcon, SunIcon } from '@global/icons';
import { Button } from '@nextui-org/react';

export function ThemeToggle() {
  const { resolvedTheme, setTheme } = useTheme();

  const handleToggle = () => {
    // Alternar entre light y dark solamente
    const newTheme = resolvedTheme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
  };

  // Mostrar el icono basado en el tema resuelto actual
  const CurrentIcon = resolvedTheme === 'dark' ? MoonIcon : SunIcon;
  const label =
    resolvedTheme === 'dark' ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro';

  return (
    <Button
      isIconOnly
      variant="flat"
      onPress={handleToggle}
      aria-label={label}
      className="bg-brand-purple-100 text-brand-purple-700 hover:bg-brand-purple-200 dark:bg-brand-purple-900 dark:text-brand-purple-300 dark:hover:bg-brand-purple-800"
    >
      <CurrentIcon className="h-5 w-5" />
    </Button>
  );
}
