# 🎨 Paleta y patrones de color para modo oscuro (referencia BandCard y página de grupos)

## Fondos principales

- `bg-gray-50 dark:bg-gray-950` (fondo general de página)
- `bg-white dark:bg-brand-purple-900` (cards, paneles)
- `bg-brand-purple-600 dark:bg-brand-purple-950` (headers de cards)
- `bg-white/20 dark:bg-brand-purple-900/60` (badges, stats)
- `bg-gradient-to-br from-slate-50 to-slate-100 dark:from-brand-purple-950 dark:to-brand-purple-900` (paneles internos)
- `bg-gradient-to-r from-brand-purple-50 to-brand-blue-50 dark:from-brand-purple-900 dark:to-brand-blue-900` (badges, highlights)
- `bg-brand-pink-900/30` (botones destructivos)

## Bordes y rings

- `ring-slate-200/50 dark:ring-brand-purple-800` (cards)
- `border-brand-purple-100/50 dark:border-brand-purple-800/50` (paneles, cards)
- `border-slate-100 dark:border-brand-purple-900/60` (paneles internos)
- `ring-brand-purple-200/50 dark:ring-brand-purple-800/50` (badges, highlights)
- `border-brand-pink-400/30` (botones destructivos)

## Textos

- `text-gray-900 dark:text-gray-400` (títulos principales)
- `text-gray-600 dark:text-brand-purple-200` (subtítulos, descripciones)
- `text-slate-700 dark:text-brand-purple-100` (títulos de secciones)
- `text-slate-500 dark:text-brand-purple-300` (subtítulos secundarios)
- `text-white dark:text-brand-pink-200` (títulos cards)
- `text-brand-blue-100` (stats eventos)
- `text-brand-pink-100` (stats canciones)
- `text-brand-purple-100` (stats miembros)

## Iconos

- `text-brand-purple-600 dark:text-brand-purple-300` (iconos principales)
- `text-white dark:text-brand-purple-200` (iconos secundarios)
- `text-brand-blue-200` (iconos eventos)
- `text-brand-pink-200` (iconos canciones)

## Ejemplo de uso: página principal de grupos

```tsx
<div className="... min-h-screen bg-gray-50 px-4 py-16 dark:bg-gray-950">
  <h1 className="... text-4xl font-bold text-gray-900 dark:text-gray-400">
    Grupos de <span className="text-gradient-simple">Alabanza</span>
  </h1>
  <p className="dark:text-brand-purple-200 ... text-lg text-gray-600">
    Encuentra todos los grupos de alabanza en los que formas parte
  </p>
</div>
```

## Ejemplo de uso: BandCard

```tsx
<div className="dark:bg-brand-purple-900 dark:ring-brand-purple-800 ... bg-white ring-1 ring-slate-200/50">
  <div className="bg-brand-purple-600 dark:bg-brand-purple-950 ...">
    <GuitarIcon className="dark:text-brand-purple-200 text-white" />
    ...
    <div className="dark:bg-brand-purple-900/60 ... bg-white/20">
      <span className="dark:text-brand-blue-100 text-xs font-semibold text-white">
        ...
      </span>
    </div>
    ...
  </div>
</div>
```

---

**Usa siempre estos colores y clases para todos los nuevos componentes y migraciones a dark mode.**

# 🌙 Guía de Modo Oscuro - Adorador

## ✅ Implementación Completa

El modo oscuro está completamente implementado usando **localStorage** para persistir la preferencia del usuario.

## 🛠️ Componentes Creados

### Stores (Nanostores)

- `src/global/stores/theme.ts` - Store global del tema

### Hooks

- `src/global/hooks/useTheme.ts` - Hook para manejar el tema

### Componentes

- `src/global/components/ThemeToggle.tsx` - Botón para cambiar tema
- `src/global/components/ThemeProvider.tsx` - Provider del tema
- `src/global/components/ThemeScript.tsx` - Script para prevenir FOUC

### Iconos

- `src/global/icons/MoonIcon.tsx` - Icono de luna (modo oscuro)
- `src/global/icons/SunIcon.tsx` - Icono de sol (modo claro)
- `src/global/icons/ComputerDesktopIcon.tsx` - Icono de sistema

## 🎨 Cómo Usar en Tus Componentes

### Opción 1: Clases Condicionales de Tailwind (Recomendado)

```tsx
// Ejemplo básico
<div className="bg-white text-black dark:bg-black dark:text-white">
  Contenido que cambia con el tema
</div>

// Ejemplo con degradados
<div className="bg-gradient-light dark:bg-gradient-dark-subtle">
  Fondo con degradado que cambia
</div>

// Ejemplo con bordes
<div className="border border-brand-purple-200 dark:border-brand-purple-800">
  Borde que se adapta al tema
</div>
```

### Opción 2: Usar el Hook useTheme

```tsx
import { useTheme } from '@global/hooks/useTheme';

export function MiComponente() {
  const { theme, resolvedTheme, setTheme } = useTheme();

  return (
    <div>
      <p>Tema actual: {theme}</p>
      <p>Tema resuelto: {resolvedTheme}</p>

      <button onClick={() => setTheme('dark')}>Modo Oscuro</button>
      <button onClick={() => setTheme('light')}>Modo Claro</button>
      <button onClick={() => setTheme('system')}>Usar Sistema</button>
    </div>
  );
}
```

## 🎨 Degradados Disponibles para Modo Oscuro

En `tailwind.config.ts` se agregaron degradados específicos para modo oscuro:

- `bg-gradient-dark-hero` - Para secciones hero en modo oscuro
- `bg-gradient-dark-subtle` - Para fondos sutiles en modo oscuro
- `bg-gradient-dark-gray` - Para fondos grises en modo oscuro

## 💾 Almacenamiento

La preferencia del usuario se guarda en **localStorage** con la clave `adorador_theme`.

Valores posibles:

- `'light'` - Modo claro
- `'dark'` - Modo oscuro
- `'system'` - Seguir preferencia del sistema

## ⚡ Características

- ✅ Persistencia en localStorage
- ✅ Sin flash de contenido (FOUC prevention)
- ✅ Soporte para preferencia del sistema
- ✅ Transiciones suaves entre temas
- ✅ Sincronización automática con cambios del sistema
- ✅ Botón toggle en el header

## 📝 Ejemplos de Componentes Actualizados

### Header

```tsx
// El header ya tiene soporte para modo oscuro
<header className="bg-white/80 dark:bg-negro/80 border-brand-purple-100/50 dark:border-brand-purple-900/50">
```

### Menú Móvil

```tsx
// El menú móvil ya tiene soporte para modo oscuro
<ul className="bg-gradient-light dark:bg-gradient-dark-subtle border-brand-purple-200 dark:border-brand-purple-800">
```

## 🔧 Mejores Prácticas

1. **Siempre usa clases `dark:`** para estilos en modo oscuro
2. **Usa los degradados predefinidos** en lugar de crear nuevos
3. **Prueba ambos modos** al desarrollar componentes nuevos
4. **Usa colores de la paleta brand** para consistencia
5. **Agrega transiciones** con `transition-colors duration-300`

## 🎯 Próximos Pasos Recomendados

Para completar el soporte de modo oscuro en toda la app:

1. Actualizar componentes de formularios
2. Actualizar cards y modales
3. Actualizar el footer
4. Actualizar las páginas principales
5. Ajustar imágenes/logos si es necesario

## 👨‍💻 Testing

Para probar:

1. Haz clic en el botón del sol/luna en el header
2. El tema debe cambiar instantáneamente
3. Recarga la página - el tema debe persistir
4. Prueba en diferentes navegadores

---

¡El modo oscuro está listo para usar! 🎉
