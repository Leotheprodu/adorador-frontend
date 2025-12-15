# 📐 Component Architecture Guide

> Guía completa de patrones y mejores prácticas para crear componentes en este proyecto

---

## 🎯 Filosofía Principal

### Separación de Responsabilidades

- **Lógica** → Custom Hooks
- **UI** → Componentes React
- **Tipos** → Archivos de interfaces
- **Datos** → Services/Stores

### Regla de Oro

**Un componente debe hacer UNA cosa bien.** Si hace más, divídelo.

---

## 📁 Estructura de Carpetas

### Patrón Estándar

```
feature/
├── _components/           # Componentes React
│   ├── MainComponent.tsx  # Componente principal
│   ├── SubComponent1.tsx  # Sub-componente
│   ├── SubComponent2.tsx  # Sub-componente
│   └── __tests__/         # Tests de componentes
├── _hooks/                # Custom hooks
│   ├── useFeatureLogic.tsx
│   └── useFeatureData.tsx
├── _interfaces/           # TypeScript interfaces
│   └── featureInterfaces.ts
├── _services/            # API calls
│   └── featureService.ts
└── _utils/               # Utilidades específicas
    └── helpers.ts
```

### Ejemplo Real del Proyecto

```
eventos/[eventId]/en-vivo/
├── _components/
│   ├── EventByIdPage.tsx          # ✅ Orquestador (90 líneas)
│   ├── EventPageHeader.tsx        # ✅ UI puro (60 líneas)
│   ├── EventMainScreen.tsx        # ✅ Display logic (158 líneas)
│   └── EventControls.tsx          # ✅ Control logic (75 líneas)
├── _hooks/
│   ├── useEventPermissions.tsx    # ✅ Lógica compartida
│   ├── useEventNavigation.tsx     # ✅ Navegación
│   └── useEventSongsListener.tsx  # ✅ Event listeners
└── _interfaces/
    └── liveEventInterfaces.ts     # ✅ Todos los tipos
```

---

## 🔌 Capa de Servicios (API)

### Ubicación y Estructura

```
feature/
└── _services/
    ├── featureService.ts      # Servicios específicos del feature
    └── anotherService.ts

/global/services/
└── HandleAPI.ts               # Utilidades base (FetchData, PostData)
```

### Utilidades Base

Este proyecto usa **TanStack Query (React Query)** para manejo de estado del servidor. Tenemos 2 utilidades principales:

#### 1. **FetchData** - Para GET requests

```typescript
// En: /global/services/HandleAPI.ts
export const FetchData = <TResponse>({
  key,                        // Query key para cache
  url,                        // URL del endpoint
  isEnabled = true,          // Condicional de ejecución
  skipAuth = false,          // Si omitir autenticación
  refetchOnMount = false,
  refetchOnWindowFocus = false,
}: {
  key: string | string[];
  url: string;
  isEnabled?: boolean;
  skipAuth?: boolean;
  refetchOnMount?: boolean;
  refetchOnWindowFocus?: boolean;
}): UseQueryResult<TResponse, Error>
```

**Configuración por defecto:**

- `staleTime`: 5 minutos
- `gcTime`: 10 minutos
- `retry`: 3 intentos con exponential backoff
- `refetchOnWindowFocus`: false
- `refetchOnReconnect`: false

#### 2. **PostData** - Para POST/PUT/DELETE/PATCH requests

```typescript
// En: /global/services/HandleAPI.ts
export const PostData = <TResponse, TData = undefined>({
  key,                    // Mutation key
  url,                    // URL del endpoint
  method = 'POST',       // HTTP method
  isFormData,            // Si es FormData
  skipAuth = false,      // Si omitir autenticación
}: {
  key: string;
  url: string;
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  isFormData?: boolean;
  skipAuth?: boolean;
}): UseMutationResult<TResponse, Error, TData | null, unknown>
```

### Patrón: Crear un Servicio

#### Paso 1: Crear el archivo de servicio

```typescript
// _services/eventByIdService.ts
import { FetchData } from '@global/services/HandleAPI';
import { Server1API } from '@global/config/constants';
import { EventByIdInterface } from '../_interfaces/eventInterfaces';

export const getEventsById = ({
  bandId,
  eventId,
}: {
  bandId: string;
  eventId: string;
}) => {
  return FetchData<EventByIdInterface>({
    key: ['Event', bandId, eventId],
    url: `${Server1API}/bands/${bandId}/events/${eventId}`,
    isEnabled: !!bandId && !!eventId,
  });
};
```

**Características clave:**

- ✅ Nombre descriptivo: `get[Resource]` | `create[Resource]` | `update[Resource]` | `delete[Resource]`
- ✅ Query key array con parámetros dinámicos
- ✅ Validación con `isEnabled`
- ✅ Tipado genérico `<TResponse>`

#### Paso 2: Usar el servicio en un hook

```typescript
// _hooks/useEventByIdPage.tsx
import { getEventsById } from '../_services/eventByIdService';

export const useEventByIdPage = ({ params }) => {
  const { data, isLoading, status, refetch } = getEventsById({
    bandId: params.bandId,
    eventId: params.eventId,
  });

  // Lógica adicional del hook (side effects, transformaciones, etc.)
  useEffect(() => {
    if (status === 'success' && data) {
      $event.set(data);
    }
  }, [status, data]);

  return { data, isLoading, refetch };
};
```

#### Paso 3: Usar el hook en el componente

```typescript
// _components/EventByIdPage.tsx
export const EventByIdPage = ({ params }) => {
  const { data, isLoading, refetch } = useEventByIdPage({ params });

  if (isLoading) return <Loading />;

  return <EventContent data={data} refetch={refetch} />;
};
```

### Patrón: Mutations (POST/PUT/DELETE)

#### Ejemplo 1: Simple Mutation

```typescript
// _services/bandService.ts
import { PostData } from '@global/services/HandleAPI';
import { Server1API } from '@global/config/constants';

interface CreateBandRequest {
  name: string;
}

interface CreateBandResponse {
  success: boolean;
  data: { id: number; name: string };
}

export const createBandService = () => {
  return PostData<CreateBandResponse, CreateBandRequest>({
    key: 'CreateBand',
    url: `${Server1API}/bands`,
    method: 'POST',
  });
};
```

#### Ejemplo 2: Usar Mutation en Hook

```typescript
// _hooks/useCreateBand.tsx
import { createBandService } from '../_services/bandService';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';

export const useCreateBand = () => {
  const queryClient = useQueryClient();

  const { mutate, isPending, status } = createBandService();

  const handleCreate = (bandName: string) => {
    mutate(
      { name: bandName },
      {
        onSuccess: (response) => {
          toast.success('Banda creada exitosamente');
          // Invalidar queries relacionadas
          queryClient.invalidateQueries({ queryKey: ['bands'] });
        },
        onError: (error) => {
          toast.error('Error al crear banda');
          console.error(error);
        },
      },
    );
  };

  return { handleCreate, isPending, status };
};
```

#### Ejemplo 3: Mutation con FormData

```typescript
//  _services/songService.ts
export const uploadSongImageService = () => {
  return PostData<UploadResponse, FormData>({
    key: 'UploadSongImage',
    url: `${Server1API}/songs/upload`,
    method: 'POST',
    isFormData: true, // ← Importante para FormData
  });
};

// Uso en hook
export const useUploadSongImage = () => {
  const { mutate, isPending } = uploadSongImageService();

  const handleUpload = (file: File, songId: number) => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('songId', songId.toString());

    mutate(formData, {
      onSuccess: () => toast.success('Imagen subida'),
      onError: () => toast.error('Error al subir imagen'),
    });
  };

  return { handleUpload, isPending };
};
```

### Patrón: Queries con Parámetros Dinámicos

```typescript
// _services/songListService.ts
export const getSongsOfBand = ({
  bandId,
  enabled = true,
}: {
  bandId: string;
  enabled?: boolean;
}) => {
  return FetchData<SongListResponse>({
    key: ['SongsOfBand', bandId], // ← Cache key incluye bandId
    url: `${Server1API}/bands/${bandId}/songs`,
    isEnabled: !!bandId && enabled, // ← Siempre validar parámetros
  });
};

// Uso con habilitación condicional
export const useSongsOfBand = (bandId: string, shouldFetch: boolean) => {
  return getSongsOfBand({
    bandId,
    enabled: shouldFetch, // Se puede controlar cuándo hace fetch
  });
};
```

### Patrón: Invalidación de Queries

```typescript
// Después de una mutación exitosa
const queryClient = useQueryClient();

// Invalidar query específica
queryClient.invalidateQueries({
  queryKey: ['Event', bandId, eventId],
});

// Invalidar todas las queries que empiecen con 'Event'
queryClient.invalidateQueries({
  queryKey: ['Event'],
});

// Invalidar múltiples queries
const handleSuccess = () => {
  queryClient.invalidateQueries({ queryKey: ['EventsOfBand', bandId] });
  queryClient.invalidateQueries({ queryKey: ['Event', bandId, eventId] });
};
```

### Manejo de Errores

#### En el Servicio (usando PostData)

```typescript
// HandleAPI.ts ya maneja errores básicos
export const PostData = <TResponse, TData = undefined>({...}) => {
  return useMutation<TResponse, Error, TData | null, unknown>({
    mutationKey: [key],
    mutationFn: async (data?: TData | null) => {
      return await fetchAPI<TResponse>({
        url,
        method,
        body: (data as FormData | null) ?? undefined,
        isFormData,
        skipAuth,
      });
    },
    onError: (error) => {
      console.log(error);
      throw new Error(error.message);  // ← Error propagado
    },
  });
};
```

#### En el Hook (manejo personalizado)

```typescript
export const useCreateEvent = () => {
  const { mutate, isPending, error } = createEventService();

  const handleCreate = (eventData) => {
    mutate(eventData, {
      onSuccess: (response) => {
        toast.success('Evento creado');
      },
      onError: (error) => {
        // Manejo personalizado por tipo de error
        if (error.message.includes('401')) {
          toast.error('No autorizado');
        } else if (error.message.includes('400')) {
          toast.error('Datos inválidos');
        } else {
          toast.error('Error desconocido');
        }
      },
    });
  };

  return { handleCreate, isPending, error };
};
```

### Naming Conventions

```typescript
// Servicios GET
export const get[Resource]      // getEventById, getSongsOfBand
export const fetch[Resource]    // fetchUserData
export const list[Resource]     // listEvents

// Servicios POST/CREATE
export const create[Resource]Service   // createBandService
export const add[Resource]Service      // addSongToEventService

// Servicios PUT/PATCH
export const update[Resource]Service   // updateEventService
export const edit[Resource]Service     // editSongService

// Servicios DELETE
export const delete[Resource]Service   // deleteEventService
export const remove[Resource]Service   // removeMemberService

// Servicios especiales
export const toggle[Action]Service     // toggleBlessingService
export const upload[Resource]Service   // uploadLyricsService
```

### Mejores Prácticas

#### ✅ DO: Query Keys Descriptivas

```typescript
// ✅ BIEN: Query key con parámetros
FetchData({
  key: ['Event', bandId, eventId],
  url: `...`,
});

// ✅ BIEN: Query key para listado
FetchData({
  key: ['EventsOfBand', bandId],
  url: `...`,
});

// ❌ MAL: Query key genérica
FetchData({
  key: ['data'],
  url: `...`,
});
```

#### ✅ DO: Validar Parámetros con isEnabled

```typescript
// ✅ BIEN: Validación de parámetros
export const getEvent = ({ bandId, eventId }) => {
  return FetchData({
    key: ['Event', bandId, eventId],
    url: `${Server1API}/bands/${bandId}/events/${eventId}`,
    isEnabled: !!bandId && !!eventId, // ← Evita llamadas innecesarias
  });
};

// ❌ MAL: Sin validación
// Puede hacer llamadas con undefined/null
```

#### ✅ DO: Tipar Requests y Responses

```typescript
// ✅ BIEN: Tipado completo
interface CreateEventRequest {
  title: string;
  date: string;
  bandId: number;
}

interface CreateEventResponse {
  success: boolean;
  data: { id: number; title: string };
}

export const createEventService = () => {
  return PostData<CreateEventResponse, CreateEventRequest>({
    key: 'CreateEvent',
    url: `${Server1API}/events`,
    method: 'POST',
  });
};

// ❌ MAL: Sin tipos o usando 'any'
```

#### ✅ DO: Invalidar Queries Relevantes

```typescript
// ✅ BIEN: Invalidar relacionados
onSuccess: () => {
  queryClient.invalidateQueries({ queryKey: ['EventsOfBand'] });
  queryClient.invalidateQueries({ queryKey: ['Event', bandId, eventId] });
  toast.success('Guardado');
};

// ❌ MAL: No invalidar cache
// Los datos se quedan obsoletos
```

#### ✅ DO: Manejar Estados de Loading

```typescript
// ✅ BIEN: UI responsive
export const Component = () => {
  const { data, isLoading, error } = useEventData();

  if (isLoading) return <Skeleton />;
  if (error) return <ErrorState />;
  if (!data) return <EmptyState />;

  return <Content data={data} />;
};
```

### Ejemplo Completo: Feature con Servicios

```
eventos/
├── _services/
│   ├── eventService.ts          # CRUD de eventos
│   └── eventSongsService.ts     # Canciones de evento
├── _hooks/
│   ├── useEventData.tsx         # Usa eventService
│   ├── useCreateEvent.tsx       # Usa eventService.create
│   └── useEventSongs.tsx        # Usa eventSongsService
├── _interfaces/
│   └── eventInterfaces.ts       # Request/Response types
└── _components/
    └── EventsOfBand.tsx         # Usa los hooks
```

**eventService.ts:**

```typescript
import { FetchData, PostData } from '@global/services/HandleAPI';
import { Server1API } from '@global/config/constants';

// GET list
export const getEventsOfBand = ({ bandId }) => {
  return FetchData<EventListResponse>({
    key: ['EventsOfBand', bandId],
    url: `${Server1API}/bands/${bandId}/events`,
    isEnabled: !!bandId,
  });
};

// GET single
export const getEventById = ({ bandId, eventId }) => {
  return FetchData<EventResponse>({
    key: ['Event', bandId, eventId],
    url: `${Server1API}/bands/${bandId}/events/${eventId}`,
    isEnabled: !!bandId && !!eventId,
  });
};

// CREATE
export const createEventService = () => {
  return PostData<CreateEventResponse, CreateEventRequest>({
    key: 'CreateEvent',
    url: `${Server1API}/events`,
    method: 'POST',
  });
};

// UPDATE
export const updateEventService = () => {
  return PostData<UpdateEventResponse, UpdateEventRequest>({
    key: 'UpdateEvent',
    url: `${Server1API}/events`,
    method: 'PUT',
  });
};

// DELETE
export const deleteEventService = () => {
  return PostData<DeleteEventResponse, { eventId: number }>({
    key: 'DeleteEvent',
    url: `${Server1API}/events`,
    method: 'DELETE',
  });
};
```

**useCreateEvent.tsx:**

```typescript
import { createEventService } from '../_services/eventService';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';

export const useCreateEvent = (bandId: string) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { mutate, isPending, error, status } = createEventService();

  const handleCreate = (eventData: CreateEventRequest) => {
    mutate(eventData, {
      onSuccess: (response) => {
        toast.success('Evento creado exitosamente');
        queryClient.invalidateQueries({ queryKey: ['EventsOfBand', bandId] });
        router.push(`/grupos/${bandId}/eventos/${response.data.id}`);
      },
      onError: (error) => {
        toast.error('Error al crear evento');
        console.error(error);
      },
    });
  };

  return { handleCreate, isPending, error, status };
};
```

---

## 🪝 Cuándo Crear un Custom Hook

### Indicadores de que NECESITAS un Hook

✅ **Lógica compleja de estado**

```tsx
// ❌ MAL: Todo en el componente
const [value1, setValue1] = useState('');
const [value2, setValue2] = useState(0);
const [isValid, setIsValid] = useState(false);
useEffect(() => {
  /* validación compleja */
}, [value1, value2]);

// ✅ BIEN: Hook dedicado
const { value1, value2, isValid, handleChange } = useFormValidation();
```

✅ **Lógica duplicada entre componentes**

```tsx
// Si dos componentes hacen lo mismo → Hook compartido
// Ejemplo: useEventPermissions usado por EventByIdPage y EventControls
```

✅ **Más de 3 `useState` relacionados**

```tsx
// ❌ MAL
const [isOpen, setIsOpen] = useState(false);
const [selectedItem, setSelectedItem] = useState(null);
const [isLoading, setIsLoading] = useState(false);

// ✅ BIEN
const { isOpen, selectedItem, isLoading, open, close, select } = useModal();
```

✅ **Efectos secundarios complejos**

```tsx
// ❌ MAL: useEffect largo en componente
useEffect(() => {
  /* 30+ líneas de lógica de suscripción */
}, [deps]);

// ✅ BIEN: Hook dedicado
useEventSongsListener({ eventId, refetch });
```

✅ **Cálculos computacionalmente costosos**

```tsx
// ✅ BIEN: Hook para lógica pesada
const { filteredData, sortedData } = useListFilter({
  data,
  searchFields,
  filterPredicate,
  sortComparator,
});
```

### Tipos de Hooks que Debes Crear

#### 1. **Hooks de Estado/Lógica** (`use[Feature]Logic`)

Manejan estado y lógica de negocio.

```tsx
// Ejemplo: useMusicPlayer.tsx
export const useMusicPlayer = () => {
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);

  const handlePlay = () => setPlaying(true);
  const handlePause = () => setPlaying(false);

  return {
    playing,
    volume,
    handlePlay,
    handlePause,
    setVolume,
  };
};
```

#### 2. **Hooks de Datos** (`use[Feature]Data`)

Manejan fetching y cache de datos.

```tsx
// Ejemplo: useEventByIdPage.tsx
export const useEventByIdPage = ({ params }) => {
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['Event', params.bandId, params.eventId],
    queryFn: () => fetchEvent(params),
  });

  return { data, isLoading, refetch };
};
```

#### 3. **Hooks de Permisos** (`use[Feature]Permissions`)

Encapsulan lógica de autorización.

```tsx
// Ejemplo: useEventPermissions.tsx
export const useEventPermissions = () => {
  const user = useStore($user);
  const event = useStore($event);

  const isAdminEvent = useMemo(() => {
    // Lógica compleja de permisos
  }, [user, event]);

  return { isAdminEvent, isEventManager, showActionButtons };
};
```

#### 4. **Hooks de Navegación** (`use[Feature]Navigation`)

Manejan navegación y redirección.

```tsx
// Ejemplo: useEventNavigation.tsx
export const useEventNavigation = ({ bandId, eventId }) => {
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleBackToEvents = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ['EventsOfBand'] });
    router.push(`/grupos/${bandId}/eventos/${eventId}`);
  }, [bandId, eventId]);

  return { handleBackToEvents };
};
```

#### 5. **Hooks de Listeners** (`use[Feature]Listener`)

Manejan suscripciones y eventos.

```tsx
// Ejemplo: useEventSongsListener.tsx
export const useEventSongsListener = ({ eventId, refetch }) => {
  useEffect(() => {
    const handler = (event) => {
      /* ... */
    };
    window.addEventListener('eventSongsUpdated', handler);
    return () => window.removeEventListener('eventSongsUpdated', handler);
  }, [eventId, refetch]);
};
```

#### 6. **Hooks Compartidos/Genéricos** (`use[GenericPurpose]`)

Reutilizables en múltiples features.

```tsx
// Ejemplo: useListFilter.tsx
export const useListFilter = <T,>({
  data,
  searchFields,
  filterPredicate,
  sortComparator,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredData = useMemo(() => {
    // Lógica genérica de filtrado
  }, [data, searchTerm, filterPredicate]);

  return { searchTerm, setSearchTerm, filteredData };
};
```

---

## 🧩 Cuándo Separar Componentes

### Indicadores de que NECESITAS Separar

✅ **Componente > 150 líneas**

```tsx
// ✅ Divide en sub-componentes
// EventAdminPage (285 líneas) →
//   EventAdminHeader (40 líneas)
//   EventInfoCard (50 líneas)
//   EventQuickActions (30 líneas)
//   EventStatsCard (40 líneas)
```

✅ **Bloques de JSX que se repiten**

```tsx
// ❌ MAL: Repetición
<div className="header">
  <BackwardIcon />
  <h1>{title}</h1>
  <div>{actions}</div>
</div>

// ✅ BIEN: Componente reutilizable
<ListHeader
  title={title}
  onBack={handleBack}
  actionButton={<AddButton />}
/>
```

✅ **Secciones con responsabilidad clara**

```tsx
// ✅ BIEN: Cada sección es un componente
<EventByIdPage>
  <EventPageHeader /> {/* Header */}
  <EventMainScreen /> {/* Pantalla principal */}
  <EventSimpleTitle /> {/* Título */}
  <EventConnectedUsers /> {/* Usuarios */}
  <EventControls /> {/* Controles */}
</EventByIdPage>
```

✅ **Lógica condicional compleja**

```tsx
// ❌ MAL: Condicionales en componente principal
{
  isAdmin && canEdit && !isLocked && <div>{/* 50 líneas de JSX */}</div>;
}

// ✅ BIEN: Componente dedicado
{
  showAdminControls && <AdminControls />;
}
```

### Tipos de Componentes que Debes Crear

#### 1. **Componentes de Página/Orquestadores**

Coordinan otros componentes, usan hooks, poca UI propia.

```tsx
// Ejemplo: EventByIdPage.tsx (90 líneas)
export const EventByIdPage = ({ params }) => {
  // Hooks
  const { isLoading, refetch } = useEventByIdPage({ params });
  const { isAdminEvent, showActionButtons } = useEventPermissions();
  const { handleBackToEvents } = useEventNavigation(params);

  // Mínima lógica
  const memoizedRefetch = useCallback(() => refetch(), [refetch]);

  // Composición de sub-componentes
  return (
    <div>
      <EventPageHeader {...headerProps} />
      <EventMainScreen />
      <EventControls {...controlProps} />
    </div>
  );
};
```

**Características:**

- ✅ Usa múltiples hooks
- ✅ Orquesta sub-componentes
- ✅ Poca lógica propia
- ✅ Máximo 100-150 líneas

#### 2. **Componentes de UI Puros**

Solo reciben props y renderizan, sin lógica compleja.

```tsx
// Ejemplo: EventPageHeader.tsx (60 líneas)
export const EventPageHeader = ({
  bandId,
  eventId,
  onBack,
  showActionButtons,
  isAdminEvent,
  refetch,
}: EventPageHeaderProps) => {
  return (
    <div className="header">
      <button onClick={onBack}>
        <BackwardIcon />
        Volver
      </button>
      <h1>Evento en Vivo</h1>
      {showActionButtons && (
        <div>
          <EditEventButton {...editProps} />
          <DeleteEventButton {...deleteProps} />
        </div>
      )}
    </div>
  );
};
```

**Características:**

- ✅ Props tipadas con interface
- ✅ Sin estado interno (o mínimo)
- ✅ Sin efectos secundarios
- ✅ Fácil de testear
- ✅ 30-80 líneas

#### 3. **Componentes Compartidos/Genéricos**

Reutilizables en múltiples features.

```tsx
// Ejemplo: ListHeader.tsx
export const ListHeader = ({
  title,
  subtitle,
  onBack,
  actionButton,
  gradientFrom,
  gradientTo,
}: ListHeaderProps) => {
  return (
    <div>
      <button onClick={onBack}>
        <BackwardIcon />
        Volver
      </button>
      <h1 className={`${gradientFrom} ${gradientTo}`}>{title}</h1>
      <p>{subtitle}</p>
      {actionButton}
    </div>
  );
};
```

**Características:**

- ✅ Genérico y configurable
- ✅ Props claras y tipadas
- ✅ Ubicado en `/global/components/`
- ✅ Documentado con ejemplos

#### 4. **Componentes de Display/Visualización**

Muestran datos complejos de forma específica.

```tsx
// Ejemplo: LyricsShowcase.tsx
export const LyricsShowcase = ({ lyricsShowcaseProps }) => {
  const lyricSelected = useStore($lyricSelected);
  const selectedSongData = useStore($selectedSongData);

  const visibleLyricsData = useMemo(() => {
    // Lógica de visualización compleja
  }, [selectedSongData, lyricSelected]);

  return (
    <AnimatePresence>
      {visibleLyricsData.map((lyric) => (
        <LyricsShowcaseCard key={lyric.position} {...lyric} />
      ))}
    </AnimatePresence>
  );
};
```

#### 5. **Componentes de Control/Interacción**

Manejan interacciones del usuario.

```tsx
// Ejemplo: EventControls.tsx (75 líneas)
export const EventControls = ({ params, refetch, isLoading }) => {
  const eventAdminName = useStore($eventAdminName);
  const { isAdminEvent, isEventManager } = useEventPermissions();

  useEffect(() => {
    refetch();
  }, [eventAdminName]);

  return (
    <section>
      <EventControlsSongsList {...listProps} />
      {isAdminEvent && <EventControlsLyricsSelect />}
      <EventControlsButtons {...buttonProps} />
    </section>
  );
};
```

---

## 💧 Hydration Protection (SSR/Client Components)

> **CRÍTICO para React 18 + Next.js 15**: Este patrón es OBLIGATORIO para Client Components que renderizan contenido condicional basado en estado del usuario, autenticación, o datos dinámicos.

### ⚠️ El Problema de Hidratación

Cuando un Client Component (`'use client'`) se renderiza dentro de un Server Component (páginas de Next.js por defecto), puede ocurrir un **hydration mismatch** si el HTML generado en el servidor difiere del HTML generado en el cliente.

**Causas comunes:**

- `isLoggedIn` es `false` en servidor pero `true` en cliente
- `isLoading` difiere entre servidor y cliente
- Renderizado condicional basado en stores (nanostores, zustand, etc.)
- Uso de `localStorage`, `sessionStorage`, o `window` en render
- Fechas/horas que cambian entre renderizados

**Error típico:**

```
Hydration failed because the server rendered HTML didn't match the client.
```

### ✅ Solución: Mounted Guard Pattern

El patrón **mounted guard** previene la hidratación hasta que el componente esté completamente montado en el cliente.

#### Patrón Básico

```tsx
'use client';

import { useState, useEffect } from 'react';

export const MyClientComponent = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render conditional content until mounted
  if (!mounted) {
    return null; // o un placeholder/skeleton
  }

  // Ahora es seguro renderizar contenido condicional
  return (
    <div>{/* Contenido que puede diferir entre servidor y cliente */}</div>
  );
};
```

#### Cuándo Usar Este Patrón

✅ **SIEMPRE usar cuando:**

- El componente renderiza contenido diferente basado en `isLoggedIn`
- El componente usa stores (`useStore($user)`, `useStore($event)`, etc.)
- Hay renderizado condicional basado en permisos/roles
- Se usa `isLoading`, `error`, `data` de React Query de forma condicional
- Se accede a `window`, `localStorage`, `sessionStorage`

❌ **NO necesitas el patrón cuando:**

- El componente es puramente presentacional (solo props)
- No hay renderizado condicional basado en estado dinámico
- El componente es un Server Component

### 📋 Ejemplos Reales del Proyecto

#### Ejemplo 1: Protección por `isLoggedIn`

```tsx
// GruposCTASection.tsx
'use client';

import { useState, useEffect } from 'react';
import { useGruposCTA } from '../_hooks/useGruposCTA';

export const GruposCTASection = () => {
  const { isLoggedIn, ...rest } = useGruposCTA();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // ✅ NO renderizar hasta que esté montado
  if (!mounted) {
    return null;
  }

  // Usuario NO logueado
  if (!isLoggedIn) {
    return (
      <div className="...">
        <h3>¿QuieresQue tu grupo aparezca aquí?</h3>
        <PrimaryButton href="/auth/login">Registrar mi grupo</PrimaryButton>
      </div>
    );
  }

  // Usuario LOGUEADO - diferente contenido
  return (
    <div className="...">
      <h3>¿Listo para crear un nuevo grupo?</h3>
      <PrimaryButton onClick={onOpen}>+ Crear nuevo grupo</PrimaryButton>
    </div>
  );
};
```

**Por qué funciona:**

- En servidor: retorna `null` (no hay mismatch)
- En cliente: espera al mount, luego renderiza contenido correcto
- `isLoggedIn` puede diferir entre servidor/cliente sin causar error

#### Ejemplo 2: Protección por `isLoading`/`data`

```tsx
// BandsShowCase.tsx
'use client';

import { useState, useEffect } from 'react';
import { getBandsOfUser } from '@bands/_services/bandsService';
import { useStore } from '@nanostores/react';
import { $user } from '@global/stores/users';

export const BandsShowCase = () => {
  const user = useStore($user);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const { data, error, isLoading } = getBandsOfUser(user.isLoggedIn);

  // ✅ NO renderizar contenido condicional hasta que esté montado
  if (!mounted) {
    return <div className="h-full" />; // placeholder con misma estructura
  }

  return (
    <div className="h-full">
      {error && <ErrorState />}
      {isLoading && <SkeletonState />}
      {data && <BandList bands={data} />}
    </div>
  );
};
```

**Por qué funciona:**

- `isLoading` puede ser `true` en servidor pero `false` en cliente
- Al retornar solo la estructura base antes del mount, evitamos el mismatch
- Después del mount, el contenido condicional se renderiza correctamente

#### Ejemplo 3: Protección con Permisos

```tsx
// EventPageHeader.tsx
'use client';

import { useState, useEffect } from 'react';

export const EventPageHeader = ({ showActionButtons, isAdminEvent }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="header">
      <BackButton />
      <h1>Evento en Vivo</h1>

      {/* ✅ Solo renderizar botones después del mount */}
      {mounted && showActionButtons && (
        <div>
          <EditButton />
          <DeleteButton />
        </div>
      )}
    </div>
  );
};
```

**Por qué funciona:**

- `showActionButtons` depende de permisos/roles que pueden diferir
- Guardamos el mounted check ANTES de renderizar los botones
- La estructura base (header, h1) se renderiza igual en servidor y cliente

### 🎯 Mejores Prácticas

#### ✅ DO: Retornar Estructura Mínima

```tsx
// ✅ BIEN: Retornar estructura base
if (!mounted) {
  return <div className="container" />; // misma estructura root
}

// ✅ BIEN: Retornar loading apropiado
if (!mounted) {
  return <SkeletonLoader />;
}

// ✅ BIEN: Retornar null si no hay estructura fija
if (!mounted) {
  return null;
}
```

#### ❌ DON'T: Renderizar Contenido Dinámico Antes del Mount

```tsx
// ❌ MAL: No usar mounted guard
export const BadComponent = () => {
  const user = useStore($user);

  // Esto causará hydration mismatch
  if (!user.isLoggedIn) {
    return <LoginPrompt />;
  }

  return <UserDashboard />;
};
```

#### ✅ DO: Aplicar Guard a Nivel Correcto

```tsx
// ✅ BIEN: Guard en el componente raíz
export const ParentComponent = () => {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div>
      <ChildA /> {/* No necesitan su propio guard */}
      <ChildB />
    </div>
  );
};

// ❌ MAL: Guard innecesario en hijos
const ChildA = () => {
  const [mounted, setMounted] = useState(false); // ❌ Redundante
  // ...
};
```

### 📊 Checklist de Componentes

Usa este checklist al crear Client Components:

- [ ] ¿El componente usa `'use client'`?
- [ ] ¿Renderiza contenido diferente basado en autenticación?
- [ ] ¿Usa stores (nanostores, zustand, etc.)?
- [ ] ¿Tiene renderizado condicional basado en `isLoading`/`data`/`error`?
- [ ] ¿Accede a `window`, `localStorage`, o APIs del navegador?
- [ ] ¿Los datos pueden diferir entre servidor y cliente?

**Si respondiste SÍ a cualquiera: usa el mounted guard pattern.**

### 🔍 Debugging Hydration Issues

Si ves un error de hidratación:

1. **Identifica el componente** en el stack trace
2. **Busca renderizado condicional** basado en estado dinámico
3. **Añade mounted guard** al principio del componente
4. **Verifica** que el placeholder retornado tenga la misma estructura base
5. **Test** recargando la página

**Herramientas útiles:**

```bash
# En desarrollo, React te mostrará dónde ocurrió el mismatch
# Busca el warning en console con detalles del árbol
```

### 📚 Referencias

- [React Hydration Docs](https://react.dev/link/hydration-mismatch)
- [Next.js Client Components](https://nextjs.org/docs/app/building-your-application/rendering/client-components)
- [Server vs Client Components](https://nextjs.org/docs/app/building-your-application/rendering/composition-patterns)

---

## 📝 Interfaces y Tipos

### Ubicación

```
feature/
└── _interfaces/
    └── featureInterfaces.ts  # ✅ TODAS las interfaces aquí
```

### Qué Incluir

```typescript
// featureInterfaces.ts

// 1. Props de componentes principales
export interface MainComponentProps {
  bandId: string;
  eventId: string;
  onClose: () => void;
}

// 2. Props de sub-componentes
export interface HeaderProps {
  title: string;
  onBack: () => void;
}

// 3. Props de hooks
export interface UseFeatureLogicProps {
  id: string;
  enabled: boolean;
}

// 4. Tipos de datos específicos del feature
export interface FeatureData {
  id: number;
  name: string;
  status: 'active' | 'inactive';
}

// 5. Tipos de retorno de hooks (opcional, si es complejo)
export interface UseFeatureLogicReturn {
  data: FeatureData | null;
  isLoading: boolean;
  handleAction: () => void;
}
```

### Convenciones de Nombres

```typescript
// Props de componentes
export interface ComponentNameProps {}

// Props de hooks
export interface UseHookNameProps {}

// Retorno de hooks (solo si es complejo)
export interface UseHookNameReturn {}

// Tipos de datos
export interface EntityName {}
```

### Ejemplo Real del Proyecto

```typescript
// liveEventInterfaces.ts
export interface EventPageHeaderProps {
  bandId: string;
  eventId: string;
  onBack: () => void;
  showActionButtons: boolean;
  isAdminEvent: boolean;
  refetch: () => void;
}

export interface UseEventNavigationProps {
  bandId: string;
  eventId: string;
}

export interface UseEventSongsListenerProps {
  eventId: string;
  refetch: () => void;
}
```

---

## 📏 Reglas de Líneas de Código

### Límites Recomendados

| Tipo                 | Líneas Ideales | Máximo Aceptable | Acción si Excede        |
| -------------------- | -------------- | ---------------- | ----------------------- |
| Hook                 | 50-100         | 150              | Dividir en sub-hooks    |
| Componente UI        | 30-80          | 100              | Extraer sub-componentes |
| Componente de Página | 80-120         | 150              | Extraer lógica a hooks  |
| Componente Complejo  | 100-150        | 200              | Refactorizar urgente    |

### Cómo Medir

```bash
# Contar líneas de un archivo
wc -l Component.tsx

# Buscar archivos grandes
find . -name "*.tsx" -exec wc -l {} \; | sort -nr | head -20
```

### Señales de Alerta

🚨 **Componente > 200 líneas**

```tsx
// ACCIÓN INMEDIATA REQUERIDA
// 1. Extraer lógica a hooks
// 2. Dividir UI en sub-componentes
// 3. Mover utilidades a _utils/
```

⚠️ **Componente 150-200 líneas**

```tsx
// CONSIDERA REFACTORIZAR
// 1. Revisar si hay lógica extraíble
// 2. Buscar bloques JSX repetitivos
// 3. Evaluar complejidad
```

✅ **Componente < 150 líneas**

```tsx
// BIEN, pero monitorear
// Si crece más, planear refactorización
```

---

## ✅ Checklist de Refactorización

Usa esto cuando vayas a refactorizar un componente existente:

### Paso 1: Análisis

- [ ] ¿Cuántas líneas tiene el componente?
- [ ] ¿Cuántos `useState` tiene?
- [ ] ¿Cuántos `useEffect` tiene?
- [ ] ¿Hay lógica duplicada con otros componentes?
- [ ] ¿Hay bloques JSX repetitivos?

### Paso 2: Planificación

- [ ] Identificar lógica para extraer a hooks
- [ ] Identificar UI para extraer a componentes
- [ ] Crear lista de hooks necesarios
- [ ] Crear lista de componentes necesarios
- [ ] Diseñar interfaces

### Paso 3: Crear Estructura

```bash
feature/
├── _interfaces/
│   └── featureInterfaces.ts  # ← Crear PRIMERO
├── _hooks/
│   ├── useFeatureLogic.tsx   # ← Crear hooks
│   └── useFeatureData.tsx
└── _components/
    ├── SubComponent1.tsx      # ← Crear componentes
    └── SubComponent2.tsx
```

### Paso 4: Implementación

- [ ] Crear archivo de interfaces
- [ ] Implementar hooks (de lo más simple a lo más complejo)
- [ ] Implementar componentes UI puros
- [ ] Refactorizar componente principal
- [ ] Actualizar imports

### Paso 5: Verificación

- [ ] Build compila sin errores
- [ ] Tests existentes pasan
- [ ] No hay warnings nuevos de TypeScript
- [ ] No hay violations de ESLint
- [ ] Componente principal < 150 líneas
- [ ] Cada hook tiene responsabilidad clara
- [ ] Cada componente tiene responsabilidad clara

---

## 🎨 Patrones Establecidos

### Patrón: Lista con Filtrado

```tsx
// 1. Hook de filtrado específico
// _hooks/useItemsFilter.tsx
export const useItemsFilter = () => {
  const [statusFilter, setStatusFilter] = useState('all');

  const filter Predicate = useMemo(() => {
    return (item) => {
      if (statusFilter === 'all') return true;
      return item.status === statusFilter;
    };
  }, [statusFilter]);

  return { statusFilter, setStatusFilter, filterPredicate };
};

// 2. Hook genérico de lista
// Usar useListFilter.tsx del global

// 3. Componente principal
export const ItemsList = ({ params }) => {
  const { data, isLoading } = getItems(params);

  const { statusFilter, setStatusFilter, filterPredicate } = useItemsFilter();
  const { searchTerm, setSearchTerm, filteredData } = useListFilter({
    data,
    searchFields: (item) => [item.name, item.description],
    filterPredicate,
  });

  const { handleBack } = useBackNavigation(params);

  return (
    <div>
      <ListHeader {...headerProps} />
      <SearchAndFilter {...filterProps} />
      {filteredData?.length > 0 ? (
        <Table data={filteredData} />
      ) : (
        <EmptyState {...emptyProps} />
      )}
    </div>
  );
};
```

### Patrón: Página con Permisos

```tsx
// 1. Hook de permisos
export const useFeaturePermissions = () => {
  const user = useStore($user);
  const feature = useStore($feature);

  const isAdmin = useMemo(() => {
    // Lógica de permisos
  }, [user, feature]);

  return { isAdmin, canEdit, canDelete };
};

// 2. Componente de página
export const FeaturePage = ({ params }) => {
  const { data, refetch } = useFeatureData(params);
  const { isAdmin, canEdit } = useFeaturePermissions();
  const { handleBack } = useNavigation(params);

  return (
    <div>
      <PageHeader onBack={handleBack} showActions={canEdit} />
      <FeatureContent data={data} />
      {isAdmin && <AdminControls />}
    </div>
  );
};
```

### Patrón: Modal/Form Complejo

```tsx
// 1. Hook de form
export const useFeatureForm = (initialData) => {
  const [form, setForm] = useState(initialData);
  const [isValid, setIsValid] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validate = useMemo(() => {
    // Lógica de validación
  }, [form]);

  useEffect(() => {
    setIsValid(validate());
  }, [validate]);

  return { form, isValid, handleChange, setForm };
};

// 2. Componente de modal
export const FeatureModal = ({ isOpen, onClose, initialData }) => {
  const { form, isValid, handleChange } = useFeatureForm(initialData);
  const { mutate, isPending } = useCreateFeature();

  const handleSubmit = () => {
    if (!isValid) return;
    mutate(form, {
      onSuccess: () => onClose(),
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <FormSection1 data={form} onChange={handleChange} />
      <FormSection2 data={form} onChange={handleChange} />
      <ModalFooter>
        <Button onClick={handleSubmit} isLoading={isPending}>
          Guardar
        </Button>
      </ModalFooter>
    </Modal>
  );
};
```

---

## ❌ Anti-Patrones a Evitar

### 1. Componentes Monolíticos

```tsx
// ❌ MAL: Todo en un componente (300+ líneas)
export const HugeComponent = () => {
  const [state1, setState1] = useState();
  const [state2, setState2] = useState();
  // ... 10 más estados

  useEffect(() => {
    /* 50 líneas */
  }, []);
  useEffect(() => {
    /* 50 líneas */
  }, []);
  // ... más effects

  const helper1 = () => {
    /* 30 líneas */
  };
  const helper2 = () => {
    /* 30 líneas */
  };
  // ... más helpers

  return <div>{/* 100+ líneas de JSX */}</div>;
};

// ✅ BIEN: Dividido
export const ProperComponent = () => {
  const logic = useComponentLogic();
  const data = useComponentData();

  return (
    <div>
      <Header {...headerProps} />
      <Content {...contentProps} />
      <Footer {...footerProps} />
    </div>
  );
};
```

### 2. Props Drilling Excesivo

```tsx
// ❌ MAL: Pasando props por muchos niveles
<GrandParent data={data}>
  <Parent data={data}>
    <Child data={data}>
      <GrandChild data={data} />
    </Child>
  </Parent>
</GrandParent>;

// ✅ BIEN: Usar context o store
const data = useStore($data);
```

### 3. Lógica en el JSX

```tsx
// ❌ MAL: Cálculos complejos en el render
<div>
  {items
    .filter((x) => x.active)
    .map((x) => ({ ...x, computed: x.a + x.b }))
    .sort((a, b) => a.computed - b.computed)
    .map((item) => (
      <Item key={item.id} {...item} />
    ))}
</div>;

// ✅ BIEN: Mover a useMemo o hook
const processedItems = useMemo(() => {
  return items
    .filter((x) => x.active)
    .map((x) => ({ ...x, computed: x.a + x.b }))
    .sort((a, b) => a.computed - b.computed);
}, [items]);

return (
  <div>
    {processedItems.map((item) => (
      <Item key={item.id} {...item} />
    ))}
  </div>
);
```

### 4. Interfaces Inline

```tsx
// ❌ MAL: Tipos inline
const Component = ({ data }: { data: { id: number; name: string } }) => {
  // ...
};

// ✅ BIEN: Interfaces centralizadas
// _interfaces/featureInterfaces.ts
export interface ComponentProps {
  data: FeatureData;
}

export interface FeatureData {
  id: number;
  name: string;
}

// Component.tsx
const Component = ({ data }: ComponentProps) => {
  // ...
};
```

### 5. Efectos Sin Cleanup

```tsx
// ❌ MAL: Event listener sin cleanup
useEffect(() => {
  window.addEventListener('resize', handleResize);
}, []);

// ✅ BIEN: Con cleanup
useEffect(() => {
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}, []);
```

---

## 📚 Ejemplos Completos del Proyecto

### Ejemplo 1: Refactorización de EventAdminPage

**Antes:** 285 líneas, todo mezclado

**Después:** 90 líneas + infraestructura

```
Creado:
├── _hooks/
│   ├── useEventPermissions.tsx   (Lógica de permisos)
│   └── useEventUpdates.tsx       (Event listeners)
├── _components/
│   ├── EventAdminHeader.tsx      (Header UI)
│   ├── EventInfoCard.tsx         (Info display)
│   ├── EventQuickActions.tsx     (Action buttons)
│   └── EventStatsCard.tsx        (Stats display)
└── _interfaces/
    └── eventAdminInterfaces.ts   (Todos los tipos)
```

### Ejemplo 2: Infraestructura de Listas

**Componentes afectados:** `EventsOfBand`, `SongsOfBand`

**Solución:** Componentes y hooks compartidos

```
/global/
├── hooks/
│   ├── useListFilter.tsx        (Genérico)
│   └── useBackNavigation.tsx    (Genérico)
├── components/
│   ├── ListHeader.tsx           (Compartido)
│   ├── SearchAndFilter.tsx      (Compartido)
│   └── EmptyState.tsx           (Compartido)
└── interfaces/
    └── listComponentsInterfaces.ts

/eventos/_hooks/
└── useEventsFilter.tsx          (Específico)

/canciones/_hooks/
└── useSongsFilter.tsx           (Específico)
```

**Resultado:**

- EventsOfBand: 250 → 180 líneas (28% ↓)
- SongsOfBand: 244 → 175 líneas (28% ↓)
- ~80% duplicación eliminada

### Ejemplo 3: Live Event Module

**Problema:** Lógica de permisos duplicada

**Solución:** Hook compartido

```tsx
// Antes: Lógica duplicada en EventByIdPage y EventControls

// Después: Hook compartido
// _hooks/useEventPermissions.tsx
export const useEventPermissions = () => {
  const user = useStore($user);
  const event = useStore($event);

  const isSystemAdmin = useMemo(() => {
    return user?.isLoggedIn && user?.roles.includes(userRoles.admin.id);
  }, [user]);

  const isAdminEvent = useMemo(() => {
    return Boolean(bandMembership?.isAdmin || isSystemAdmin);
  }, [bandMembership, isSystemAdmin]);

  // ... más lógica compartida

  return { isSystemAdmin, isAdminEvent, isEventManager, isBandMemberOnly };
};

// Uso en ambos componentes
const { isAdminEvent, showActionButtons } = useEventPermissions();
```

**Resultado:**

- EventByIdPage: 213 → 90 líneas (58% ↓)
- EventControls: 105 → 75 líneas (29% ↓)
- Duplicación eliminada 100%

---

## 🚀 Flujo de Trabajo Recomendado

### Para CREAR un Nuevo Feature

1. **Planificación** (5-10 min)

   - Listar componentes necesarios
   - Identificar hooks necesarios
   - Diseñar estructura de carpetas

2. **Crear Estructura** (2-3 min)

   ```bash
   mkdir feature/_components
   mkdir feature/_hooks
   mkdir feature/_interfaces
   touch feature/_interfaces/featureInterfaces.ts
   ```

3. **Interfaces Primero** (5-10 min)

   - Definir todos los tipos
   - Props de componentes
   - Props de hooks

4. **Hooks** (Variable)

   - Implementar de lo simple a lo complejo
   - Probar cada hook individualmente

5. **Componentes UI** (Variable)

   - Crear componentes puros primero
   - Componer en componente principal

6. **Verificación** (5 min)
   - Build sin errores
   - Lints sin warnings
   - Tests pasan

### Para REFACTORIZAR un Componente Existente

1. **Análisis** (10-15 min)

   - Contar líneas
   - Identificar responsabilidades
   - Buscar duplicación

2. **Plan de Extracción** (10 min)

   - Qué lógica → hooks
   - Qué UI → componentes
   - Qué tipos → interfaces

3. **Crear Interfaces** (5 min)

   - Extraer todas las interfaces primero

4. **Extraer Hooks** (Variable)

   - Uno a la vez
   - Testear que funcione

5. **Extraer Componentes** (Variable)

   - UI puro primero
   - Componer después

6. **Refactorizar Principal** (15-20 min)

   - Usar nuevos hooks
   - Componer componentes
   - Limpiar código

7. **Verificación** (10 min)
   - Build
   - Tests
   - Comparar líneas antes/después

---

## 🎯 Métricas de Éxito

### Componente Bien Refactorizado

✅ **Líneas de Código**

- Componente principal < 150 líneas
- Cada hook < 100 líneas
- Cada sub-componente < 80 líneas

✅ **Acoplamiento**

- Props claramente definidas
- Sin prop drilling > 2 niveles
- Dependencies mínimas

✅ **Cohesión**

- Cada módulo hace UNA cosa
- Responsabilidades claras
- Nombres descriptivos

✅ **Testabilidad**

- Hooks testeables independientemente
- Componentes con props mockables
- Sin lógica compleja en JSX

✅ **Mantenibilidad**

- Fácil encontrar código
- Fácil hacer cambios
- Fácil agregar features

---

## 🧪 Testing

Testing es una parte **esencial** del desarrollo frontend. Todo componente y hook debe tener tests completos.

### Filosofía de Testing en Frontend

- **Component Tests**: Testear comportamiento del usuario
- **Hook Tests**: Testear lógica aislada
- **Integration Tests**: Testear flujos completos
- **Mocking**: Mockear dependencias externas (NextUI, nanostores, APIs)
- **Coverage**: Mínimo 80% de cobertura de código

### Herramientas de Testing

- **Jest**: Test runner y framework de testing
- **React Testing Library**: Testing de componentes React
- **@testing-library/user-event**: Simulación de interacciones del usuario
- **@testing-library/react-hooks**: Testing de custom hooks

---

## 🧪 Mocking Crítico: NextUI y Nanostores

### Patrón: Mock de NextUI Components

NextUI components deben ser mockeados antes de cualquier import para evitar problemas con SSR y dependencies.

```typescript
// ✅ SIEMPRE AL INICIO DEL ARCHIVO DE TEST
jest.mock('@nextui-org/react', () => ({
  Button: ({
    children,
    as,
    className,
    endContent,
    startContent,
    isLoading,
    isDisabled,
    disabled,
    type,
    onClick,
    onPress,
    ...props
  }: {
    children: React.ReactNode;
    as?: React.ElementType;
    className?: string;
    endContent?: React.ReactNode;
    startContent?: React.ReactNode;
    isLoading?: boolean;
    isDisabled?: boolean;
    disabled?: boolean;
    type?: 'button' | 'submit' | 'reset';
    onClick?: () => void;
    onPress?: () => void;
    [key: string]: unknown;
  }) => {
    const isButtonDisabled = isDisabled || disabled || isLoading;

    if (as) {
      const Component = as;
      return (
        <Component
          className={className}
          disabled={isButtonDisabled}
          data-loading={isLoading}
          onClick={onClick}
          {...props}
        >
          {startContent}
          {children}
          {endContent}
        </Component>
      );
    }
    return (
      <button
        className={className}
        disabled={isButtonDisabled}
        data-loading={isLoading}
        type={type}
        onClick={onClick || onPress}
        {...props}
      >
        {startContent}
        {children}
        {endContent}
      </button>
    );
  },
}));
```

### Patrón: Mock de NextUIProvider

```typescript
// ✅ Mock para Provider de NextUI
jest.mock('@nextui-org/react', () => ({
  NextUIProvider: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="nextui-provider">{children}</div>
  ),
}));
```

### Patrón: Mock de Nanostores

**CRÍTICO**: Los mocks de nanostores deben ir AL PRINCIPIO del archivo de test, antes de cualquier import.

```typescript
// ✅ SIEMPRE PRIMERO - Mock nanostores
jest.mock('nanostores', () => ({
  atom: jest.fn((initialValue) => ({
    get: jest.fn(() => initialValue),
    set: jest.fn(),
    subscribe: jest.fn(() => jest.fn()),
  })),
}));

jest.mock('@nanostores/react', () => ({
  useStore: jest.fn((store) => store.get()),
}));

// Después de los mocks, imports normales
import { render, screen } from '@testing-library/react';
import { MyComponent } from './MyComponent';
```

### Patrón: Mock de React Query

```typescript
jest.mock('@tanstack/react-query', () => {
  const actualModule = jest.requireActual('@tanstack/react-query');
  return {
    ...actualModule,
    QueryClient: jest.fn().mockImplementation(() => ({
      mount: jest.fn(),
      unmount: jest.fn(),
      getQueryCache: jest.fn(() => ({ find: jest.fn() })),
      getMutationCache: jest.fn(() => ({ find: jest.fn() })),
      isFetching: jest.fn(() => 0),
      isMutating: jest.fn(() => 0),
      defaultOptions: {},
    })),
    QueryClientProvider: ({
      children,
      client,
    }: {
      children: React.ReactNode;
      client?: any;
    }) => {
      const realQueryClient =
        client ||
        new actualModule.QueryClient({
          defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false },
          },
        });
      return (
        <div data-testid="query-client-provider">
          <actualModule.QueryClientProvider client={realQueryClient}>
            {children}
          </actualModule.QueryClientProvider>
        </div>
      );
    },
  };
});
```

### Patrón: Mock de Next.js Link

```typescript
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode;
    href: string;
  }) => {
    return <a href={href}>{children}</a>;
  },
}));
```

---

## 🧪 Testing de Componentes

### Anatomía de un Test de Componente

```typescript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PrimaryButton } from './PrimaryButton';

// ✅ Mocks al inicio
jest.mock('@nextui-org/react', () => ({
  Button: ({ children, onClick, ...props }: any) => (
    <button onClick={onClick} {...props}>
      {children}
    </button>
  ),
}));

describe('PrimaryButton', () => {
  describe('Component Rendering', () => {
    it('should render children correctly', () => {
      render(<PrimaryButton>Click me</PrimaryButton>);

      expect(screen.getByText('Click me')).toBeInTheDocument();
    });

    it('should render as a link when href is provided', () => {
      render(<PrimaryButton href="/auth/login">Iniciar sesión</PrimaryButton>);

      const link = screen.getByRole('link');
      expect(link).toBeInTheDocument();
      expect(link).toHaveAttribute('href', '/auth/login');
    });

    it('should render as a button when onClick is provided', () => {
      const handleClick = jest.fn();
      render(<PrimaryButton onClick={handleClick}>Guardar</PrimaryButton>);

      const button = screen.getByRole('button');
      expect(button).toBeInTheDocument();
    });
  });

  describe('Styling', () => {
    it('should apply correct CSS classes', () => {
      render(<PrimaryButton onClick={() => {}}>Test</PrimaryButton>);

      const button = screen.getByRole('button');
      expect(button.className).toContain('bg-brand-purple-600');
      expect(button.className).toContain('text-white');
    });

    it('should merge custom className', () => {
      render(
        <PrimaryButton onClick={() => {}} className="custom-class">
          Test
        </PrimaryButton>,
      );

      const button = screen.getByRole('button');
      expect(button.className).toContain('bg-brand-purple-600');
      expect(button.className).toContain('custom-class');
    });
  });

  describe('User Interactions', () => {
    it('should call onClick when clicked', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();

      render(<PrimaryButton onClick={handleClick}>Click me</PrimaryButton>);

      const button = screen.getByRole('button');
      await user.click(button);

      expect(handleClick).toHaveBeenCalledTimes(1);
    });

    it('should not call onClick when disabled', async () => {
      const user = userEvent.setup();
      const handleClick = jest.fn();

      render(
        <PrimaryButton onClick={handleClick} disabled>
          Disabled
        </PrimaryButton>,
      );

      const button = screen.getByRole('button');
      await user.click(button);

      expect(handleClick).not.toHaveBeenCalled();
    });
  });

  describe('Props Forwarding', () => {
    it('should forward isLoading prop', () => {
      render(<PrimaryButton isLoading={true}>Loading...</PrimaryButton>);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('data-loading', 'true');
      expect(button).toBeDisabled();
    });

    it('should forward type prop', () => {
      render(<PrimaryButton type="submit">Submit</PrimaryButton>);

      const button = screen.getByRole('button');
      expect(button).toHaveAttribute('type', 'submit');
    });
  });
});
```

---

## 🧪 Testing de Custom Hooks

### Patrón: Test de Hooks con renderHook

```typescript
import { renderHook, waitFor, act } from '@testing-library/react';
import { useIsClient } from './useIsClient';

describe('useIsClient', () => {
  it('should return false on initial render (SSR)', () => {
    const { result } = renderHook(() => useIsClient());

    expect(result.current).toBe(false);
  });

  it('should return true after mounting (client)', async () => {
    const { result } = renderHook(() => useIsClient());

    await waitFor(() => {
      expect(result.current).toBe(true);
    });
  });
});
```

### Patrón: Test de Hooks con React Query

```typescript
import { renderHook, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { getEventsById } from './eventByIdService';

describe('getEventsById', () => {
  let queryClient: QueryClient;

  beforeEach(() => {
    queryClient = new QueryClient({
      defaultOptions: {
        queries: { retry: false },
        mutations: { retry: false },
      },
    });

    global.fetch = jest.fn();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('should fetch event by id successfully', async () => {
    const mockEvent = {
      id: 1,
      title: 'Test Event',
      date: '2025-12-31',
    };

    (global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockEvent,
    });

    const wrapper = ({ children }: { children: React.ReactNode }) => (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );

    const { result } = renderHook(
      () => getEventsById({ bandId: '1', eventId: '1' }),
      { wrapper },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockEvent);
  });
});
```

### Patrón: Test de Hooks con Timers

```typescript
import { renderHook, act } from '@testing-library/react';
import { useTokenRefresh } from './useTokenRefresh';

describe('useTokenRefresh', () => {
  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.runOnlyPendingTimers();
    jest.useRealTimers();
  });

  it('should refresh token every 5 minutes', async () => {
    const mockRefresh = jest.fn().mockResolvedValue(true);

    renderHook(() => useTokenRefresh());

    // Avanzar 5 minutos
    act(() => {
      jest.advanceTimersByTime(5 * 60 * 1000);
    });

    expect(mockRefresh).toHaveBeenCalledTimes(1);
  });
});
```

---

## 🧪 Testing con Nanostores

### Patrón: Test de Componentes que usan Nanostores

```typescript
// ✅ Mock nanostores PRIMERO
jest.mock('nanostores', () => ({
  atom: jest.fn((initialValue) => ({
    get: jest.fn(() => initialValue),
    set: jest.fn(),
    subscribe: jest.fn(() => jest.fn()),
  })),
}));

jest.mock('@nanostores/react', () => ({
  useStore: jest.fn((store) => store.get()),
}));

import { render, screen } from '@testing-library/react';
import { useStore } from '@nanostores/react';
import { $user } from '@global/stores/userStore';
import { UserProfile } from './UserProfile';

const mockUseStore = useStore as jest.MockedFunction<typeof useStore>;

describe('UserProfile with nanostores', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should display user name from store', () => {
    // ✅ Mock del valor del store
    mockUseStore.mockReturnValue({
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
    });

    render(<UserProfile />);

    expect(screen.getByText('John Doe')).toBeInTheDocument();
  });

  it('should show loading when user is null', () => {
    mockUseStore.mockReturnValue(null);

    render(<UserProfile />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });
});
```

---

## 🧪 Comandos de Testing

```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch
npm run test:watch

# Ejecutar tests con coverage
npm run test:coverage

# Ejecutar tests de un archivo específico
npm test PrimaryButton.test.tsx

# Ejecutar tests que coincidan con un patrón
npm test -- --testNamePattern="should render"

# Ejecutar tests con verbose output
npm test -- --verbose
```

---

## 🧪 Matchers Útiles de React Testing Library

```typescript
// ✅ Queries básicas
screen.getByText('texto'); // Error si no encuentra
screen.queryByText('texto'); // null si no encuentra
screen.findByText('texto'); // Async, espera a que aparezca
screen.getAllByText('texto'); // Array de elementos

// ✅ Queries por rol
screen.getByRole('button');
screen.getByRole('link');
screen.getByRole('textbox');
screen.getByRole('heading', { level: 1 });

// ✅ Queries por test id
screen.getByTestId('submit-button');

// ✅ Assertions comunes
expect(element).toBeInTheDocument();
expect(element).toBeVisible();
expect(element).toBeDisabled();
expect(element).toHaveTextContent('texto');
expect(element).toHaveAttribute('href', '/path');
expect(element).toHaveClass('className');
expect(element).toHaveStyle({ color: 'red' });

// ✅ User events
import userEvent from '@testing-library/user-event';

const user = userEvent.setup();
await user.click(button);
await user.type(input, 'texto');
await user.clear(input);
await user.selectOptions(select, 'option1');
await user.hover(element);
await user.keyboard('{Enter}');
```

---

## 🧪 Patrones de Testing

### Patrón: AAA (Arrange, Act, Assert)

```typescript
it('should update count when button is clicked', async () => {
  // ✅ ARRANGE: Preparar el test
  const user = userEvent.setup();
  render(<Counter initialCount={0} />);

  // ✅ ACT: Ejecutar la acción
  const button = screen.getByRole('button', { name: /increment/i });
  await user.click(button);

  // ✅ ASSERT: Verificar el resultado
  expect(screen.getByText('Count: 1')).toBeInTheDocument();
});
```

### Patrón: Test de Estados de Carga

```typescript
describe('Loading states', () => {
  it('should show loading state initially', () => {
    const { result } = renderHook(() => useEventData({ eventId: '1' }));

    expect(result.current.isLoading).toBe(true);
  });

  it('should show success state after loading', async () => {
    const { result } = renderHook(() => useEventData({ eventId: '1' }));

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });
  });

  it('should show error state on failure', async () => {
    (global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Failed'));

    const { result } = renderHook(() => useEventData({ eventId: '1' }));

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });
});
```

### Patrón: Test de Formularios

```typescript
describe('LoginForm', () => {
  it('should submit form with valid data', async () => {
    const user = userEvent.setup();
    const handleSubmit = jest.fn();

    render(<LoginForm onSubmit={handleSubmit} />);

    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    const submitButton = screen.getByRole('button', { name: /login/i });

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.click(submitButton);

    expect(handleSubmit).toHaveBeenCalledWith({
      email: 'test@example.com',
      password: 'password123',
    });
  });

  it('should show validation errors', async () => {
    const user = userEvent.setup();
    render(<LoginForm onSubmit={jest.fn()} />);

    const submitButton = screen.getByRole('button', { name: /login/i });
    await user.click(submitButton);

    expect(screen.getByText(/email is required/i)).toBeInTheDocument();
    expect(screen.getByText(/password is required/i)).toBeInTheDocument();
  });
});
```

---

## 🧪 Mejores Prácticas de Testing

### ✅ DO: Queries Semánticas

```typescript
// ✅ BIEN: Queries por rol/label (accesibles)
screen.getByRole('button', { name: /submit/i });
screen.getByLabelText(/email/i);
screen.getByText(/welcome/i);

// ❌ MAL: Queries por clase o ID (frágiles)
container.querySelector('.button-submit');
screen.getByTestId('submit-btn'); // Solo como último recurso
```

### ✅ DO: Test User Behavior, Not Implementation

```typescript
// ✅ BIEN: Testing comportamiento del usuario
it('should add item to cart when clicked', async () => {
  const user = userEvent.setup();
  render(<ProductCard product={mockProduct} />);

  const addButton = screen.getByRole('button', { name: /add to cart/i });
  await user.click(addButton);

  expect(screen.getByText(/item added/i)).toBeInTheDocument();
});

// ❌ MAL: Testing detalles de implementación
it('should call useState when clicked', () => {
  // Testing internal React hooks
});
```

### ✅ DO: Nombres Descriptivos

```typescript
// ✅ BIEN: Describe qué hace y qué espera
it('should display error message when email is invalid', async () => {
  // ...
});

// ❌ MAL: Nombre vago
it('should work', () => {
  // ...
});
```

### ✅ DO: Test Aislados

```typescript
// ✅ BIEN: Cada test es independiente
describe('Counter', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('test 1', () => {
    // Independiente
  });

  it('test 2', () => {
    // Independiente
  });
});
```

### ✅ DO: waitFor para Operaciones Async

```typescript
// ✅ BIEN: Usar waitFor para async
it('should load data', async () => {
  render(<DataComponent />);

  await waitFor(() => {
    expect(screen.getByText('Loaded')).toBeInTheDocument();
  });
});

// ❌ MAL: No esperar
it('should load data', () => {
  render(<DataComponent />);
  expect(screen.getByText('Loaded')).toBeInTheDocument(); // ❌ Falla
});
```

---

## 🧪 Coverage Requirements

### Mínimos Requeridos

- **Statements**: 80%
- **Branches**: 75%
- **Functions**: 80%
- **Lines**: 80%

### Ver Coverage

```bash
npm run test:coverage
```

Esto genera un reporte HTML en `coverage/lcov-report/index.html`.

---

## 🧪 Checklist de Testing

Al crear un nuevo componente o hook:

- [ ] Test de renderizado básico
- [ ] Test de props
- [ ] Test de user interactions
- [ ] Test de estados de carga (loading, success, error)
- [ ] Test de edge cases
- [ ] Test de accessibility (roles, labels)
- [ ] Mocks correctos de dependencias
- [ ] Coverage mínimo del 80%

---

## 📖 Glosario

**Component** - Función React que retorna JSX

**Hook** - Función que empieza con `use` y puede usar hooks de React

**Pure Component** - Componente sin estado interno ni efectos secundarios

**Container Component** - Componente que maneja lógica y orquesta otros componentes

**Custom Hook** - Hook creado por nosotros para encapsular lógica reutilizable

**Interface** - Tipo TypeScript que define la forma de un objeto

**Props** - Argumentos que recibe un componente

**State** - Datos que pueden cambiar y causan re-renders

**Effect** - Código que se ejecuta después del render (useEffect)

**Memoization** - Cachear resultados de cálculos costosos (useMemo, useCallback)

---

## 🔗 Recursos del Proyecto

- `final_summary.md` - Resumen completo del proyecto de refactorización
- `walkthrough.md` - Registro detallado de todas las fases
- `task.md` - Lista de tareas completadas

---

**Última actualización:** 2025-11-24  
**Versión:** 1.0  
**Maintainer:** Leo VP
