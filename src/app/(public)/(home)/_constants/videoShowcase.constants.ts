import { appName } from '@global/config/constants';

export const VIDEO_CHAPTERS = [
  {
    id: 1,
    label: 'Intro: El problema y la solución',
    timestamp: '0:00',
    seconds: 0,
    desc: `Origen de ${appName}: Resolver la proyección de letras y acordes simultáneamente.`,
  },
  {
    id: 2,
    label: 'Registro y Login vía WhatsApp',
    timestamp: '3:52',
    seconds: 232,
    desc: 'Sistema de autenticación seguro y sin costo usando un Bot de WhatsApp.',
  },
  {
    id: 3,
    label: 'Creación de Grupos y Miembros',
    timestamp: '5:57',
    seconds: 357,
    desc: 'Administración de equipos de alabanza e invitación de músicos.',
  },
  {
    id: 4,
    label: 'Gestión de Planes y Pagos',
    timestamp: '8:45',
    seconds: 525,
    desc: 'Suscripciones, métodos de pago (Sinpe/PayPal) y activación.',
  },
  {
    id: 5,
    label: 'Creando un Evento (Culto)',
    timestamp: '10:21',
    seconds: 621,
    desc: 'Armar el setlist, ordenar canciones y preparar el servicio.',
  },
  {
    id: 6,
    label: 'Modo en Vivo: Proyector vs. Músicos',
    timestamp: '12:06',
    seconds: 726,
    desc: 'Sincronización real-time: el público ve letras, los músicos ven acordes.',
  },
  {
    id: 7,
    label: 'Visualización Estructurada (Colores)',
    timestamp: '16:25',
    seconds: 985,
    desc: 'Diferenciación visual de Versos, Coros y Puentes para anticipar cambios.',
  },
  {
    id: 8,
    label: 'Feed Social y Compartir Canciones',
    timestamp: '19:00',
    seconds: 1140,
    desc: 'Comunidad para compartir cifrados, dar "Bless" y solicitar canciones.',
  },
  {
    id: 9,
    label: 'Sincronización Automática (Autoscroll)',
    timestamp: '21:20',
    seconds: 1280,
    desc: 'La app sigue la música automáticamente, marcando el acorde actual.',
  },
  {
    id: 10,
    label: 'Metrónomo Visual y Audio',
    timestamp: '23:32',
    seconds: 1412,
    desc: 'Herramientas de práctica integradas con el cifrado.',
  },
  {
    id: 11,
    label: 'Editor de Canciones',
    timestamp: '27:14',
    seconds: 1634,
    desc: 'Modificar letras, cambiar acordes y personalizar cifrados.',
  },
];

export const VIDEO_HIGHLIGHTS = [
  {
    icon: 'RefreshIcon',
    title: 'Sincronización en Tiempo Real',
    desc: 'Lo que cambia el líder se refleja instantáneamente en el proyector y los dispositivos de todos los músicos.',
    color: 'blue',
  },
  {
    icon: 'LayoutIcon',
    title: 'Vistas Diferenciadas',
    desc: 'Letra grande y fondos animados para el <strong>Público</strong>. Acordes y fondo oscuro para <strong>Músicos</strong>.',
    color: 'indigo',
  },
  {
    icon: 'BrandWhatsappIcon',
    title: 'Login vía WhatsApp',
    desc: 'Autenticación simple, segura y sin contraseñas. Ideal para gestionar voluntarios rápidamente.',
    color: 'purple',
  },
];
