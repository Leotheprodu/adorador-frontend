# Tests de Invalidación de Queries - Resumen

## 📊 Estado de los Tests

### ✅ Tests Nuevos Agregados

Se crearon 4 nuevas suites de tests con **17 tests en total**, todos pasando exitosamente:

1. **AddSongButton.queryInvalidation.test.tsx** - 4 tests
2. **AddEventButton.queryInvalidation.test.tsx** - 4 tests
3. **useEditSong.queryInvalidation.test.tsx** - 4 tests
4. **useEditEvent.queryInvalidation.test.tsx** - 5 tests

### 📈 Métricas

- **Antes**: 56 suites pasando, 933 tests pasando
- **Después**: 60 suites pasando, 950 tests pasando
- **Nuevos**: +4 suites, +17 tests

---

## 🧪 Cobertura de Tests

### 1. AddSongButton (Crear Canción)

**Archivo**: `src/app/(public)/grupos/_components/__tests__/AddSongButton.queryInvalidation.test.tsx`

✅ **Tests**:

- Invalida `SongsOfBand` y `BandById` después de creación exitosa
- Invalida queries ANTES de redirigir a la nueva canción
- NO invalida queries si la creación falla
- Invalida ambas queries incluso si una no está cacheada

**Queries validadas**:

- `['SongsOfBand', bandId]`
- `['BandById', bandId]`

---

### 2. AddEventButton (Crear Evento)

**Archivo**: `src/app/(public)/grupos/_components/__tests__/AddEventButton.queryInvalidation.test.tsx`

✅ **Tests**:

- Invalida `EventsOfBand` y `BandById` después de creación exitosa
- Invalida queries ANTES de redirigir al nuevo evento
- NO invalida queries si la creación falla
- Invalida ambas queries incluso navegando inmediatamente

**Queries validadas**:

- `['EventsOfBand', bandId]`
- `['BandById', bandId]`

---

### 3. useEditSong (Editar Canción)

**Archivo**: `src/app/(public)/grupos/[bandId]/canciones/_hooks/__tests__/useEditSong.queryInvalidation.test.tsx`

✅ **Tests**:

- Invalida `SongsOfBand`, `BandById` y `SongData` después de actualización exitosa
- Invalida exactamente 3 queries
- NO invalida queries si la actualización falla
- Llama a `refetch` después de invalidar queries

**Queries validadas**:

- `['SongsOfBand', bandId]`
- `['BandById', bandId]`
- `['SongData', bandId, songId]`

---

### 4. useEditEvent (Editar Evento)

**Archivo**: `src/app/(public)/grupos/[bandId]/eventos/[eventId]/_hooks/__tests__/useEditEvent.queryInvalidation.test.tsx`

✅ **Tests**:

- Invalida `EventsOfBand`, `BandById` y `Event` después de actualización exitosa
- Invalida exactamente 3 queries
- NO invalida queries si la actualización falla
- Llama a `refetch` después de invalidar queries
- Cierra el modal después de actualización exitosa

**Queries validadas**:

- `['EventsOfBand', bandId]`
- `['BandById', bandId]`
- `['Event', bandId, eventId]`

---

## 🎯 Garantías de los Tests

Estos tests aseguran que:

1. **✅ Datos Frescos**: Las queries se invalidan correctamente después de mutaciones exitosas
2. **✅ Sin Invalidaciones Innecesarias**: No se invalidan queries cuando las operaciones fallan
3. **✅ Orden Correcto**: Las invalidaciones ocurren ANTES de redirecciones
4. **✅ Cobertura Completa**: Todas las queries relevantes son invalidadas (lista + detalle + grupo)
5. **✅ Consistencia de Cache**: React Query siempre obtiene datos actualizados

---

## 🔍 Queries de React Query Mapeadas

| Operación            | Queries Invalidadas                            |
| -------------------- | ---------------------------------------------- |
| **Crear Canción**    | `SongsOfBand`, `BandById`                      |
| **Editar Canción**   | `SongsOfBand`, `BandById`, `SongData`          |
| **Eliminar Canción** | `SongsOfBand`, `BandById` _(ya implementado)_  |
| **Crear Evento**     | `EventsOfBand`, `BandById`                     |
| **Editar Evento**    | `EventsOfBand`, `BandById`, `Event`            |
| **Eliminar Evento**  | `EventsOfBand`, `BandById` _(ya implementado)_ |

---

## 🚀 Ejecución de Tests

```bash
# Ejecutar todos los tests de query invalidation
npm test -- queryInvalidation

# Ejecutar un test específico
npm test -- AddSongButton.queryInvalidation
npm test -- AddEventButton.queryInvalidation
npm test -- useEditSong.queryInvalidation
npm test -- useEditEvent.queryInvalidation
```

---

## 📝 Notas

- Los tests usan mocks para simular React Query y Next.js router
- Se verifica el orden de ejecución (invalidar → redirigir)
- Se validan tanto casos de éxito como de error
- Todos los tests pasan exitosamente ✅
