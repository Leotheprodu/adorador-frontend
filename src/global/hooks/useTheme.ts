import { useEffect } from 'react';
import { useStore } from '@nanostores/react';
import { $theme, $resolvedTheme, Theme } from '@global/stores/theme';
import {
  getLocalStorage,
  setLocalStorage,
} from '@global/utils/handleLocalStorage';

const THEME_STORAGE_KEY = 'adorador_theme';

export function useTheme() {
  const theme = useStore($theme);
  const resolvedTheme = useStore($resolvedTheme);

  // Inicializar tema desde localStorage al montar
  useEffect(() => {
    const savedTheme = getLocalStorage(THEME_STORAGE_KEY, true) as Theme;
    if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
      $theme.set(savedTheme);
    }
  }, []);

  // Resolver el tema cuando cambia la preferencia o el tema del sistema
  useEffect(() => {
    const resolveTheme = () => {
      if (theme === 'system') {
        const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
          .matches
          ? 'dark'
          : 'light';
        $resolvedTheme.set(systemTheme);
      } else {
        $resolvedTheme.set(theme as 'light' | 'dark');
      }
    };

    resolveTheme();

    // Escuchar cambios en la preferencia del sistema
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (theme === 'system') {
        resolveTheme();
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, [theme]);

  // Aplicar la clase dark al HTML
  useEffect(() => {
    const root = document.documentElement;
    if (resolvedTheme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  }, [resolvedTheme]);

  const setTheme = (newTheme: Theme) => {
    $theme.set(newTheme);
    setLocalStorage(THEME_STORAGE_KEY, newTheme, true);
  };

  return {
    theme,
    resolvedTheme,
    setTheme,
  };
}
