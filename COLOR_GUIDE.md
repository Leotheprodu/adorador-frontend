# 🎨 Guía de Colores y Degradados - Adorador

Esta guía documenta la paleta de colores y degradados configurados en `tailwind.config.ts` para mantener consistencia visual en toda la aplicación.

---

## 📊 Paleta de Colores Principal

### 🟣 Purple (Morado)

Representa la espiritualidad y creatividad.

```tsx
// Tonos disponibles:
brand-purple-50  // Más claro
brand-purple-100
brand-purple-200
brand-purple-300
brand-purple-400
brand-purple-500
brand-purple-600 // Principal - #9333ea
brand-purple-700
brand-purple-800
brand-purple-900 // Más oscuro

// Uso:
<div className="bg-brand-purple-600">...</div>
<span className="text-brand-purple-600">...</span>
```

### 🩷 Pink (Rosa)

Representa la pasión y energía.

```tsx
// Tonos disponibles:
brand-pink-50   // Más claro
brand-pink-100
brand-pink-200
brand-pink-300
brand-pink-400
brand-pink-500  // Principal - #ec4899
brand-pink-600
brand-pink-700
brand-pink-800
brand-pink-900  // Más oscuro

// Uso:
<div className="bg-brand-pink-500">...</div>
<span className="text-brand-pink-500">...</span>
```

### 🔵 Blue (Azul)

Representa la confianza y profesionalismo.

```tsx
// Tonos disponibles:
brand-blue-50   // Más claro
brand-blue-100
brand-blue-200
brand-blue-300
brand-blue-400
brand-blue-500
brand-blue-600  // Principal - #2563eb
brand-blue-700
brand-blue-800
brand-blue-900  // Más oscuro

// Uso:
<div className="bg-brand-blue-600">...</div>
<span className="text-brand-blue-600">...</span>
```

---

## 🌈 Degradados (Gradients)

### 🎯 Degradados Principales

#### **gradient-primary** - Para botones y CTAs

```tsx
<button className="bg-gradient-primary">Click aquí</button>
// Linear gradient: purple-600 → blue-600
```

#### **gradient-primary-br** - Para fondos destacados

```tsx
<div className="bg-gradient-primary-br">Contenido</div>
// Linear gradient: purple-600 → pink-500 → blue-600
```

#### **gradient-hero** - Para hero sections

```tsx
<section className="bg-gradient-hero">Hero content</section>
// Linear gradient: purple-50 → blue-50 → pink-50
```

#### **gradient-cta** - Para call-to-action sections

```tsx
<section className="bg-gradient-cta">CTA content</section>
// Linear gradient: purple-600 → pink-500 → blue-600
```

---

### 🎨 Degradados para Backgrounds

#### **gradient-light** - Fondo suave purple-blue

```tsx
<div className="bg-gradient-light">Contenido</div>
```

#### **gradient-subtle** - Fondo white-gray muy suave

```tsx
<div className="bg-gradient-subtle">Contenido</div>
```

#### **gradient-gray** - Fondo gray neutro

```tsx
<div className="bg-gradient-gray">Contenido</div>
```

---

### 🎪 Degradados para Elementos Decorativos

#### **gradient-icon** - Para fondos de iconos

```tsx
<div className="bg-gradient-icon rounded-xl p-4">
  <Icon />
</div>
// Linear gradient: purple-100 → blue-100
```

#### **gradient-badge** - Badge purple

```tsx
<span className="bg-gradient-badge">Badge</span>
```

#### **gradient-badge-pink** - Badge pink

```tsx
<span className="bg-gradient-badge-pink">Badge</span>
```

#### **gradient-badge-blue** - Badge blue

```tsx
<span className="bg-gradient-badge-blue">Badge</span>
```

#### **gradient-connector** - Para líneas conectoras

```tsx
<div className="bg-gradient-connector h-0.5"></div>
```

---

## ✨ Text Gradients (Texto con Degradado)

### Opción 1: Clases Utility Personalizadas

```tsx
// Degradado triple (purple → pink → blue)
<h1 className="text-gradient-primary">
  Título con degradado
</h1>

// Degradado simple (purple → blue)
<h1 className="text-gradient-simple">
  Título con degradado simple
</h1>
```

### Opción 2: Clases Tailwind Nativas

```tsx
// Degradado triple
<h1 className="bg-gradient-to-r from-brand-purple-600 via-brand-pink-500 to-brand-blue-600 bg-clip-text text-transparent">
  Título con degradado
</h1>

// Degradado simple
<h1 className="bg-gradient-to-r from-brand-purple-600 to-brand-blue-600 bg-clip-text text-transparent">
  Título con degradado
</h1>
```

---

## 📝 Ejemplos Completos

### Botón Primario con Degradado

```tsx
<button className="bg-gradient-primary rounded-lg px-8 py-4 font-semibold text-white shadow-lg transition-all hover:scale-105">
  Empieza gratis
</button>
```

### Card con Borde y Hover

```tsx
<div className="bg-gradient-subtle hover:border-brand-purple-300 rounded-2xl border border-gray-200 p-8 transition-all hover:shadow-xl">
  Card content
</div>
```

### Sección Hero

```tsx
<section className="bg-gradient-hero px-4 py-20">
  <h1 className="text-gradient-primary text-5xl font-bold">Título Principal</h1>
</section>
```

### Badge con Degradado

```tsx
<div className="bg-gradient-badge inline-flex items-center rounded-full px-4 py-2 text-sm text-white">
  <span>🎵</span>
  Nuevo
</div>
```

### Icon Container

```tsx
<div className="bg-gradient-icon text-brand-purple-600 inline-flex rounded-xl p-4">
  <GuitarIcon className="h-8 w-8" />
</div>
```

---

## 🎨 Combinaciones Recomendadas

### Para Headers

- **Fondo:** `bg-gradient-hero`
- **Texto destacado:** `text-gradient-primary`
- **Botón primario:** `bg-gradient-primary`

### Para Cards

- **Fondo:** `bg-gradient-subtle`
- **Borde normal:** `border-gray-200`
- **Borde hover:** `border-brand-purple-300`
- **Icon container:** `bg-gradient-icon`

### Para CTAs

- **Fondo section:** `bg-gradient-cta`
- **Texto:** `text-white`
- **Botón secundario:** `bg-white text-brand-purple-600`

### Para Footer

- **Fondo:** `bg-gradient-to-br from-gray-900 via-brand-purple-950 to-gray-900`
- **Títulos:** `text-gradient-simple`
- **Texto principal:** `text-white` o `text-gray-300`
- **Elementos decorativos:** `bg-brand-purple-600/20 blur-3xl animate-pulse`
- **Bordes:** `border-brand-purple-800/30`

### Para Stats/Badges

- **Fondo:** `bg-gradient-light`
- **Texto numérico:** `text-gradient-simple`
- **Badge accent:** `bg-gradient-badge`

---

## 🚀 Tips de Uso

1. **Consistencia:** Usa siempre los mismos degradados para elementos similares
2. **Contraste:** Asegúrate de que el texto sea legible sobre los fondos
3. **Hover states:** Agrega `hover:scale-105` y `transition-all` para interactividad
4. **Shadows:** Combina gradients con `shadow-lg` o `shadow-xl`
5. **Borders:** Los gradients se ven mejor con `rounded-lg` o `rounded-xl`

---

## 📦 Colores Legacy (mantener por compatibilidad)

```tsx
// Colores existentes (no remover)
blanco: '#ffffff';
negro: '#000814';
primario: '#FFFEFA';
secundario: '#060606';
terciario: '#FAFAFA';
```

---

¡Feliz desarrollo! 🎨✨
