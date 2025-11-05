# Sistema de Botones de Adorador

Sistema de componentes de botones reutilizables con estilos consistentes de la marca.

## 📦 Componentes Disponibles

### 1. PrimaryButton

Botón principal con gradiente morado de la marca. Úsalo para acciones primarias y CTAs importantes.

### 2. SecondaryButton

Botón secundario con borde de la marca. Úsalo para acciones secundarias y opciones alternativas.

### 3. TertiaryButton

Botón terciario de texto sin borde. Úsalo para acciones de menor importancia y enlaces de texto.

---

## 🚀 Uso Básico

### Importación

```tsx
// Importar componentes individuales
import { PrimaryButton } from '@global/components/buttons';
import { SecondaryButton } from '@global/components/buttons';
import { TertiaryButton } from '@global/components/buttons';

// O importar todos a la vez
import {
  PrimaryButton,
  SecondaryButton,
  TertiaryButton,
} from '@global/components/buttons';
```

---

## 📘 PrimaryButton

### Como Link (navegación)

```tsx
<PrimaryButton href="/auth/login">
  Iniciar sesión
</PrimaryButton>

<PrimaryButton href="/auth/register" endContent={<span>→</span>}>
  Crear cuenta gratis
</PrimaryButton>
```

### Como Button (con onClick)

```tsx
<PrimaryButton onClick={handleSave}>
  Guardar cambios
</PrimaryButton>

<PrimaryButton onClick={handleSubmit} isLoading={isPending}>
  Procesando...
</PrimaryButton>
```

### Como Submit Button (en formularios)

```tsx
<form onSubmit={handleSubmit}>
  <input type="email" />
  <PrimaryButton type="submit" isLoading={isPending}>
    Enviar formulario
  </PrimaryButton>
</form>
```

### Con estilos personalizados

```tsx
<PrimaryButton href="/start" className="w-full sm:w-auto">
  Empezar ahora
</PrimaryButton>
```

---

## 📗 SecondaryButton

### Como Link (navegación)

```tsx
<SecondaryButton href="/demo">
  Ver demo en vivo
</SecondaryButton>

<SecondaryButton href="/recursos" endContent={<span>→</span>}>
  Explorar recursos
</SecondaryButton>
```

### Como Button (con onClick)

```tsx
<SecondaryButton onClick={handleCancel}>
  Cancelar
</SecondaryButton>

<SecondaryButton onClick={handleReset} disabled={!hasChanges}>
  Restablecer
</SecondaryButton>
```

### Con estilos personalizados (borde blanco)

```tsx
<SecondaryButton
  href="/recursos"
  className="hover:text-brand-purple-600 border-white text-white hover:bg-white"
>
  Explorar recursos
</SecondaryButton>
```

---

## 📙 TertiaryButton

### Como Link (navegación)

```tsx
<TertiaryButton href="/ayuda">
  ¿Necesitas ayuda?
</TertiaryButton>

<TertiaryButton href="/terminos">
  Ver términos y condiciones
</TertiaryButton>
```

### Como Button (con onClick)

```tsx
<TertiaryButton onClick={handleSkip}>
  Omitir este paso
</TertiaryButton>

<TertiaryButton onClick={handleBack}>
  ← Volver atrás
</TertiaryButton>
```

### Con color personalizado

```tsx
<TertiaryButton
  href="/reset-password"
  className="text-red-600 hover:text-red-700"
>
  ¿Olvidaste tu contraseña?
</TertiaryButton>
```

---

## 🎨 Props Disponibles

Todos los componentes aceptan las mismas props:

| Prop                                  | Tipo                              | Descripción                                        |
| ------------------------------------- | --------------------------------- | -------------------------------------------------- |
| `children`                            | `ReactNode`                       | Contenido del botón (requerido)                    |
| `href`                                | `string`                          | URL para navegación (convierte el botón en Link)   |
| `onClick`                             | `() => void`                      | Función a ejecutar al hacer click                  |
| `className`                           | `string`                          | Clases CSS adicionales (se fusionan con las base)  |
| `endContent`                          | `ReactNode`                       | Contenido al final del botón (ej: iconos, flechas) |
| `type`                                | `'button' \| 'submit' \| 'reset'` | Tipo de botón HTML                                 |
| `isLoading`                           | `boolean`                         | Muestra estado de carga                            |
| `disabled`                            | `boolean`                         | Deshabilita el botón                               |
| `size`                                | `'sm' \| 'md' \| 'lg'`            | Tamaño del botón (por defecto: `'lg'`)             |
| ...y todas las props de NextUI Button |                                   |                                                    |

---

## 🎯 Ejemplos de Casos de Uso

### Hero Section - CTAs principales

```tsx
<div className="flex gap-4">
  <PrimaryButton href="/auth/register">Comienza gratis ahora</PrimaryButton>

  <SecondaryButton href="#demo">Ver demo en vivo</SecondaryButton>
</div>
```

### Formulario de Login

```tsx
<form onSubmit={handleLogin}>
  <input type="email" name="email" />
  <input type="password" name="password" />

  <PrimaryButton type="submit" isLoading={isPending} className="w-full">
    Iniciar sesión
  </PrimaryButton>

  <TertiaryButton href="/reset-password" className="w-full">
    ¿Olvidaste tu contraseña?
  </TertiaryButton>
</form>
```

### Modal de confirmación

```tsx
<Modal>
  <ModalBody>
    <p>¿Estás seguro de que quieres eliminar este elemento?</p>
  </ModalBody>
  <ModalFooter>
    <SecondaryButton onClick={onClose}>Cancelar</SecondaryButton>
    <PrimaryButton onClick={handleDelete} isLoading={isDeleting}>
      Eliminar
    </PrimaryButton>
  </ModalFooter>
</Modal>
```

### Call to Action Section

```tsx
<section className="bg-gradient-cta">
  <h2>¿Listo para transformar tu ministerio?</h2>

  <div className="flex gap-4">
    <PrimaryButton href="/auth/login" className="w-full sm:w-auto">
      Crear mi cuenta gratis
    </PrimaryButton>

    <SecondaryButton
      href="/recursos"
      className="w-full border-white text-white sm:w-auto"
    >
      Explorar recursos
    </SecondaryButton>
  </div>
</section>
```

### Navegación con iconos

```tsx
<div className="flex justify-between">
  <SecondaryButton href="/prev" endContent={<ArrowLeftIcon />}>
    Anterior
  </SecondaryButton>

  <PrimaryButton href="/next" endContent={<ArrowRightIcon />}>
    Siguiente
  </PrimaryButton>
</div>
```

---

## 🎨 Estilos Incluidos

### PrimaryButton

- **Gradiente:** `bg-gradient-primary` (morado a rosa)
- **Texto:** Blanco y semi-bold
- **Sombra:** `shadow-lg` con `hover:shadow-xl`
- **Hover:** `hover:scale-105` (efecto de zoom)

### SecondaryButton

- **Borde:** 2px sólido en brand-purple-600
- **Texto:** brand-purple-600 semi-bold
- **Fondo:** Transparente
- **Hover:** Fondo brand-purple-600 y texto blanco

### TertiaryButton

- **Borde:** Sin borde
- **Texto:** brand-purple-600 semi-bold
- **Fondo:** Transparente
- **Hover:** Subrayado y color más oscuro

---

## 🔧 Personalización Avanzada

### Sobrescribir estilos base

```tsx
// Las clases personalizadas se fusionan con las base
<PrimaryButton href="/custom" className="!bg-red-500 hover:!bg-red-600">
  Botón rojo (usa !important para sobrescribir)
</PrimaryButton>
```

### Crear variantes personalizadas

```tsx
// Puedes extender los componentes para crear variantes
const DangerButton = ({ children, ...props }) => (
  <PrimaryButton
    className="!bg-gradient-to-r !from-red-500 !to-red-600"
    {...props}
  >
    {children}
  </PrimaryButton>
);
```

---

## ✅ Tests

Todos los componentes incluyen tests completos:

- ✅ Renderizado como Link y Button
- ✅ Aplicación correcta de estilos
- ✅ Forwarding de props
- ✅ Interacciones de usuario
- ✅ Casos de uso reales

Ejecutar tests:

```bash
npm test buttons
```

---

## 📐 Guía de Diseño

### Jerarquía Visual

1. **PrimaryButton**: Acción principal más importante (1 por sección)
2. **SecondaryButton**: Acción secundaria o alternativa (máx. 2 por sección)
3. **TertiaryButton**: Acciones terciarias, enlaces de ayuda, etc.

### Cuándo usar cada uno

| Situación                     | Componente        |
| ----------------------------- | ----------------- |
| CTA principal en hero section | `PrimaryButton`   |
| Submit en formularios         | `PrimaryButton`   |
| Acción alternativa            | `SecondaryButton` |
| Cancelar operación            | `SecondaryButton` |
| Enlaces de ayuda              | `TertiaryButton`  |
| "Olvidaste tu contraseña?"    | `TertiaryButton`  |
| Navegación de regreso         | `TertiaryButton`  |

### Reglas de Oro

- ✅ Máximo 1 PrimaryButton por sección visible
- ✅ Usa SecondaryButton para acciones menos importantes
- ✅ Usa TertiaryButton para enlaces de texto
- ✅ Mantén consistencia en toda la app
- ✅ No mezcles estilos (no uses `<a>` o `<button>` directamente)

---

## 🔗 Referencias

- [NextUI Button Docs](https://nextui.org/docs/components/button)
- [COLOR_GUIDE.md](../../COLOR_GUIDE.md) - Guía de colores de la marca
- [Tailwind Config](../../../../tailwind.config.ts) - Configuración de gradientes

---

## 🚦 Migración de Código Existente

### Antes (usando Link/a directamente)

```tsx
<Link
  href="/login"
  className="bg-gradient-primary rounded-lg px-8 py-4 text-white"
>
  Iniciar sesión
</Link>
```

### Después (usando PrimaryButton)

```tsx
<PrimaryButton href="/login">Iniciar sesión</PrimaryButton>
```

### Beneficios

- ✅ Menos código boilerplate
- ✅ Estilos consistentes automáticos
- ✅ Más fácil de mantener
- ✅ Tests incluidos
- ✅ Mejor accesibilidad
