# 🎵 Adorador - Frontend

<div align="center">
  <img src="./public/logo_adorador.avif" alt="Adorador Logo" width="200"/>
  
  **Herramientas profesionales para ministerios de alabanza e iglesias cristianas**
  
  [![Next.js](https://img.shields.io/badge/Next.js-14.2-black?logo=next.js)](https://nextjs.org/)
  [![React](https://img.shields.io/badge/React-18-blue?logo=react)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
</div>

---

## 📖 Descripción

**Adorador** es una plataforma web cristiana diseñada específicamente para ministerios de alabanza e iglesias. Proporciona herramientas modernas y profesionales para gestionar canciones, eventos en vivo, y recursos de discipulado, facilitando el trabajo de los equipos de adoración y liderazgo.

### 🎯 Propósito

Adorador nace de la necesidad de contar con herramientas digitales especializadas que permitan a los grupos de alabanza e iglesias:

- Organizar y gestionar su repertorio musical
- Dirigir servicios en vivo de forma profesional
- Proyectar letras de canciones a la congregación
- Gestionar eventos y ensayos
- Acceder a recursos de crecimiento espiritual

---

## ✨ Características Principales

### 🎸 Gestión de Grupos de Alabanza

- **Base de datos de canciones**: Almacena y organiza todas las canciones del repertorio del grupo
- **Acordes personalizados**: Guarda los acordes específicos de cada canción según el estilo del grupo
- **Información detallada**: Nombre, artista, tono, tipo (alabanza/adoración), y enlaces a recursos multimedia
- **Organización por eventos**: Vincula canciones a eventos específicos

### 🎤 Sistema de Eventos en Vivo

Una de las características más potentes de Adorador es su sistema de eventos en tiempo real:

#### Para el Líder/Músico:

- **Pantalla de control**: Interfaz completa con letras y acordes de las canciones
- **Cambio de canciones**: Navegación rápida entre canciones del evento
- **Control de letras**: Avanza o retrocede entre versos, coros, puentes, etc.
- **Mensajes en vivo**: Envía mensajes personalizados al proyector
- **Transposición de acordes**: Cambia el tono de las canciones en tiempo real
- **Notación configurable**: Alterna entre notación americana (C, D, E) y latina (Do, Re, Mi)
- **Modo pantalla completa**: Visualización optimizada para presentaciones

#### Para el Proyector/Congregación:

- **Vista simplificada**: Solo muestra la letra de las canciones
- **Sincronización en tiempo real**: Actualización automática vía WebSockets
- **Diseño optimizado**: Tipografía grande y legible para proyección
- **Mensajes en vivo**: Visualiza anuncios y mensajes del líder

#### Tecnología de Sincronización:

- **Socket.IO**: Comunicación bidireccional en tiempo real
- **Eventos específicos por reunión**: Múltiples eventos pueden ejecutarse simultáneamente
- **Sin latencia**: Cambios instantáneos entre pantallas
- **🆕 Actualización automática de canciones**: Los cambios en letras y acordes se reflejan en todos los eventos activos sin recargar
  - Frontend: ✅ Implementado
  - Backend: Ver [HOW_TO_IMPLEMENT.md](./HOW_TO_IMPLEMENT.md) o [AI_BACKEND_PROMPT.md](./AI_BACKEND_PROMPT.md)

### 📚 Sección de Discipulado

- **Artículos y recursos**: Contenido para el crecimiento espiritual
- **Categorización**: Organización por temas y fechas
- **SEO optimizado**: Metadatos completos para mejor visibilidad
- **Diseño responsive**: Lectura óptima en cualquier dispositivo

### 👥 Sistema de Usuarios y Roles

- **Autenticación JWT**: Sistema seguro de tokens con refresh automático
- **Roles de usuario**: Admin, moderador, editor, usuario estándar
- **Roles en la iglesia**: Pastor, líder de alabanza, músico, diácono, etc.
- **Gestión de permisos**: Control granular de accesos
- **Verificación de email**: Sistema de confirmación de cuentas

---

## 🛠️ Tecnologías Utilizadas

### Core

- **[Next.js 14](https://nextjs.org/)** - Framework React con App Router
- **[React 18](https://reactjs.org/)** - Biblioteca de interfaz de usuario
- **[TypeScript](https://www.typescriptlang.org/)** - Tipado estático
- **[Tailwind CSS](https://tailwindcss.com/)** - Framework de estilos utility-first

### UI/UX

- **[NextUI](https://nextui.org/)** - Biblioteca de componentes de React
- **[Framer Motion](https://www.framer.com/motion/)** - Animaciones fluidas
- **[React Hot Toast](https://react-hot-toast.com/)** - Notificaciones elegantes

### Estado y Datos

- **[Nanostores](https://github.com/nanostores/nanostores)** - Estado global minimalista
- **[TanStack Query](https://tanstack.com/query)** - Gestión de datos asincrónicos
- **[Socket.IO Client](https://socket.io/)** - Comunicación en tiempo real

### Utilidades

- **[React Player](https://github.com/cookpete/react-player)** - Reproductor multimedia
- **[React to Print](https://github.com/MatthewHerbst/react-to-print)** - Impresión de componentes
- **[@hello-pangea/dnd](https://github.com/hello-pangea/dnd)** - Drag and Drop (fork de react-beautiful-dnd)

---

## 📁 Estructura del Proyecto

```
adorador-frontend/
├── public/                      # Archivos estáticos
│   ├── logo_adorador.avif      # Logo de la aplicación
│   ├── fonts/                  # Fuentes personalizadas
│   └── images/                 # Imágenes (backgrounds, posts)
├── src/
│   ├── app/                    # App Router de Next.js
│   │   ├── (public)/          # Rutas públicas
│   │   │   ├── (home)/        # Página de inicio
│   │   │   ├── auth/          # Autenticación (login, registro, etc.)
│   │   │   ├── discipulado/   # Artículos de discipulado
│   │   │   └── grupos/        # Gestión de grupos de alabanza
│   │   │       └── [bandId]/  # Grupo específico
│   │   │           ├── canciones/      # Base de datos de canciones
│   │   │           │   └── [songId]/   # Detalles de canción
│   │   │           └── eventos/        # Eventos del grupo
│   │   │               └── [eventId]/  # Evento en vivo
│   │   └── (private)/         # Rutas privadas (admin)
│   │       └── admin/         # Panel de administración
│   └── global/                # Recursos globales
│       ├── config/            # Configuración y constantes
│       ├── content/           # Contenido estático (posts, autores)
│       ├── data/              # Datos JSON (códigos de país)
│       ├── hooks/             # Hooks personalizados
│       ├── icons/             # Componentes de iconos SVG
│       ├── interfaces/        # Tipos e interfaces TypeScript
│       ├── services/          # Servicios API
│       ├── stores/            # Estado global (nanostores)
│       └── utils/             # Utilidades y helpers
├── scripts/                   # Scripts de utilidad
├── next.config.mjs           # Configuración de Next.js
├── tailwind.config.ts        # Configuración de Tailwind
├── tsconfig.json             # Configuración de TypeScript
└── package.json              # Dependencias y scripts

```

### 📂 Convenciones de Carpetas

Cada funcionalidad principal sigue la estructura:

```
_components/    # Componentes React
_hooks/         # Hooks personalizados
_interfaces/    # Tipos TypeScript
_services/      # Llamadas API
_utils/         # Funciones auxiliares
```

### 🔗 Alias de Importación

```typescript
@bands/*    → app/(public)/grupos/*
@auth/*     → app/(public)/auth/*
@admin/*    → app/(private)/admin/*
@ui/*       → app/(public)/_ui/*
@stores/*   → global/stores/*
@global/*   → global/*
```

---

## 🚀 Instalación y Configuración

### Requisitos Previos

- **Node.js** 20.x o superior
- **npm**, **yarn**, **pnpm** o **bun**
- **Git**

### 1. Clonar el Repositorio

```bash
git clone https://github.com/Leotheprodu/adorador-frontend.git
cd adorador-frontend
```

### 2. Instalar Dependencias

```bash
npm install
# o
yarn install
# o
pnpm install
# o
bun install
```

### 3. Configurar Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto:

```env
# API Backend
NEXT_PUBLIC_API_URL_1=https://tu-api-backend.com

# Dominio de la aplicación
NEXT_PUBLIC_DOMAIN=https://tu-dominio.com
```

### 4. Ejecutar en Desarrollo

```bash
npm run dev
# o
yarn dev
# o
pnpm dev
# o
bun dev
```

La aplicación estará disponible en [http://localhost:5000](http://localhost:5000)

#### Desarrollo en Red Local

Para acceder desde otros dispositivos en la red:

```bash
npm run dev:cel
```

Esto ejecutará el servidor en `http://192.168.50.100:5000`

---

## 📜 Scripts Disponibles

```bash
npm run dev          # Inicia el servidor de desarrollo en puerto 5000
npm run dev:cel      # Inicia el servidor accesible en red local
npm run build        # Construye la aplicación para producción
npm run start        # Inicia el servidor de producción
npm run lint         # Ejecuta el linter de código
npm run structure    # Genera estructura de carpetas para nuevos módulos
```

---

## 🔐 Sistema de Autenticación

Adorador utiliza **JWT (JSON Web Tokens)** para la autenticación:

### Características:

- **Access Token**: Token de corta duración para operaciones
- **Refresh Token**: Token de larga duración para renovar access tokens
- **Renovación automática**: Hook que renueva tokens antes de expirar
- **Almacenamiento seguro**: Tokens guardados en localStorage
- **Manejo de expiración**: Redirección automática al login si los tokens expiran

### Flujo de Autenticación:

1. Usuario ingresa credenciales
2. Backend valida y retorna tokens JWT
3. Tokens se almacenan en localStorage
4. Cada petición incluye el access token en el header
5. Hook `useTokenRefresh` renueva tokens automáticamente cada 5 minutos
6. Si el refresh falla, se limpia el estado y se redirige al login

Para más detalles, consulta [JWT_MIGRATION.md](./JWT_MIGRATION.md)

---

## 🎨 Personalización de UI

### Temas y Colores

Editando `tailwind.config.ts`:

```typescript
colors: {
  blanco: '#ffffff',
  negro: '#000814',
  primario: '#FFFEFA',
  secundario: '#060606',
  terciario: '#FAFAFA',
}
```

### Componentes NextUI

La aplicación utiliza componentes seleccionados de NextUI:

- Button, Input, Select, Dropdown
- Modal, Table, Checkbox
- Spinner, Chip, Image
- Calendar, DatePicker

---

## 🌐 Integración con Backend

### Endpoints Principales

```typescript
// Autenticación
POST /auth/login
POST /auth/signup
POST /auth/refresh-token
POST /auth/verify-email

// Grupos
GET /bands/:bandId
POST /bands
PUT /bands/:bandId

// Canciones
GET /bands/:bandId/songs
POST /bands/:bandId/songs
PUT /bands/:bandId/songs/:songId

// Eventos
GET /bands/:bandId/events
POST /bands/:bandId/events
GET /bands/:bandId/events/:eventId
PUT /bands/:bandId/events/:eventId

// Usuarios
GET /users
GET /users/:userId
PUT /users/:userId
```

### WebSocket Events

```typescript
// Eventos en tiempo real
socket.on('lyricSelected-{eventId}', (data) => {});
socket.on('eventSelectedSong-{eventId}', (data) => {});
socket.on('liveMessage-{eventId}', (data) => {});
```

---

## 🔒 Seguridad

- ✅ Autenticación JWT con refresh tokens
- ✅ Validación de tokens en cada petición
- ✅ Rutas protegidas por roles
- ✅ Verificación de email obligatoria
- ✅ Headers de seguridad configurados
- ✅ HTTPS en producción
- ✅ CORS configurado adecuadamente

---

## 📱 Responsive Design

La aplicación es completamente responsive y se adapta a:

- 📱 **Móviles** (< 640px)
- 📱 **Tablets** (640px - 1024px)
- 💻 **Desktop** (> 1024px)
- 🖥️ **Pantallas grandes** (> 1920px)

---

## 🧪 Testing

_(Sección pendiente - Testing será implementado en futuras versiones)_

---

## 🚀 Despliegue

### Vercel (Recomendado)

1. Conecta tu repositorio a Vercel
2. Configura las variables de entorno
3. Despliega automáticamente

### Otras Plataformas

- **Netlify**: Compatible con Next.js
- **AWS Amplify**: Soporte completo
- **Docker**: Dockerfile incluido (próximamente)

---

## 🤝 Contribuir

Las contribuciones son bienvenidas. Por favor:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## 📝 Roadmap

### En Desarrollo

- [ ] Sistema de chat en tiempo real para coordinación del equipo
- [ ] Editor de acordes con tablatura interactiva
- [ ] Modo oscuro completo
- [ ] PWA para uso offline
- [ ] Aplicación móvil nativa

### Futuras Características

- [ ] Sistema de repertorio compartido entre iglesias
- [ ] Planificador de ensayos y asignación de tareas
- [ ] Métricas y estadísticas de uso de canciones
- [ ] Integración con YouTube y Spotify
- [ ] Sistema de donaciones integrado
- [ ] Multilenguaje (inglés, portugués)

---

## 📄 Licencia

Este proyecto es privado y pertenece a **adorador.xyz**. Todos los derechos reservados.

---

## 👨‍💻 Autor

**Leonardo Villalobos** - [@Leotheprodu](https://github.com/Leotheprodu)

---

## 📞 Soporte y Contacto

- **Web**: [adorador.xyz](https://adorador.xyz)
- **Email**: support@adorador.xyz
- **Issues**: [GitHub Issues](https://github.com/Leotheprodu/adorador-frontend/issues)

---

## 🙏 Agradecimientos

- A todas las iglesias y grupos de alabanza que nos han brindado feedback
- A la comunidad de desarrolladores cristianos
- A los contribuidores del proyecto

---

<div align="center">
  <p>Hecho con ❤️ para la gloria de Dios</p>
  <p><strong>"Cantad a Jehová cántico nuevo; Cantad a Jehová, toda la tierra"</strong></p>
  <p><em>Salmos 96:1</em></p>
</div>
