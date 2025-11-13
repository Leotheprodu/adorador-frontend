# Feed Social Global

Feed social global de la aplicación Adorador para compartir y solicitar canciones entre bandas.

## 📍 Ubicación

`src/app/(public)/feed/`

## 🎯 Características

### Tipos de Posts

1. **🎵 Compartir Canción** - Los miembros de bandas pueden compartir canciones con toda la comunidad
2. **🙏 Solicitar Canción** - Pedir ayuda para encontrar una canción específica

### Funcionalidades Principales

- ✅ Scroll infinito con paginación por cursor
- ✅ Actualizaciones en tiempo real vía WebSocket
- ✅ Sistema de "Blessings" (likes/reacciones)
- ✅ Comentarios con respuestas anidadas
- ✅ Copiar canciones compartidas a tu banda
- ✅ Solo usuarios logueados pueden acceder

## 🔗 Navegación

El feed está disponible en el navbar principal como **"Feed Social"** y solo es visible para usuarios autenticados.

## 🚀 Uso

### Para Compartir una Canción

1. Click en "Crear Post"
2. Seleccionar "Compartir Canción"
3. Elegir tu banda
4. Seleccionar la canción de tu repertorio
5. Agregar mensaje opcional
6. Publicar

### Para Solicitar una Canción

1. Click en "Crear Post"
2. Seleccionar "Solicitar Canción"
3. Elegir tu banda
4. Escribir título de la canción
5. Agregar artista (opcional)
6. Publicar

### Para Copiar una Canción

1. Click en el ícono de descarga en un post de tipo "Compartir"
2. Seleccionar banda destino
3. Opcionalmente cambiar tono o BPM
4. Confirmar

La canción se copiará completa con letras y acordes.

## 🔌 WebSocket Events

El feed escucha los siguientes eventos en tiempo real:

- `newPost` - Nuevo post publicado
- `postUpdated` - Post editado
- `postDeleted` - Post eliminado
- `newComment` - Nuevo comentario
- `newBlessing` - Nuevo blessing
- `blessingRemoved` - Blessing removido
- `songCopied` - Canción copiada

## 📝 Próximas Mejoras

- [ ] Feed específico por banda para comunicación interna
- [ ] Notificaciones push
- [ ] Búsqueda y filtros avanzados
- [ ] Compartir en redes sociales
- [ ] Sistema de menciones (@usuario)
