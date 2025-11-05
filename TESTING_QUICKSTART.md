# 🎯 Testing - Guía de Inicio Rápido

## ✨ Ya está todo configurado!

Tu proyecto ahora tiene **Jest + React Testing Library** completamente configurado con **18 tests pasando** ✅

## 🚀 Comandos Rápidos

```bash
# Ejecutar todos los tests
npm test

# Modo desarrollo (auto-reload al guardar archivos)
npm run test:watch

# Ver reporte de cobertura
npm run test:coverage
```

## 📁 Dónde crear tests

Cada módulo tiene su carpeta `__tests__/`:

```
src/
├── app/
│   ├── (private)/
│   │   └── admin/
│   │       ├── _components/__tests__/     👈 Tests de componentes de admin
│   │       ├── _hooks/__tests__/          👈 Tests de hooks de admin
│   │       ├── _services/__tests__/       👈 Tests de servicios de admin
│   │       └── _utils/__tests__/          👈 Tests de utilidades de admin
│   └── (public)/
│       ├── grupos/
│       │   ├── _components/__tests__/     👈 Tests de componentes de grupos
│       │   └── _utils/__tests__/          👈 Tests de utilidades de grupos
│       └── auth/
│           └── login/__tests__/           👈 Tests del módulo de login
└── global/
    ├── utils/__tests__/       ✅ YA TIENE TESTS
    ├── hooks/__tests__/       ✅ YA TIENE TESTS
    └── services/__tests__/    ✅ YA TIENE TESTS
```

## 📝 Cómo crear un test nuevo

### 1. Crea el archivo

En la carpeta `__tests__/` correspondiente:

```bash
# Ejemplo para un componente
src/app/(private)/admin/_components/__tests__/MiComponente.test.tsx

# Ejemplo para una utilidad
src/app/(private)/admin/_utils/__tests__/miUtilidad.test.ts
```

### 2. Usa una plantilla

Abre `TEST_TEMPLATES.md` y copia la plantilla que necesites:

- 🧪 Test de Componente
- 🪝 Test de Hook
- ⚙️ Test de Función
- 🔌 Test de Servicio/API

### 3. Adapta el test a tu código

**Ejemplo simple:**

```typescript
import { miFuncion } from '../miFuncion';

describe('miFuncion', () => {
  it('should return correct result', () => {
    const result = miFuncion('input');
    expect(result).toBe('expected output');
  });
});
```

### 4. Ejecuta en modo watch

```bash
npm run test:watch
```

¡Y listo! Ahora cada vez que guardes, los tests se ejecutan automáticamente 🔄

## 📚 Documentación Disponible

- **`TESTING.md`** - Guía completa de testing (configuración, mejores prácticas, etc.)
- **`TEST_TEMPLATES.md`** - Plantillas listas para copiar y pegar
- **`TESTING_SETUP_SUMMARY.md`** - Resumen de la implementación

## 🎓 Tests de Ejemplo Ya Implementados

### ✅ `dataFormat.test.ts`

```typescript
describe('dataFormat utils', () => {
  describe('moneyFormat', () => {
    it('should format number as Costa Rican currency', () => {
      const result = moneyFormat(1000);
      expect(result).toContain('1');
    });
  });
});
```

### ✅ `Spinner.test.tsx`

```typescript
describe('Spinner Component', () => {
  it('should render spinner container', () => {
    const { container } = render(<Spinner />);
    expect(container.querySelector('.sk-cube-grid')).toBeInTheDocument();
  });
});
```

### ✅ `useIsClient.test.tsx`

```typescript
describe('useIsClient Hook', () => {
  it('should eventually return true after mount', async () => {
    const { result } = renderHook(() => useIsClient());
    await waitFor(() => expect(result.current).toBe(true));
  });
});
```

### ✅ `HandleAPI.test.tsx`

```typescript
describe('HandleAPI - FetchData', () => {
  it('should fetch data successfully', async () => {
    const mockData = { id: 1 };
    mockedFetchAPI.mockResolvedValueOnce(mockData);

    const { result } = renderHook(
      () => FetchData({ key: 'test', url: '/api/test' }),
      { wrapper: createWrapper() },
    );

    await waitFor(() => expect(result.current.isSuccess).toBe(true));
  });
});
```

## 💡 Tips Rápidos

### ✅ DO (Hacer)

- Nombra tus tests descriptivamente: `it('should render user name when logged in')`
- Un test, un concepto
- Usa mocks para dependencias externas
- Ejecuta tests antes de hacer commit

### ❌ DON'T (No hacer)

- Tests que dependen de otros tests
- Tests que modifican estado global
- Testear detalles de implementación
- Copiar y pegar tests sin adaptarlos

## 🔍 Queries Más Usadas

```typescript
// Buscar elementos
screen.getByText('Texto'); // Por texto visible
screen.getByRole('button'); // Por rol (preferido)
screen.getByPlaceholderText('...'); // Por placeholder
screen.getByLabelText('Email'); // Por label

// Esperar cambios asíncronos
await waitFor(() => {
  expect(screen.getByText('Loaded')).toBeInTheDocument();
});

// Simular interacciones
fireEvent.click(button);
fireEvent.change(input, { target: { value: 'text' } });
```

## 📊 Assertions Más Usadas

```typescript
expect(element).toBeInTheDocument();
expect(element).toHaveTextContent('texto');
expect(element).toHaveClass('active');
expect(mockFn).toHaveBeenCalled();
expect(value).toBe(expected);
expect(obj).toEqual(expected);
```

## 🎯 Workflow Recomendado

1. **Abre el modo watch**

   ```bash
   npm run test:watch
   ```

2. **Crea tu test** (usa templates de `TEST_TEMPLATES.md`)

3. **Escribe/modifica tu código** hasta que el test pase ✅

4. **Verifica la cobertura**
   ```bash
   npm run test:coverage
   ```

## 🆘 ¿Necesitas ayuda?

1. **Consulta `TEST_TEMPLATES.md`** - Plantillas para cada tipo de test
2. **Lee `TESTING.md`** - Guía completa con ejemplos
3. **Mira los tests existentes** en `src/global/*/tests__/`

## 🎉 ¡Comienza Ahora!

```bash
# 1. Ejecuta los tests existentes para ver que todo funciona
npm test

# 2. Abre el modo watch para desarrollo
npm run test:watch

# 3. Crea tu primer test en el módulo que estés trabajando
# Usa TEST_TEMPLATES.md como guía

# 4. ¡Empieza a escribir tests! 🚀
```

---

**Recursos:**

- [Testing Library Docs](https://testing-library.com/)
- [Jest Docs](https://jestjs.io/)
- [Next.js Testing](https://nextjs.org/docs/testing)
