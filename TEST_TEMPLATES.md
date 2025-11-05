# Templates para Testing

Este archivo contiene plantillas/templates para diferentes tipos de tests.

## 🧪 Template: Test de Componente React

```tsx
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
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useMiServicio } from '../miServicio';
import { fetchAPI } from '@/global/utils/fetchAPI';

jest.mock('@/global/utils/fetchAPI');

const mockedFetchAPI = fetchAPI as jest.MockedFunction<typeof fetchAPI>;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
    },
  });
  // eslint-disable-next-line react/display-name
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
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

// Por placeholder
screen.getByPlaceholderText('Ingresa tu email');

// Por label
screen.getByLabelText('Email');

// Por test id (último recurso)
screen.getByTestId('mi-elemento');

// Queries que NO fallan si no encuentran
screen.queryByText('Puede no existir');

// Queries para múltiples elementos
screen.getAllByRole('listitem');

// Queries asíncronas
await screen.findByText('Aparece después'); // espera hasta 1000ms
```

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

// Atributos
expect(element).toHaveAttribute('disabled');
expect(input).toHaveValue('texto');

// Contenido
expect(element).toHaveTextContent('texto');

// Llamadas a funciones
expect(mockFn).toHaveBeenCalled();
expect(mockFn).toHaveBeenCalledTimes(2);
expect(mockFn).toHaveBeenCalledWith('argumento');

// Valores
expect(value).toBe(expected); // igualdad estricta ===
expect(obj).toEqual(expected); // igualdad profunda
expect(array).toContain(item);
expect(array).toHaveLength(3);
```

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
