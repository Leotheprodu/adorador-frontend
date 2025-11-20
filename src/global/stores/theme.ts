import { atom } from 'nanostores';

export type Theme = 'light' | 'dark' | 'system';

// Store para el tema actual (preferencia del usuario)
export const $theme = atom<Theme>('system');

// Store para el tema resuelto (después de resolver 'system')
export const $resolvedTheme = atom<'light' | 'dark'>('light');
