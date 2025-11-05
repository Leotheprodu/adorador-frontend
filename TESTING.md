# Testing en Adorador Frontend

## 📋 Configuración

Este proyecto usa **Jest** y **React Testing Library** para testing.

### Instalación

Las dependencias ya están instaladas. Si necesitas reinstalar:

```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event jest-environment-jsdom @types/jest
```

## 🚀 Comandos

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch (reejecutar automáticamente al cambiar archivos)
npm run test:watch

# Ejecutar tests con reporte de cobertura
npm run test:coverage
```

## 📁 Estructura de Tests

Los tests están **co-ubicados** con el código que testean en carpetas `__tests__`:

```
src/
├── app/
│   ├── (private)/
│   │   └── admin/
│   │       ├── _components/
│   │       │   ├── ComponenteA.tsx
│   │       │   └── __tests__/
│   │       │       └── ComponenteA.test.tsx
│   │       ├── _hooks/
│   │       │   ├── useCustomHook.tsx
│   │       │   └── __tests__/
│   │       │       └── useCustomHook.test.tsx
│   │       ├── _services/
│   │       │   └── __tests__/
│   │       └── _utils/
│   │           └── __tests__/
│   └── (public)/
│       └── grupos/
│           ├── _components/
│           │   └── __tests__/
│           └── _utils/
│               └── __tests__/
└── global/
    ├── utils/
    │   ├── dataFormat.ts
    │   └── __tests__/
    │       └── dataFormat.test.ts
    ├── services/
    │   └── __tests__/
    └── hooks/
        └── __tests__/
```

## 📝 Convenciones de Nombres

- **Archivos de test**: `NombreArchivo.test.tsx` o `NombreArchivo.test.ts`
- **Carpeta de tests**: `__tests__/` dentro de cada módulo
- **Tests de componentes**: `ComponentName.test.tsx`
- **Tests de hooks**: `useHookName.test.tsx`
- **Tests de utils**: `utilFunction.test.ts`
- **Tests de services**: `serviceName.test.tsx`

## 🧪 Tipos de Tests

### 1. Tests de Utilidades (Utils)

**Ejemplo**: `src/global/utils/__tests__/dataFormat.test.ts`

```typescript
import { moneyFormat, formatNumber } from '../dataFormat';

describe('dataFormat utils', () => {
  describe('moneyFormat', () => {
    it('should format number as Costa Rican currency', () => {
      const result = moneyFormat(1000);
      expect(result).toContain('1');
      expect(result).toContain('000');
    });
  });
});
```

### 2. Tests de Componentes

**Ejemplo**: `src/global/utils/__tests__/Spinner.test.tsx`

```typescript
import { render } from '@testing-library/react';
import { Spinner } from '../Spinner';

describe('Spinner Component', () => {
  it('should render spinner container', () => {
    const { container } = render(<Spinner />);
    const spinnerGrid = container.querySelector('.sk-cube-grid');
    expect(spinnerGrid).toBeInTheDocument();
  });
});
```

### 3. Tests de Hooks

**Ejemplo**: `src/global/hooks/__tests__/useIsClient.test.tsx`

```typescript
import { renderHook } from '@testing-library/react';
import { useIsClient } from '../useIsClient';

describe('useIsClient Hook', () => {
  it('should return false initially (SSR)', () => {
    const { result } = renderHook(() => useIsClient());
    expect(result.current).toBe(false);
  });
});
```

### 4. Tests de Servicios/API

**Ejemplo**: `src/global/services/__tests__/HandleAPI.test.tsx`

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { FetchData } from '../HandleAPI';
import { fetchAPI } from '@global/utils/fetchAPI';

jest.mock('@global/utils/fetchAPI');

const mockedFetchAPI = fetchAPI as jest.MockedFunction<typeof fetchAPI>;

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  // eslint-disable-next-line react/display-name
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('HandleAPI - FetchData', () => {
  it('should fetch data successfully', async () => {
    const mockData = { id: 1, name: 'Test' };
    mockedFetchAPI.mockResolvedValueOnce(mockData);

    const { result } = renderHook(
      () => FetchData({ key: 'test-key', url: '/api/test' }),
      { wrapper: createWrapper() }
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
    expect(result.current.data).toEqual(mockData);
  });
});
```

## 🛠️ Herramientas Disponibles

### React Testing Library

- `render()`: Renderizar componentes
- `screen`: Consultar elementos renderizados
- `fireEvent`: Simular eventos del usuario
- `userEvent`: Simular interacciones más realistas
- `waitFor()`: Esperar cambios asíncronos
- `renderHook()`: Testear custom hooks

### Jest Matchers

- `expect(value).toBe(expected)`: Igualdad estricta
- `expect(value).toEqual(expected)`: Igualdad profunda
- `expect(element).toBeInTheDocument()`: Elemento en el DOM
- `expect(element).toHaveClass('class-name')`: Verificar clases CSS
- `expect(fn).toHaveBeenCalled()`: Verificar llamadas a mocks
- `expect(fn).toHaveBeenCalledWith(args)`: Verificar argumentos

## 🎯 Mejores Prácticas

### 1. Estructura de Tests (AAA Pattern)

```typescript
it('should do something', () => {
  // Arrange: Preparar datos y mocks
  const mockData = { id: 1 };

  // Act: Ejecutar la acción
  const result = myFunction(mockData);

  // Assert: Verificar resultados
  expect(result).toBe(expected);
});
```

### 2. Describe Blocks

Agrupa tests relacionados:

```typescript
describe('ComponentName', () => {
  describe('when user is logged in', () => {
    it('should show user menu', () => {
      // test
    });
  });

  describe('when user is logged out', () => {
    it('should show login button', () => {
      // test
    });
  });
});
```

### 3. Setup y Teardown

```typescript
describe('MyComponent', () => {
  beforeEach(() => {
    // Se ejecuta antes de cada test
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Se ejecuta después de cada test
    cleanup();
  });
});
```

### 4. Mocking

```typescript
// Mock de módulo completo
jest.mock('@/global/utils/fetchAPI');

// Mock de función específica
const mockFn = jest.fn();

// Implementación de mock
mockedFetchAPI.mockResolvedValueOnce(data);
mockedFetchAPI.mockRejectedValueOnce(error);
```

### 5. Tests Asíncronos

```typescript
it('should handle async operations', async () => {
  const { result } = renderHook(() => useAsyncHook());

  await waitFor(() => {
    expect(result.current.isLoading).toBe(false);
  });

  expect(result.current.data).toBeDefined();
});
```

## 📊 Cobertura de Código

```bash
npm run test:coverage
```

Esto generará un reporte en `coverage/` mostrando:

- % de líneas cubiertas
- % de funciones cubiertas
- % de branches cubiertas
- Archivos sin cobertura

## 🚫 Archivos Ignorados

Los siguientes archivos NO se incluyen en los tests:

- `node_modules/`
- `.next/`
- `*.d.ts` (archivos de definición de tipos)
- `*.stories.*` (archivos de Storybook)
- `__tests__/` (en el reporte de cobertura)

## 🔗 Recursos

- [Jest Documentation](https://jestjs.io/)
- [React Testing Library](https://testing-library.com/react)
- [Testing Library Best Practices](https://kentcdodds.com/blog/common-mistakes-with-react-testing-library)
- [Jest Matchers](https://jestjs.io/docs/expect)

## 💡 Tips

1. **Escribe tests legibles**: El nombre del test debe describir qué hace
2. **Un concepto por test**: Cada test debe verificar una sola cosa
3. **No testees detalles de implementación**: Testea comportamiento, no código interno
4. **Usa data-testid con moderación**: Prefiere consultar por texto o role
5. **Mockea dependencias externas**: APIs, servicios, módulos de terceros
6. **Tests deben ser independientes**: No deben depender del orden de ejecución

## 🆘 Problemas Comunes

### Error: "Cannot find module"

Verifica que los paths en `jest.config.js` estén correctos:

```javascript
moduleNameMapper: {
  '^@/(.*)$': '<rootDir>/src/$1',
}
```

### Error: "window is not defined"

Asegúrate de usar `testEnvironment: 'jest-environment-jsdom'` en `jest.config.js`

### Error con Next.js components

Los mocks de Next.js están en `jest.setup.js`. Asegúrate de que esté configurado correctamente.
