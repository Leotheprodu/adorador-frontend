import { nextui } from '@nextui-org/theme';
import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@nextui-org/theme/dist/components/(button|calendar|checkbox|chip|date-input|date-picker|dropdown|image|input|link|listbox|modal|popover|radio|select|slider|spinner|table|ripple|menu|divider|scroll-shadow|spacer).js',
  ],
  darkMode: 'class', // Modo oscuro controlado por clase
  theme: {
    extend: {
      colors: {
        blanco: '#ffffff',
        negro: '#000814',
        primario: '#FFFEFA',
        secundario: '#060606',
        terciario: '#FAFAFA',
        // Paleta de marca - Purple, Pink, Blue
        brand: {
          purple: {
            50: '#faf5ff',
            100: '#f3e8ff',
            200: '#e9d5ff',
            300: '#d8b4fe',
            400: '#c084fc',
            500: '#a855f7',
            600: '#9333ea',
            700: '#7e22ce',
            800: '#6b21a8',
            900: '#581c87',
            950: '#3b0764',
          },
          pink: {
            50: '#fdf2f8',
            100: '#fce7f3',
            200: '#fbcfe8',
            300: '#f9a8d4',
            400: '#f472b6',
            500: '#ec4899',
            600: '#db2777',
            700: '#be185d',
            800: '#9f1239',
            900: '#831843',
          },
          blue: {
            50: '#eff6ff',
            100: '#dbeafe',
            200: '#bfdbfe',
            300: '#93c5fd',
            400: '#60a5fa',
            500: '#3b82f6',
            600: '#2563eb',
            700: '#1d4ed8',
            800: '#1e40af',
            900: '#1e3a8a',
          },
        },
      },
      backgroundImage: {
        // Degradados principales de la marca
        'gradient-primary': 'linear-gradient(to right, #9333ea, #2563eb)',
        'gradient-primary-br':
          'linear-gradient(to bottom right, #9333ea, #ec4899, #2563eb)',
        'gradient-hero':
          'linear-gradient(to bottom right, #faf5ff, #eff6ff, #fdf2f8)',
        'gradient-cta':
          'linear-gradient(to bottom right, #9333ea, #ec4899, #2563eb)',
        // Degradados para backgrounds suaves
        'gradient-light': 'linear-gradient(to bottom right, #faf5ff, #eff6ff)',
        'gradient-subtle': 'linear-gradient(to bottom right, #ffffff, #f9fafb)',
        'gradient-gray': 'linear-gradient(to bottom right, #f9fafb, #e5e7eb)',
        // Degradados para iconos y elementos decorativos
        'gradient-icon': 'linear-gradient(to bottom right, #f3e8ff, #dbeafe)',
        'gradient-badge': 'linear-gradient(to bottom right, #a855f7, #9333ea)',
        'gradient-badge-pink':
          'linear-gradient(to bottom right, #ec4899, #db2777)',
        'gradient-badge-blue':
          'linear-gradient(to bottom right, #3b82f6, #2563eb)',
        // Degradado para líneas conectoras
        'gradient-connector': 'linear-gradient(to right, #e9d5ff, #bfdbfe)',
        // Degradados para modo oscuro
        'gradient-dark-hero':
          'linear-gradient(to bottom right, #1e1b4b, #1e3a8a, #831843)',
        'gradient-dark-subtle':
          'linear-gradient(to bottom right, #0f172a, #1e293b)',
        'gradient-dark-gray':
          'linear-gradient(to bottom right, #1e293b, #334155)',
      },
      // Clases de utilidad para text gradients
      textGradient: {
        primary: 'bg-gradient-to-r from-purple-600 via-pink-500 to-blue-600',
        simple: 'bg-gradient-to-r from-purple-600 to-blue-600',
      },
    },
  },
  plugins: [
    nextui(),
    // Plugin personalizado para text gradients
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    function ({ addUtilities }: any) {
      const newUtilities = {
        '.text-gradient-primary': {
          background: 'linear-gradient(to right, #9333ea, #ec4899, #2563eb)',
          '-webkit-background-clip': 'text',
          'background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
        },
        '.text-gradient-simple': {
          background: 'linear-gradient(to right, #9333ea, #2563eb)',
          '-webkit-background-clip': 'text',
          'background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
        },
      };
      addUtilities(newUtilities);
    },
  ],
};
export default config;
