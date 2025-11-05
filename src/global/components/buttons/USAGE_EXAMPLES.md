# Ejemplos de Uso - Sistema de Botones

## 🎯 Casos de Uso Reales en Adorador

### 1. Formulario de Login con Estados

```tsx
'use client';

import { useState } from 'react';
import { PrimaryButton, TertiaryButton } from '@global/components/buttons';
import { useMutation } from '@tanstack/react-query';

export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const loginMutation = useMutation({
    mutationFn: async (data: { email: string; password: string }) => {
      // Tu lógica de login
      return await fetch('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loginMutation.mutate({ email, password });
  };

  const isFormValid = email.length > 0 && password.length > 0;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Contraseña"
      />

      {/* Botón principal con loading y disabled */}
      <PrimaryButton
        type="submit"
        isLoading={loginMutation.isPending}
        disabled={!isFormValid}
        className="w-full"
      >
        {loginMutation.isPending ? 'Iniciando sesión...' : 'Iniciar sesión'}
      </PrimaryButton>

      {/* Link terciario para recuperar contraseña */}
      <TertiaryButton href="/auth/reset-password" className="w-full">
        ¿Olvidaste tu contraseña?
      </TertiaryButton>
    </form>
  );
}
```

---

### 2. Modal de Confirmación con Loading

```tsx
'use client';

import { Modal, ModalBody, ModalFooter } from '@nextui-org/react';
import { PrimaryButton, SecondaryButton } from '@global/components/buttons';
import { useMutation } from '@tanstack/react-query';

export function DeleteConfirmModal({ isOpen, onClose, itemId }) {
  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      return await fetch(`/api/items/${id}`, { method: 'DELETE' });
    },
    onSuccess: () => {
      onClose();
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalBody>
        <h3>¿Estás seguro?</h3>
        <p>Esta acción no se puede deshacer.</p>
      </ModalBody>
      <ModalFooter>
        {/* Botón secundario deshabilitado mientras se procesa */}
        <SecondaryButton onClick={onClose} disabled={deleteMutation.isPending}>
          Cancelar
        </SecondaryButton>

        {/* Botón primario con loading */}
        <PrimaryButton
          onClick={() => deleteMutation.mutate(itemId)}
          isLoading={deleteMutation.isPending}
        >
          {deleteMutation.isPending ? 'Eliminando...' : 'Eliminar'}
        </PrimaryButton>
      </ModalFooter>
    </Modal>
  );
}
```

---

### 3. Botón con `onPress` (NextUI Style)

```tsx
'use client';

import { PrimaryButton } from '@global/components/buttons';
import { useDisclosure } from '@nextui-org/react';

export function CreateGroupButton() {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      {/* Usar onPress en lugar de onClick (estilo NextUI) */}
      <PrimaryButton onPress={onOpen} endContent={<span>+</span>}>
        Crear nuevo grupo
      </PrimaryButton>

      {/* Tu modal aquí */}
    </>
  );
}
```

---

### 4. Navegación con Iconos

```tsx
import { PrimaryButton, SecondaryButton } from '@global/components/buttons';
import { ArrowRightIcon, ArrowLeftIcon } from '@global/icons';

export function NavigationButtons({ currentPage, totalPages }) {
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;

  return (
    <div className="flex gap-4">
      {/* Botón deshabilitado si no hay página anterior */}
      <SecondaryButton
        href={`/page/${currentPage - 1}`}
        isDisabled={!hasPrev}
        startContent={<ArrowLeftIcon />}
      >
        Anterior
      </SecondaryButton>

      <SecondaryButton
        href={`/page/${currentPage + 1}`}
        isDisabled={!hasNext}
        endContent={<ArrowRightIcon />}
      >
        Siguiente
      </SecondaryButton>
    </div>
  );
}
```

---

### 5. Formulario de Creación con Validación

```tsx
'use client';

import { useState } from 'react';
import { PrimaryButton, SecondaryButton } from '@global/components/buttons';
import { useMutation } from '@tanstack/react-query';

export function CreateBandForm() {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const createMutation = useMutation({
    mutationFn: async (data: { name: string; description: string }) => {
      return await fetch('/api/bands', {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },
  });

  // Validación: nombre debe tener al menos 3 caracteres
  const isValid = name.trim().length >= 3;
  const isProcessing = createMutation.isPending;

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        createMutation.mutate({ name, description });
      }}
    >
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Nombre del grupo"
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Descripción"
      />

      <div className="flex gap-4">
        {/* Botón de cancelar deshabilitado mientras se procesa */}
        <SecondaryButton
          type="button"
          onClick={() => {
            setName('');
            setDescription('');
          }}
          disabled={isProcessing}
        >
          Limpiar
        </SecondaryButton>

        {/* Botón principal con validación y loading */}
        <PrimaryButton
          type="submit"
          isLoading={isProcessing}
          disabled={!isValid}
        >
          {isProcessing ? 'Creando...' : 'Crear grupo'}
        </PrimaryButton>
      </div>
    </form>
  );
}
```

---

### 6. Botón con startContent (Icono a la izquierda)

```tsx
import { PrimaryButton } from '@global/components/buttons';
import { GuitarIcon } from '@global/icons';

export function AddSongButton() {
  return (
    <PrimaryButton href="/songs/new" startContent={<GuitarIcon />}>
      Agregar canción
    </PrimaryButton>
  );
}
```

---

### 7. Loading State Condicional

```tsx
'use client';

import { PrimaryButton } from '@global/components/buttons';
import { useMutation } from '@tanstack/react-query';

export function SaveButton({ data }) {
  const saveMutation = useMutation({
    mutationFn: async (formData) => {
      return await fetch('/api/save', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
    },
  });

  return (
    <PrimaryButton
      onClick={() => saveMutation.mutate(data)}
      isLoading={saveMutation.isPending}
      startContent={!saveMutation.isPending && <span>💾</span>}
    >
      {saveMutation.isPending ? 'Guardando...' : 'Guardar cambios'}
    </PrimaryButton>
  );
}
```

---

### 8. Botón con Múltiples Estados

```tsx
'use client';

import { PrimaryButton } from '@global/components/buttons';
import { useState } from 'react';

export function ProcessButton() {
  const [status, setStatus] = useState<
    'idle' | 'processing' | 'success' | 'error'
  >('idle');

  const handleProcess = async () => {
    setStatus('processing');
    try {
      await fetch('/api/process', { method: 'POST' });
      setStatus('success');
      setTimeout(() => setStatus('idle'), 2000);
    } catch {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 2000);
    }
  };

  const getButtonText = () => {
    switch (status) {
      case 'processing':
        return 'Procesando...';
      case 'success':
        return '✓ Completado';
      case 'error':
        return '✗ Error';
      default:
        return 'Procesar';
    }
  };

  return (
    <PrimaryButton
      onClick={handleProcess}
      isLoading={status === 'processing'}
      disabled={status !== 'idle'}
      className={
        status === 'success'
          ? '!bg-green-500'
          : status === 'error'
            ? '!bg-red-500'
            : ''
      }
    >
      {getButtonText()}
    </PrimaryButton>
  );
}
```

---

## 🎨 Combinaciones Comunes

### Hero Section

```tsx
<div className="flex gap-4">
  <PrimaryButton href="/auth/register">Comienza gratis ahora</PrimaryButton>
  <SecondaryButton href="#demo">Ver demo en vivo</SecondaryButton>
</div>
```

### Form Actions

```tsx
<div className="flex justify-end gap-4">
  <SecondaryButton onClick={handleCancel} disabled={isProcessing}>
    Cancelar
  </SecondaryButton>
  <PrimaryButton type="submit" isLoading={isProcessing}>
    Guardar
  </PrimaryButton>
</div>
```

### Help Links

```tsx
<div className="space-y-2 text-center">
  <TertiaryButton href="/help">¿Necesitas ayuda?</TertiaryButton>
  <TertiaryButton href="/terms">Términos y condiciones</TertiaryButton>
</div>
```

---

## ⚡ Props Importantes

| Prop                      | Cuándo usar                                                 |
| ------------------------- | ----------------------------------------------------------- |
| `isLoading`               | Cuando hay una operación async en proceso (mutation, fetch) |
| `disabled` / `isDisabled` | Cuando el botón no debe ser clickeable (validación, estado) |
| `type="submit"`           | En formularios para enviar el form                          |
| `onPress`                 | Estilo NextUI, alternativa a `onClick`                      |
| `onClick`                 | Para acciones JavaScript                                    |
| `href`                    | Para navegación (convierte en Link)                         |
| `startContent`            | Icono/contenido a la izquierda                              |
| `endContent`              | Icono/contenido a la derecha (ej: flechas →)                |

---

## 🚨 Reglas Importantes

1. **`disabled` vs `isDisabled`**: Ambas funcionan, se combinan automáticamente
2. **`isLoading` automáticamente deshabilita el botón**: No necesitas agregar `disabled` también
3. **`onClick` vs `onPress`**: Usa `onPress` si estás integrando con NextUI (ej: Modals), usa `onClick` para lógica normal
4. **`href` convierte en Link**: Si pasas `href`, el botón se convierte en un `<a>` con Next Link automáticamente
5. **Cambio de texto en loading**: Cambia el `children` basado en el estado de `isLoading` para mejor UX

---

## ✅ Mejores Prácticas

### ✅ CORRECTO

```tsx
// Con validación y loading
<PrimaryButton
  type="submit"
  isLoading={isPending}
  disabled={!isValid}
>
  {isPending ? 'Guardando...' : 'Guardar'}
</PrimaryButton>

// Con mutation de React Query
<PrimaryButton
  onClick={() => mutation.mutate(data)}
  isLoading={mutation.isPending}
>
  {mutation.isPending ? 'Procesando...' : 'Enviar'}
</PrimaryButton>
```

### ❌ INCORRECTO

```tsx
// Sin loading state
<PrimaryButton onClick={handleSave}>
  Guardar
</PrimaryButton>

// Sin disabled durante loading (el botón seguirá clickeable)
<PrimaryButton isLoading={isPending} onClick={handleSave}>
  Guardar
</PrimaryButton>

// Olvidando cambiar el texto durante loading
<PrimaryButton isLoading={isPending}>
  Guardar
</PrimaryButton>
```
