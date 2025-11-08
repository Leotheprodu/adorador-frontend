# Templates para Testing

Este archivo contiene plantillas/templates para diferentes tipos de tests y las mejores prácticas del proyecto.

## 📚 Índice

1. [Reglas Importantes](#-reglas-importantes)
2. [Mock de Nanostores](#-mock-de-nanostores-crítico)
3. [Template: Componente React](#-template-test-de-componente-react)
4. [Template: Componente con WebSocket](#-template-componente-con-websocket)
5. [Template: Custom Hook](#-template-test-de-custom-hook)
6. [Template: Servicio/API con React Query](#-template-test-de-servicioapi-con-react-query)
7. [Mock de Módulos Comunes](#-template-mock-de-módulos-comunes)
8. [Queries Comunes](#-queries-comunes-de-testing-library)
9. [Assertions Comunes](#-assertions-comunes)
10. [NextUI Components](#-nextui-components-queries-especiales)

---

## 🚨 Reglas Importantes

### Orden de los Mocks (CRÍTICO)

**SIEMPRE** seguir este orden:

1. **Primero**: Mock de `nanostores` y `@nanostores/react`
2. **Segundo**: Mock de otros módulos (`jest.mock(...)`)
3. **Tercero**: Mock de stores específicos con inline factory
4. **Cuarto**: Imports de los módulos a testear

```tsx
// ✅ CORRECTO - Este orden es OBLIGATORIO
// 1. Mock nanostores PRIMERO
jest.mock('nanostores', () => ({...}));
jest.mock('@nanostores/react', () => ({...}));

// 2. Mock otros módulos
jest.mock('@bands/_hooks/useBandMembers');
jest.mock('@global/utils/checkUserStatus');

// 3. Mock stores con inline factory
jest.mock('@global/stores/users', () => {...});

// 4. Imports
import { render, screen } from '@testing-library/react';
import { MiComponente } from '../MiComponente';
```

### Evitar `as any`

Usa `// eslint-disable-next-line @typescript-eslint/no-explicit-any` antes de `as any`:

```tsx
mockUseBandMembers.mockReturnValue({
  data: mockMembers,
  isLoading: false,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
} as any);
```

### displayName en Wrappers

```tsx
const createWrapper = () => {
  const queryClient = new QueryClient({...});
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = 'QueryClientWrapper'; // ✅ Obligatorio
  return Wrapper;
};
```

---

## 🔧 Mock de Nanostores (CRÍTICO)

### Mock Básico de Nanostores (Para todos los tests)

```tsx
// SIEMPRE al inicio del archivo, ANTES de cualquier import
jest.mock('nanostores', () => ({
  atom: jest.fn((initialValue) => ({
    get: jest.fn(() => initialValue),
    set: jest.fn(),
    subscribe: jest.fn(() => jest.fn()),
  })),
}));

jest.mock('@nanostores/react', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useStore: jest.fn((store: any) => store?.get?.() || null),
}));
```

### Mock de Store Específico con Factory Inline

```tsx
// Mock stores con inline factory - DESPUÉS de los mocks anteriores
jest.mock('@global/stores/users', () => {
  let value = {
    id: 1,
    name: 'Test User',
    isLoggedIn: true,
    email: 'test@test.com',
  };

  return {
    $user: {
      get: () => value,
      set: (newValue: typeof value) => {
        value = newValue;
      },
      subscribe: jest.fn(),
    },
  };
});

// Luego puedes importar y usar el store en los tests
import { $user } from '@global/stores/users';

// En beforeEach o en un test
$user.set({ id: 2, name: 'Other User', isLoggedIn: true });
```

### Ejemplo Completo de Setup con Nanostores

```tsx
// Mock nanostores FIRST - before any imports
jest.mock('nanostores', () => ({
  atom: jest.fn((initialValue) => ({
    get: jest.fn(() => initialValue),
    set: jest.fn(),
    subscribe: jest.fn(() => jest.fn()),
  })),
}));

jest.mock('@nanostores/react', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useStore: jest.fn((store: any) => store?.get?.() || null),
}));

// Mock other dependencies BEFORE imports
jest.mock('@bands/_hooks/useBandMembers');

// Mock stores with inline factory
jest.mock('@global/stores/users', () => {
  let value = {
    id: 1,
    name: 'Test User',
    isLoggedIn: true,
  };

  return {
    $user: {
      get: () => value,
      set: (newValue: typeof value) => {
        value = newValue;
      },
      subscribe: jest.fn(),
    },
  };
});

// NOW imports
import { render, screen } from '@testing-library/react';
import { MiComponente } from '../MiComponente';
import { $user } from '@global/stores/users';

describe('MiComponente', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset store to default state
    $user.set({
      id: 1,
      name: 'Test User',
      isLoggedIn: true,
    });
  });

  it('should render with user data', () => {
    render(<MiComponente />);
    expect(screen.getByText('Test User')).toBeInTheDocument();
  });

  it('should update when user changes', () => {
    render(<MiComponente />);

    $user.set({ id: 2, name: 'New User', isLoggedIn: true });
    // El componente debería re-renderizar con los nuevos datos
  });
});
```

---

## 🧪 Template: Test de Componente React

```tsx
// Mock nanostores FIRST
jest.mock('nanostores', () => ({
  atom: jest.fn((initialValue) => ({
    get: jest.fn(() => initialValue),
    set: jest.fn(),
    subscribe: jest.fn(() => jest.fn()),
  })),
}));

jest.mock('@nanostores/react', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useStore: jest.fn((store: any) => store?.get?.() || null),
}));

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MiComponente } from '../MiComponente';

describe('MiComponente', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render correctly', () => {
    render(<MiComponente />);

    // Buscar por texto
    expect(screen.getByText('Hola Mundo')).toBeInTheDocument();

    // Buscar por rol
    expect(screen.getByRole('button')).toBeInTheDocument();

    // Buscar por placeholder
    expect(screen.getByPlaceholderText('Buscar...')).toBeInTheDocument();
  });

  it('should handle user interaction', () => {
    const mockOnClick = jest.fn();
    render(<MiComponente onClick={mockOnClick} />);

    const button = screen.getByRole('button');
    fireEvent.click(button);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
  });

  it('should handle async operations', async () => {
    render(<MiComponente />);

    await waitFor(() => {
      expect(screen.getByText('Loaded')).toBeInTheDocument();
    });
  });
});
```

---

## 🌐 Template: Componente con WebSocket

Para componentes que dependen de WebSocket (actualización en tiempo real):

```tsx
// Mock nanostores FIRST
jest.mock('nanostores', () => ({
  atom: jest.fn((initialValue) => ({
    get: jest.fn(() => initialValue),
    set: jest.fn(),
    subscribe: jest.fn(() => jest.fn()),
  })),
}));

jest.mock('@nanostores/react', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useStore: jest.fn((store: any) => store?.get?.() || null),
}));

// Mock the hook that uses WebSocket
jest.mock('@bands/_hooks/useBandMembers');

import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BandMembers } from '../BandMembers';
import { useBandMembers } from '@bands/_hooks/useBandMembers';
import type { BandMember } from '@bands/_hooks/useBandMembers';

const mockUseBandMembers = useBandMembers as jest.MockedFunction<
  typeof useBandMembers
>;

// Wrapper para React Query
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = 'QueryClientWrapper';
  return Wrapper;
};

const mockMembers: BandMember[] = [
  {
    id: 1,
    userId: 1,
    bandId: 100,
    role: 'Guitarrista',
    active: true,
    isAdmin: true,
    user: {
      id: 1,
      name: 'Test User',
      email: 'test@test.com',
      phone: '+1234567890',
    },
  },
];

describe('BandMembers - WebSocket Integration', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Real-time Updates', () => {
    it('should use hook with correct bandId', () => {
      mockUseBandMembers.mockReturnValue({
        data: mockMembers,
        isLoading: false,
        error: null,
        isSuccess: true,
        isError: false,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      render(<BandMembers bandId={100} />, { wrapper: createWrapper() });

      expect(mockUseBandMembers).toHaveBeenCalledWith(100);
    });

    it('should handle real-time member updates via WebSocket', async () => {
      // Simular actualización en tiempo real
      const initialMembers = [mockMembers[0]];
      const updatedMembers = [...mockMembers, { ...mockMembers[0], id: 2 }];

      mockUseBandMembers.mockReturnValueOnce({
        data: initialMembers,
        isLoading: false,
        error: null,
        isSuccess: true,
        isError: false,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      const { rerender } = render(<BandMembers bandId={100} />, {
        wrapper: createWrapper(),
      });

      expect(screen.getByText('1 miembro')).toBeInTheDocument();

      // Simular actualización de WebSocket
      mockUseBandMembers.mockReturnValueOnce({
        data: updatedMembers,
        isLoading: false,
        error: null,
        isSuccess: true,
        isError: false,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      rerender(<BandMembers bandId={100} />);

      await waitFor(() => {
        expect(screen.getByText('2 miembros')).toBeInTheDocument();
      });
    });

    it('should re-fetch when bandId changes', () => {
      mockUseBandMembers.mockReturnValue({
        data: mockMembers,
        isLoading: false,
        error: null,
        isSuccess: true,
        isError: false,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      const { rerender } = render(<BandMembers bandId={100} />, {
        wrapper: createWrapper(),
      });

      expect(mockUseBandMembers).toHaveBeenCalledWith(100);

      rerender(<BandMembers bandId={200} />);

      expect(mockUseBandMembers).toHaveBeenCalledWith(200);
    });
  });

  describe('Loading and Error States', () => {
    it('should display spinner while loading', () => {
      mockUseBandMembers.mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
        isSuccess: false,
        isError: false,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      render(<BandMembers bandId={100} />, { wrapper: createWrapper() });

      // NextUI Spinner usa aria-label="Loading"
      expect(screen.getByLabelText('Loading')).toBeInTheDocument();
    });

    it('should display error message when fetch fails', () => {
      mockUseBandMembers.mockReturnValue({
        data: undefined,
        isLoading: false,
        error: new Error('Network error'),
        isSuccess: false,
        isError: true,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      render(<BandMembers bandId={100} />, { wrapper: createWrapper() });

      expect(
        screen.getByText('Error al cargar los miembros'),
      ).toBeInTheDocument();
    });
  });
});
```

---

## 🪝 Template: Test de Custom Hook

```tsx
import { renderHook, waitFor } from '@testing-library/react';
import { useMiHook } from '../useMiHook';

describe('useMiHook', () => {
  it('should return initial value', () => {
    const { result } = renderHook(() => useMiHook());

    expect(result.current.value).toBe('initial');
  });

  it('should update value on action', () => {
    const { result } = renderHook(() => useMiHook());

    act(() => {
      result.current.updateValue('new value');
    });

    expect(result.current.value).toBe('new value');
  });

  it('should handle async operations', async () => {
    const { result } = renderHook(() => useMiHook());

    act(() => {
      result.current.fetchData();
    });

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.data).toBeDefined();
  });
});
```

## ⚙️ Template: Test de Función Utilitaria

```typescript
import { miFuncion } from '../miFuncion';

describe('miFuncion', () => {
  it('should handle normal case', () => {
    const result = miFuncion('input');
    expect(result).toBe('expected output');
  });

  it('should handle edge case', () => {
    const result = miFuncion('');
    expect(result).toBe('');
  });

  it('should throw error on invalid input', () => {
    expect(() => miFuncion(null)).toThrow();
  });
});
```

## 🔌 Template: Test de Servicio/API con React Query

```tsx
// Mock nanostores FIRST
jest.mock('nanostores', () => ({
  atom: jest.fn((initialValue) => ({
    get: jest.fn(() => initialValue),
    set: jest.fn(),
    subscribe: jest.fn(() => jest.fn()),
  })),
}));

jest.mock('@nanostores/react', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useStore: jest.fn((store: any) => store?.get?.() || null),
}));

// Mock fetchAPI
jest.mock('@/global/utils/fetchAPI');

import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useMiServicio } from '../miServicio';
import { fetchAPI } from '@/global/utils/fetchAPI';

const mockedFetchAPI = fetchAPI as jest.MockedFunction<typeof fetchAPI>;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = 'QueryClientWrapper';
  return Wrapper;
};

describe('useMiServicio', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should fetch data successfully', async () => {
    const mockData = { id: 1, name: 'Test' };
    mockedFetchAPI.mockResolvedValueOnce(mockData);

    const { result } = renderHook(() => useMiServicio({ id: '1' }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isSuccess).toBe(true));

    expect(result.current.data).toEqual(mockData);
  });

  it('should handle errors', async () => {
    const mockError = new Error('Failed');
    mockedFetchAPI.mockRejectedValueOnce(mockError);

    const { result } = renderHook(() => useMiServicio({ id: '1' }), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isError).toBe(true));

    expect(result.current.error).toBeDefined();
  });
});
```

---

## 🎭 Template: Mock de Módulos Comunes

### Mock de Next.js Router

```typescript
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    back: jest.fn(),
    pathname: '/',
    query: {},
  })),
  usePathname: jest.fn(() => '/'),
  useSearchParams: jest.fn(() => new URLSearchParams()),
}));
```

### Mock de Toast

```typescript
jest.mock('react-hot-toast', () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
    loading: jest.fn(),
  },
}));
```

### Mock de Fetch API

```typescript
jest.mock('@/global/utils/fetchAPI', () => ({
  fetchAPI: jest.fn(),
}));
```

### Mock de localStorage

```typescript
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock as any;
```

## 📋 Queries Comunes de Testing Library

```typescript
// Por texto
screen.getByText('Texto exacto');
screen.getByText(/texto parcial/i); // case insensitive

// Por rol (preferido)
screen.getByRole('button');
screen.getByRole('button', { name: 'Enviar' });
screen.getByRole('heading', { level: 2 });

// Por placeholder
screen.getByPlaceholderText('Ingresa tu email');

// Por label
screen.getByLabelText('Email');

// Por aria-label
screen.getByLabelText('Loading'); // Para spinners, íconos, etc.

// Por test id (último recurso)
screen.getByTestId('mi-elemento');

// Queries que NO fallan si no encuentran
screen.queryByText('Puede no existir'); // retorna null si no existe

// Queries para múltiples elementos
screen.getAllByRole('listitem');

// Queries asíncronas
await screen.findByText('Aparece después'); // espera hasta 1000ms
```

---

## 🎯 Assertions Comunes

```typescript
// Existencia
expect(element).toBeInTheDocument();
expect(element).not.toBeInTheDocument();

// Visibilidad
expect(element).toBeVisible();
expect(element).not.toBeVisible();

// Clases
expect(element).toHaveClass('active');
expect(element).toHaveClass('bg-white', 'text-black'); // múltiples clases

// Atributos
expect(element).toHaveAttribute('disabled');
expect(element).toHaveAttribute('type', 'submit');
expect(input).toHaveValue('texto');

// Contenido
expect(element).toHaveTextContent('texto');
expect(element).toHaveTextContent(/texto/i);

// Llamadas a funciones
expect(mockFn).toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledTimes(2);
expect(mockFn).toHaveBeenCalledWith('argumento');
expect(mockFn).toHaveBeenLastCalledWith('último argumento');

// Valores
expect(value).toBe(expected); // igualdad estricta ===
expect(obj).toEqual(expected); // igualdad profunda
expect(array).toContain(item);
expect(array).toHaveLength(3);
expect(string).toMatch(/regex/);

// Promesas
await expect(promise).resolves.toBe(value);
await expect(promise).rejects.toThrow(Error);

// Números
expect(number).toBeGreaterThan(5);
expect(number).toBeLessThan(10);
expect(number).toBeCloseTo(5.5, 1); // con precisión
```

---

## 🎨 NextUI Components - Queries Especiales

### Spinner

```tsx
// NextUI Spinner usa aria-label="Loading"
expect(screen.getByLabelText('Loading')).toBeInTheDocument();

// NO usar:
// expect(screen.getByRole('progressbar')).toBeInTheDocument(); // ❌
```

### Button

```tsx
// Por texto
const button = screen.getByRole('button', { name: 'Enviar' });

// Por aria-label (para botones con solo ícono)
const iconButton = screen.getByLabelText('Editar');
```

### Modal

```tsx
// Verificar que el modal esté abierto
expect(screen.getByRole('dialog')).toBeInTheDocument();

// Buscar contenido del modal
expect(screen.getByText('Título del Modal')).toBeInTheDocument();
```

### Input

```tsx
// Por label
const input = screen.getByLabelText('Email');

// Por placeholder
const input = screen.getByPlaceholderText('Ingresa tu email');

// Verificar valor
expect(input).toHaveValue('test@example.com');
```

### Chip

```tsx
// Por texto
expect(screen.getByText('Admin')).toBeInTheDocument();

// Múltiples chips
const chips = screen.getAllByText(/Admin|Eventos/);
expect(chips).toHaveLength(2);
```

### User Component (Avatar + Name)

```tsx
// Buscar por el nombre del usuario
expect(screen.getByText('John Doe')).toBeInTheDocument();

// El avatar generalmente contiene la inicial
expect(screen.getByText('J')).toBeInTheDocument(); // inicial en avatar
```

---

## 🔥 User Events vs FireEvent

```typescript
import userEvent from '@testing-library/user-event';

// Preferir userEvent (más realista)
const user = userEvent.setup();
await user.click(button);
await user.type(input, 'texto');
await user.clear(input);
await user.selectOptions(select, 'opcion1');

// FireEvent (más directo, menos realista)
fireEvent.click(button);
fireEvent.change(input, { target: { value: 'texto' } });
```

## 📝 Ejemplo Completo: Formulario

```tsx
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { LoginForm } from '../LoginForm';

describe('LoginForm', () => {
  it('should submit form with correct data', async () => {
    const mockOnSubmit = jest.fn();
    const user = userEvent.setup();

    render(<LoginForm onSubmit={mockOnSubmit} />);

    // Llenar el formulario
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');

    // Enviar formulario
    const submitButton = screen.getByRole('button', { name: /login/i });
    await user.click(submitButton);

    // Verificar
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  it('should show validation errors', async () => {
    const user = userEvent.setup();
    render(<LoginForm onSubmit={jest.fn()} />);

    const submitButton = screen.getByRole('button', { name: /login/i });
    await user.click(submitButton);

    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
  });
});
```

# Adiciones a TEST_TEMPLATES.md

## 💡 Mejores Prácticas del Proyecto

### 1. Estructura de Tests

Organiza tus tests por funcionalidad, no por tipo:

```tsx
describe('BandMembers', () => {
  describe('Loading State', () => {
    it('should display spinner while loading', () => {...});
  });

  describe('Error State', () => {
    it('should display error message when fetch fails', () => {...});
  });

  describe('Success State - Members Display', () => {
    it('should render member list correctly', () => {...});
    it('should display member roles correctly', () => {...});
  });

  describe('Admin Features', () => {
    it('should show invite button when user is admin', () => {...});
  });

  describe('WebSocket Integration', () => {
    it('should handle real-time updates', () => {...});
  });

  describe('Accessibility', () => {
    it('should have proper aria-labels', () => {...});
  });

  describe('Edge Cases', () => {
    it('should handle null values', () => {...});
  });
});
```

### 2. Setup y Teardown

```tsx
describe('MiComponente', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset stores
    $user.set(defaultUserState);
    // Mock console para reducir ruido
    jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  // Tests...
});
```

### 3. Nombres Descriptivos

```tsx
// ✅ BUENO
it('should display error message when network fails', () => {...});
it('should update member list when new member joins via WebSocket', () => {...});
it('should prevent admin removal when only one admin exists', () => {...});

// ❌ MALO
it('works', () => {...});
it('test error', () => {...});
it('updates correctly', () => {...});
```

### 4. Datos de Prueba Reusables

```tsx
const mockMembers: BandMember[] = [
  {
    id: 1,
    userId: 1,
    bandId: 100,
    role: 'Guitarrista',
    active: true,
    isAdmin: true,
    user: {
      id: 1,
      name: 'Test User',
      email: 'test@test.com',
      phone: '+1234567890',
    },
  },
  // ... más miembros
];

// Helper functions
const createMockUser = (overrides?: Partial<LoggedUser>): LoggedUser => ({
  id: 1,
  name: 'Test User',
  isLoggedIn: true,
  ...overrides,
});
```

### 5. Testing de Estados Async

```tsx
it('should handle async operations', async () => {
  render(<MiComponente />);

  // Esperar a que aparezca el loading
  expect(screen.getByLabelText('Loading')).toBeInTheDocument();

  // Esperar a que desaparezca y aparezca el contenido
  await waitFor(() => {
    expect(screen.queryByLabelText('Loading')).not.toBeInTheDocument();
    expect(screen.getByText('Contenido Cargado')).toBeInTheDocument();
  });
});
```

### 6. Testing de Interacciones

```tsx
it('should open modal when clicking button', async () => {
  const user = userEvent.setup();
  render(<MiComponente />);

  const button = screen.getByRole('button', { name: 'Abrir Modal' });
  await user.click(button);

  // Verificar que el modal se abrió
  expect(screen.getByRole('dialog')).toBeInTheDocument();
  expect(screen.getByText('Título del Modal')).toBeInTheDocument();
});
```

### 7. Coverage Importante

Asegúrate de cubrir:

- ✅ Estados de carga (loading, success, error)
- ✅ Interacciones del usuario (clicks, inputs)
- ✅ Actualizaciones en tiempo real (WebSocket)
- ✅ Permisos y autorización (admin, user)
- ✅ Casos extremos (valores null, arrays vacíos, nombres largos)
- ✅ Accesibilidad (aria-labels, roles)

---

## 🐛 Debugging de Tests

### Ver el HTML renderizado

```tsx
import { screen } from '@testing-library/react';

it('debugging test', () => {
  render(<MiComponente />);

  // Ver todo el árbol DOM
  screen.debug();

  // Ver un elemento específico
  const element = screen.getByText('Test');
  screen.debug(element);
});
```

### Logs útiles

```tsx
it('debugging test', () => {
  const { container } = render(<MiComponente />);

  // Ver el HTML
  console.log(container.innerHTML);

  // Ver queries disponibles
  console.log(screen.logTestingPlaygroundURL());
});
```

### Queries que fallan

```tsx
// Si getByText falla, prueba:
screen.getByText('texto', { exact: false }); // coincidencia parcial
screen.getByText(/texto/i); // regex case-insensitive

// Ver todos los roles disponibles
screen.logTestingPlaygroundURL(); // abre una URL con info útil
```

---

## 🚀 Comandos Útiles

```bash
# Ejecutar todos los tests
npm test

# Ejecutar un archivo específico
npm test -- BandMembers.test.tsx

# Ejecutar en modo watch
npm test -- --watch

# Ver coverage
npm test -- --coverage

# Ver coverage de un archivo específico
npm test -- --coverage --collectCoverageFrom="src/app/**/BandMembers.tsx"

# Ejecutar tests que coincidan con un patrón
npm test -- --testNamePattern="WebSocket"

# Modo verbose (más información)
npm test -- --verbose

# Actualizar snapshots
npm test -- -u
```

---

## 📚 Referencias

- [Testing Library Docs](https://testing-library.com/docs/react-testing-library/intro/)
- [Jest Docs](https://jestjs.io/docs/getting-started)
- [Common mistakes with React Testing Library](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [NextUI Testing Guide](https://nextui.org/docs/guide/testing)

---

## ✅ Checklist para Nuevos Tests

Antes de crear un test, verifica:

- [ ] ¿Mockeaste `nanostores` PRIMERO?
- [ ] ¿Mockeaste `@nanostores/react` SEGUNDO?
- [ ] ¿Mockeaste otros módulos TERCERO?
- [ ] ¿Usaste inline factory para stores?
- [ ] ¿Importaste DESPUÉS de los mocks?
- [ ] ¿Agregaste `displayName` a los wrappers?
- [ ] ¿Usaste `// eslint-disable-next-line` para `as any`?
- [ ] ¿Limpiaste mocks en `beforeEach`?
- [ ] ¿Nombres de tests descriptivos?
- [ ] ¿Cubriste estados de loading/error/success?
- [ ] ¿Probaste las interacciones WebSocket?
- [ ] ¿Incluiste tests de accesibilidad?
- [ ] ¿Probaste casos extremos?

---

**Última actualización**: Noviembre 8, 2025
