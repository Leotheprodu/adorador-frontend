# Tests de Sincronización WebSocket

## Descripción

Este conjunto de tests cubre el flujo de sincronización del WebSocket para eventos en vivo, asegurando que el estado se mantenga correctamente cuando un usuario recarga la página o se conecta al evento.

## Archivos de Test

### 1. `useEventWSConexion.test.tsx`

Tests principales que cubren el flujo de sincronización básico:

- **Carga inicial**: Verifica que el estado del servidor se aplica correctamente cuando un usuario entra o recarga la página
- **Cambio de canción**: Asegura que la posición se resetea a 0 solo cuando la canción cambia
- **Sin estado previo**: Verifica que se inicializa en 0 cuando no hay mensajes guardados
- **Stores derivados**: Comprueba que `$selectedSongData` y `$selectedSongLyricLength` se actualizan
- **Formatos de mensajes**: Valida el procesamiento de mensajes en formato legacy

### 2. `useEventWSConexion.raceConditions.test.tsx`

Tests específicos para race conditions y orden de eventos:

- **Race condition: lyricSelected antes que eventSelectedSong**: El caso más común en carga inicial
- **Race condition: eventSelectedSong antes que lyricSelected**: Caso alternativo
- **Múltiples recargas**: Maneja mensajes duplicados correctamente
- **Cambios rápidos**: Procesa múltiples actualizaciones en orden
- **Prioridad del servidor**: El estado del servidor sobrescribe el local
- **Detección de cambio de canción**: Diferencia entre carga inicial y cambio real

## Bug Fix Documentado

### Problema Original

Cuando un usuario recargaba la página, siempre veía el evento desde el inicio (posición 0) en lugar de la posición actual donde el administrador había dejado el evento.

### Causa Raíz

El listener de `eventSelectedSong` reseteaba la posición a 0 cada vez que se recibía el ID de la canción, incluso en la carga inicial cuando la canción era la misma.

```typescript
// ❌ CÓDIGO ANTERIOR (INCORRECTO)
$lyricSelected.set({ position: 0, action: 'backward' }); // Siempre reseteaba
```

### Solución

Agregamos una verificación para detectar si la canción realmente cambió:

```typescript
// ✅ CÓDIGO ACTUAL (CORRECTO)
const previousSongId = $eventSelectedSongId.get();
const isSongChange = previousSongId !== songId && previousSongId !== 0;

if (isSongChange) {
  $lyricSelected.set({ position: 0, action: 'backward' });
} else {
  // Mantener posición actual (carga inicial o misma canción)
}
```

### Flujo Correcto

#### Carga Inicial

1. Socket conecta → `previousSongId = 0`
2. Llega `lyricSelected` → `position = 4` ✅
3. Llega `eventSelectedSong` → `songId = 17`
4. `isSongChange = false` (porque `previousSongId === 0`)
5. Posición se mantiene en 4 ✅

#### Cambio de Canción

1. Estado actual: `songId = 17`, `position = 4`
2. Llega `eventSelectedSong` → `songId = 18`
3. `isSongChange = true` (porque `previousSongId = 17` y `songId = 18`)
4. Posición se resetea a 0 ✅

## Cobertura de Tests

Los tests cubren:

✅ Sincronización en carga inicial  
✅ Reseteo cuando no hay estado previo  
✅ Cambio de canción real  
✅ Misma canción múltiples veces  
✅ Race conditions (orden de llegada de mensajes)  
✅ Mensajes duplicados  
✅ Cambios rápidos de posición  
✅ Prioridad servidor vs local  
✅ Actualización de stores derivados  
✅ Formatos de mensajes legacy

## Ejecutar Tests

```bash
# Todos los tests
npm test

# Solo tests de WebSocket
npm test useEventWSConexion

# Con coverage
npm test -- --coverage useEventWSConexion
```

## Prevención de Regresiones

Estos tests están diseñados para prevenir regresiones futuras del bug documentado. Si alguien modifica el código de sincronización, los tests fallarán inmediatamente mostrando:

- Qué caso específico falló
- El comportamiento esperado vs el actual
- El estado de los stores antes y después

## Notas Importantes

### Orden de Mensajes

El servidor puede enviar los mensajes en cualquier orden:

- `lyricSelected` → `eventSelectedSong` (más común)
- `eventSelectedSong` → `lyricSelected`

Ambos casos están cubiertos por los tests.

### Estado Inicial de Stores

Los stores siempre inician en:

```typescript
$lyricSelected = { position: 0, action: 'forward' };
$eventSelectedSongId = 0;
$eventAdminName = '';
```

El valor `0` en `$eventSelectedSongId` se usa para detectar la carga inicial.

### Delay en request_current_state

Hay un `setTimeout` de 50ms antes de emitir `request_current_state` para asegurar que todos los listeners estén configurados. Este timing es crítico para la sincronización correcta.

## Mantenimiento

Al agregar nuevas funcionalidades de sincronización:

1. ✅ Escribe el test primero (TDD)
2. ✅ Asegúrate de cubrir casos de carga inicial y actualización
3. ✅ Considera race conditions
4. ✅ Verifica que los stores derivados se actualizan
5. ✅ Documenta el comportamiento esperado en el test
