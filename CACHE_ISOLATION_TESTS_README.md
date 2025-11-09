# Tests de Aislamiento de Caché para React Query

## 📋 Descripción

Esta suite de tests asegura que las **query keys de React Query incluyan siempre los IDs únicos** (como `bandId`, `songId`, `eventId`) para prevenir colisiones de caché entre diferentes recursos.

## 🎯 Problema que Resuelven

### Escenario del Bug Original

Cuando un usuario:

1. Creaba un nuevo grupo o cambiaba entre grupos
2. Los datos de miembros se cargaban correctamente
3. Pero las **canciones y eventos mostraban datos del grupo anterior**

### Causa Raíz

Las query keys no incluían el `bandId`, causando que React Query usara el mismo caché para todos los grupos:

```typescript
// ❌ INCORRECTO - Todos los grupos comparten el mismo caché
key: 'BandById';
key: 'EventsOfBand';
key: 'SongsOfBand';

// ✅ CORRECTO - Cada grupo tiene su propio caché
key: ['BandById', bandId];
key: ['EventsOfBand', bandId];
key: ['SongsOfBand', bandId];
```

## 🧪 Tests Implementados

### 1. HandleAPI.test.tsx

**Ubicación:** `src/global/services/__tests__/HandleAPI.test.tsx`

Verifica que:

- `FetchData` acepta tanto strings como arrays en la propiedad `key`
- Query keys con arrays funcionan correctamente
- Diferentes IDs en query keys mantienen cachés separados
- Query keys idénticas comparten caché (comportamiento esperado)

```typescript
// Test clave
it('should cache independently when using different IDs in query key', async () => {
  // Banda 1 y Banda 2 deben tener cachés separados
  expect(result1.current.data).not.toEqual(result2.current.data);
  expect(mockedFetchAPI).toHaveBeenCalledTimes(2);
});
```

### 2. bandsService.test.tsx

**Ubicación:** `src/app/(public)/grupos/_services/__tests__/bandsService.test.tsx`

Verifica que:

- `getBandById` use `['BandById', bandId]` como query key
- Diferentes bandas mantengan cachés separados
- No haya colisión de datos entre bandas

### 3. eventsOfBandService.test.tsx

**Ubicación:** `src/app/(public)/grupos/[bandId]/eventos/_services/__tests__/eventsOfBandService.test.tsx`

Verifica que:

- `getEventsOfBand` use `['EventsOfBand', bandId]` como query key
- Eventos de diferentes bandas no se mezclen
- Los eventos de la banda 2 NO contengan eventos de la banda 1

```typescript
// Test crítico para prevenir el bug
it('should not return events from wrong band due to cache', async () => {
  expect(result2.current.data?.[0]?.title).not.toContain('Should NOT appear');
});
```

### 4. songsOfBandService.test.tsx

**Ubicación:** `src/app/(public)/grupos/[bandId]/canciones/_services/__tests__/songsOfBandService.test.tsx`

Verifica que:

- `getSongsOfBand` use `['SongsOfBand', bandId]` como query key
- Canciones de diferentes bandas no se mezclen
- Las canciones de la banda 2 NO contengan canciones de la banda 1

### 5. bandCacheIsolation.integration.test.tsx

**Ubicación:** `src/app/(public)/grupos/_services/__tests__/bandCacheIsolation.integration.test.tsx`

**Test de Integración más importante** - Simula el escenario real del usuario:

```typescript
it('should not share cache between different bands when switching bands', async () => {
  // Paso 1: Usuario entra al Grupo 1
  // Paso 2: Usuario crea/cambia al Grupo 2
  // Verificación: Grupo 2 NO debe tener datos del Grupo 1
  expect(songsResult2.current.data?.[0]?.title).toBe('Canción del Grupo 2');
  expect(eventsResult2.current.data?.[0]?.title).toBe('Evento del Grupo 2');
});
```

## 🚀 Ejecutar los Tests

```bash
# Ejecutar todos los tests de caché
npm test -- HandleAPI bandsService eventsOfBandService songsOfBandService bandCacheIsolation --watchAll=false

# Ejecutar tests individuales
npm test -- HandleAPI.test.tsx --watchAll=false
npm test -- bandsService.test.tsx --watchAll=false
npm test -- eventsOfBandService.test.tsx --watchAll=false
npm test -- songsOfBandService.test.tsx --watchAll=false
npm test -- bandCacheIsolation.integration.test.tsx --watchAll=false
```

## ⚠️ IMPORTANTE: No Modificar sin Leer

### Regla de Oro

**SIEMPRE incluir el ID del recurso en las query keys cuando el endpoint depende de un ID:**

```typescript
// ✅ CORRECTO
export const getBandById = (bandId: string) => {
  return FetchData<BandWithSongsProps>({
    key: ['BandById', bandId], // ← Incluye bandId
    url: `${Server1API}/bands/${bandId}`,
  });
};

// ❌ INCORRECTO - Causará colisiones de caché
export const getBandById = (bandId: string) => {
  return FetchData<BandWithSongsProps>({
    key: 'BandById', // ← Falta bandId
    url: `${Server1API}/bands/${bandId}`,
  });
};
```

### Servicios que DEBEN Incluir IDs

- ✅ `getBandById` → `['BandById', bandId]`
- ✅ `getEventsOfBand` → `['EventsOfBand', bandId]`
- ✅ `getSongsOfBand` → `['SongsOfBand', bandId]`
- ✅ `getEventsById` → `['Event', bandId, eventId]`
- ✅ `getSongData` → `['SongData', bandId, songId]`
- ✅ `getSongLyrics` → `['SongLyrics', bandId, songId]`
- ✅ `useBandMembers` → `['BandMembers', bandId.toString()]`

### Servicios que NO Necesitan IDs

- ✅ `getBands` → `'Bands'` (lista global)
- ✅ `getBandsOfUser` → `'BandsOfUser'` (datos del usuario actual)
- ✅ `usePendingInvitations` → `'PendingInvitations'` (datos del usuario actual)

## 🔍 Cómo Detectar el Bug

Si estos tests fallan, significa que:

1. **Alguien cambió las query keys** de arrays a strings simples
2. **Se agregó un nuevo servicio** sin incluir los IDs en la query key
3. **Se modificó `FetchData`** rompiendo el soporte para arrays

## 📝 Checklist para Nuevos Servicios

Cuando crees un nuevo servicio que obtiene datos por ID:

- [ ] La query key es un **array** que incluye el ID
- [ ] El ID está en formato **string** (React Query lo requiere)
- [ ] Se agregó un **test** que verifica la separación de caché
- [ ] Se actualizaron las **invalidaciones** de caché correspondientes

## 🎓 Lecciones Aprendidas

1. **React Query usa query keys para identificar cachés únicos**
2. **Arrays en query keys permiten cachés jerárquicos y específicos**
3. **Los tests de integración son cruciales para detectar problemas de caché**
4. **Siempre incluir el contexto completo en la query key** (bandId, songId, etc.)

## 📚 Recursos

- [React Query - Query Keys](https://tanstack.com/query/latest/docs/react/guides/query-keys)
- [React Query - Effective Query Keys](https://tkdodo.eu/blog/effective-react-query-keys)

---

**Última actualización:** Noviembre 9, 2025
**Autor:** Sistema de Testing de Adorador
**Criticidad:** 🔴 ALTA - No modificar sin revisar los tests
