# Tests del Componente BandMembers - Resumen de Implementación

## 📋 Resumen

Se crearon **26 tests** completos para el componente `BandMembers.tsx` que garantizan su correcto funcionamiento, incluyendo la integración con WebSocket para actualizaciones en tiempo real.

## ✅ Tests Implementados (26/26 pasando)

### 1. Loading State (1 test)

- ✅ Muestra spinner mientras carga

### 2. Error State (1 test)

- ✅ Muestra mensaje de error cuando falla la petición

### 3. Success State - Members Display (7 tests)

- ✅ Renderiza la lista de miembros correctamente
- ✅ Muestra los roles de los miembros
- ✅ Muestra badge de admin para administradores
- ✅ Muestra badge de eventos para event managers
- ✅ Marca al usuario actual con chip "Tú"
- ✅ Maneja correctamente un solo miembro
- ✅ Muestra estado vacío cuando no hay miembros

### 4. Admin Features (6 tests)

- ✅ Muestra botón "Invitar miembro" cuando el usuario es admin
- ✅ No muestra botón "Invitar miembro" cuando el usuario NO es admin
- ✅ Abre InviteMemberModal al hacer clic en invitar
- ✅ Muestra botón de edición para cada miembro cuando es admin
- ✅ No muestra botones de edición cuando NO es admin
- ✅ Abre EditMemberModal al hacer clic en editar

### 5. WebSocket Integration (3 tests)

- ✅ Usa el hook useBandMembers con el bandId correcto
- ✅ Re-obtiene miembros cuando cambia el bandId
- ✅ Maneja actualizaciones en tiempo real vía WebSocket

### 6. User Interface (3 tests)

- ✅ Muestra UsersIcon en el header
- ✅ Aplica estilos correctos al card
- ✅ Renderiza cards de miembros con efecto hover

### 7. Accessibility (2 tests)

- ✅ Tiene aria-labels apropiados para botones de edición
- ✅ Mantiene jerarquía de headings correcta

### 8. Edge Cases (3 tests)

- ✅ Maneja miembros con email null
- ✅ Maneja miembros sin roles de admin o event manager
- ✅ Maneja nombres de miembros muy largos

## 🔑 Aspectos Importantes del Código de Tests

### Mock de Nanostores (CRÍTICO)

```tsx
// SIEMPRE en este orden:
// 1. Mock nanostores PRIMERO
jest.mock('nanostores', () => ({...}));
jest.mock('@nanostores/react', () => ({...}));

// 2. Mock otros módulos
jest.mock('@bands/_hooks/useBandMembers');

// 3. Mock stores con inline factory
jest.mock('@global/stores/users', () => {...});

// 4. DESPUÉS los imports
import { BandMembers } from '../BandMembers';
```

### Wrapper para React Query

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

### Testing de WebSocket

```tsx
it('should handle real-time member updates via WebSocket', async () => {
  // Simular datos iniciales
  mockUseBandMembers.mockReturnValueOnce({ data: initialMembers, ... });
  const { rerender } = render(<BandMembers bandId={100} />);

  // Simular actualización de WebSocket
  mockUseBandMembers.mockReturnValueOnce({ data: updatedMembers, ... });
  rerender(<BandMembers bandId={100} />);

  // Verificar cambios
  await waitFor(() => {
    expect(screen.getByText('2 miembros')).toBeInTheDocument();
  });
});
```

### NextUI Spinner

```tsx
// ✅ CORRECTO - NextUI usa aria-label
expect(screen.getByLabelText('Loading')).toBeInTheDocument();

// ❌ INCORRECTO - No funciona con NextUI
expect(screen.getByRole('progressbar')).toBeInTheDocument();
```

## 📚 Documento de Plantillas Actualizado

Se actualizó **TEST_TEMPLATES.md** con:

1. **Reglas Importantes**

   - Orden obligatorio de mocks
   - Cómo evitar `as any` correctamente
   - displayName en wrappers

2. **Mock de Nanostores (Sección Completa)**

   - Mock básico de nanostores
   - Mock de stores con inline factory
   - Ejemplos completos de setup

3. **Template de Componente con WebSocket**

   - Setup completo
   - Tests de actualizaciones en tiempo real
   - Manejo de estados loading/error

4. **NextUI Components - Queries Especiales**

   - Spinner (aria-label="Loading")
   - Button (con y sin texto)
   - Modal (role="dialog")
   - Input, Chip, User component

5. **Mejores Prácticas del Proyecto**

   - Estructura de tests
   - Setup y teardown
   - Nombres descriptivos
   - Datos de prueba reusables
   - Coverage importante

6. **Debugging de Tests**

   - Ver HTML renderizado
   - Logs útiles
   - Queries que fallan

7. **Comandos Útiles**

   - npm test con diferentes opciones
   - Coverage
   - Watch mode
   - Verbose

8. **Checklist para Nuevos Tests**
   - Lista de verificación antes de crear tests

## 🎯 Cobertura de Tests

El componente BandMembers tiene cobertura completa de:

- ✅ **Estados**: Loading, Error, Success, Empty
- ✅ **Interacciones**: Clicks, modals, botones
- ✅ **Permisos**: Admin vs usuario regular
- ✅ **WebSocket**: Actualizaciones en tiempo real
- ✅ **UI**: Estilos, iconos, badges, chips
- ✅ **Accesibilidad**: aria-labels, roles, headings
- ✅ **Edge Cases**: Valores null, arrays vacíos, datos inusuales

## 📁 Archivos Creados/Modificados

### Creados:

- `src/app/(public)/grupos/[bandId]/_components/__tests__/BandMembers.test.tsx` (540 líneas)

### Modificados:

- `TEST_TEMPLATES.md` (ampliado significativamente con mejores prácticas)

## 🚀 Para Ejecutar los Tests

```bash
# Ejecutar solo los tests de BandMembers
npm test -- BandMembers.test.tsx

# Con coverage
npm test -- BandMembers.test.tsx --coverage

# En modo watch
npm test -- BandMembers.test.tsx --watch
```

## 📖 Referencias para el Futuro

Cuando necesites crear nuevos tests:

1. **Consulta** `TEST_TEMPLATES.md` para ver ejemplos
2. **Sigue** el orden de mocks (nanostores PRIMERO)
3. **Usa** el checklist al final del documento
4. **Revisa** los tests de BandMembers como referencia para componentes con WebSocket

---

**Fecha**: Noviembre 8, 2025
**Tests creados**: 26
**Tests pasando**: 26 ✅
**Cobertura**: Completa
