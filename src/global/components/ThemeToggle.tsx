'use client';
import { useTheme } from '@global/hooks/useTheme';
import { MoonIcon, SunIcon } from '@global/icons';
import { SystemIcon } from '@global/icons/SystemIcon';
import { Button, Dropdown, DropdownTrigger, DropdownMenu, DropdownItem } from '@nextui-org/react';
import { useEffect, useState } from 'react';

const themeOptions = [
  { key: 'light', label: 'Claro', icon: <SunIcon className="h-4 w-4" /> },
  { key: 'dark', label: 'Oscuro', icon: <MoonIcon className="h-4 w-4" /> },
  { key: 'system', label: 'Sistema', icon: <SystemIcon className="h-4 w-4" /> },
];

export function ThemeToggle() {
  const { theme, resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getIcon = (key: string) => {
    if (key === 'dark') return <MoonIcon className="h-5 w-5" />;
    if (key === 'light') return <SunIcon className="h-5 w-5" />;
    return <SystemIcon className="h-5 w-5" />;
  };

  const current = themeOptions.find(opt => opt.key === theme) || themeOptions[2];

  // Evitar renderizar iconos dependientes del tema hasta que esté montado en cliente
  if (!mounted) {
    return (
      <Button
        isIconOnly
        variant="flat"
        aria-label="Cargando tema..."
        className="bg-brand-purple-100 text-brand-purple-700 hover:bg-brand-purple-200 dark:bg-brand-purple-900 dark:text-brand-purple-300 dark:hover:bg-brand-purple-800"
        disabled
      >
        <SystemIcon className="h-5 w-5 opacity-50" />
      </Button>
    );
  }

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button
          isIconOnly
          variant="flat"
          aria-label={`Tema actual: ${current.label}`}
          className="bg-brand-purple-100 text-brand-purple-700 hover:bg-brand-purple-200 dark:bg-brand-purple-900 dark:text-brand-purple-300 dark:hover:bg-brand-purple-800"
        >
          {getIcon(theme)}
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label="Seleccionar tema"
        onAction={key => setTheme(key as 'light' | 'dark' | 'system')}
        selectedKeys={[theme]}
        selectionMode="single"
      >
        {themeOptions.map(opt => (
          <DropdownItem key={opt.key} startContent={opt.icon}>
            {opt.label}
          </DropdownItem>
        ))}
      </DropdownMenu>
    </Dropdown>
  );
}
