import { PlanType } from '@bands/[bandId]/suscripcion/_interfaces/subscription.interface';

/**
 * Pricing Page Content
 * Contenido estático para la página de pricing de Zamr
 */

// ============================================
// EXPLICACIÓN DEL NOMBRE
// ============================================
export const zamrNameExplanation = {
  title: 'Zamr',
  subtitle: 'Del hebreo "Zamar" (זָמַר)',
  meaning: 'Alabar a Dios con instrumentos y voces',
  description:
    'Exactamente lo que hacen los usuarios de nuestra aplicación: adorar con excelencia usando tecnología moderna.',
};

// ============================================
// FAQS
// ============================================
export const pricingFAQs = [
  {
    question: '¿Cómo funciona el trial de 15 días?',
    answer:
      'Obtienes acceso completo a todas las funciones de Zamr durante 15 días, sin costo alguno. Puedes usarlo en tus presentaciones reales, preparar eventos, y experimentar todos los beneficios. No necesitas tarjeta de crédito para comenzar.',
  },
  {
    question: '¿Necesito tarjeta de crédito para el trial?',
    answer:
      'No. Puedes comenzar tu prueba gratuita de 15 días sin proporcionar ninguna información de pago. Solo necesitas crear una cuenta con tu número de teléfono.',
  },
  {
    question: '¿Qué es el modo proyector?',
    answer:
      'El modo proyector es una función profesional que muestra solo las letras de las canciones (sin acordes) en la pantalla principal de tu iglesia o evento, con hermosos fondos animados en video. Mientras tanto, los músicos pueden ver los acordes en sus dispositivos personales. Perfecto para mantener a la congregación enfocada en la adoración.',
  },
  {
    question: '¿Es difícil de usar?',
    answer:
      'No. Zamr está diseñado para ser intuitivo y fácil de usar. De hecho, tenemos usuarios adultos mayores que lo usan sin problemas para tocar canciones modernas. Si sabes usar WhatsApp, puedes usar Zamr.',
  },
  {
    question: '¿Puedo cambiar de plan después?',
    answer:
      'Sí, puedes actualizar o cambiar tu plan en cualquier momento. Los cambios se reflejan inmediatamente y solo pagas la diferencia prorrateada.',
  },
  {
    question: '¿Qué métodos de pago aceptan?',
    answer:
      'Aceptamos transferencias bancarias, Sinpe Móvil, y PayPal. Una vez que selecciones tu plan, te contactaremos por WhatsApp con las instrucciones específicas de pago.',
  },
  {
    question: '¿Qué pasa si cancelo mi suscripción?',
    answer:
      'Puedes cancelar en cualquier momento. Mantendrás acceso hasta el final de tu período de pago actual. Tus datos se conservan por 30 días en caso de que decidas regresar.',
  },
  {
    question: '¿Qué viene próximamente en Zamr?',
    answer:
      'Estamos trabajando en: videos tutoriales y demostrativos, más contenido de discipulado, respaldo de pistas de YouTube (para cuando los músicos no puedan tocar en vivo), y más fondos animados profesionales para el modo proyector. ¡Y mucho más!',
  },
];

// ============================================
// TESTIMONIAL REAL
// ============================================
export const testimonials = [
  {
    quote:
      'Me encanta que puedo ver los acordes sin la notación americana (C, D, E). Como bajista que no sabe bien los cifrados, esta función es vital para mí. Ahora puedo tocar con confianza.',
    author: 'Gamaliel Serrano',
    role: 'Bajista',
    highlight: 'Accesibilidad musical',
  },
  {
    quote:
      'He subido muchísimas canciones a la app yo sola y sin ayuda. Es increíblemente fácil de usar y me ahorra horas de preparación cada semana.',
    author: 'Hillary',
    role: 'Cantante',
    highlight: 'Facilidad de uso',
  },
  {
    quote:
      'Me encargo de pasar las letras durante los eventos en vivo y es súper sencillo. El modo proyector hace que todo se vea profesional y la congregación lo nota.',
    author: 'Justin',
    role: 'Encargado de Eventos',
    highlight: 'Operación en vivo',
  },
];

// ============================================
// UPCOMING FEATURES
// ============================================
export const upcomingFeatures = [
  {
    title: 'Videos Tutoriales',
    description: 'Aprende a usar cada función con videos paso a paso',
    status: 'En desarrollo',
  },
  {
    title: 'Más Contenido de Discipulado',
    description: 'Recursos espirituales para crecer en tu ministerio',
    status: 'Próximamente',
  },
  {
    title: 'Respaldo de Pistas de YouTube',
    description:
      'Guarda pistas de respaldo para cuando los músicos no puedan tocar',
    status: 'En desarrollo',
  },
  {
    title: 'Más Fondos Animados',
    description: 'Biblioteca expandida de fondos profesionales para proyector',
    status: 'Próximamente',
  },
];

// ============================================
// BENEFICIOS UNIVERSALES (PARA TODOS LOS USUARIOS)
// ============================================
export const universalBenefits = [
  'Guardar canciones del Feed (para ver más tarde)',
  'Acceso completo al Feed Social',
  'Ver y comentar en la comunidad',
  'Perfil de usuario personalizable',
];

// ============================================
// BENEFICIOS DE GRUPO ACTIVO (REQUIERE PLAN)
// ============================================
export const activeGroupBenefits = [
  'Metrónomo Inteligente con subdivisiones',
  'Sincronización automática de letra y acordes',
  'Herramientas perfectas para ensayar en casa',
  'Próximamente: Setlists colaborativos',
];

// ============================================
// BENEFICIOS POR TIPO DE PLAN
// ============================================
export const planBenefits: Record<PlanType, string[]> = {
  [PlanType.TRIAL]: [
    '¡Todo incluido por 15 días!',
    'Acceso a Metrónomo y Sincronización',
    'Modo proyector con fondos animados',
    'Eventos en Vivo y con VideoLyrics',
  ],
  [PlanType.BASIC]: [
    'Acceso a Metrónomo y Sincronización',
    'Modo proyector profesional',
    'Gestión de repertorio',
    'Ideal para grupos pequeños',
  ],
  [PlanType.PROFESSIONAL]: [
    'Todo lo del plan Básico',
    'Más eventos por mes',
    'Soporte prioritario',
    'Perfecto para iglesias medianas',
  ],
  [PlanType.PREMIUM]: [
    'Todo lo del plan Profesional',
    'Soporte dedicado',
    'Ideal para iglesias grandes',
  ],
};

// ============================================
// BADGES Y LABELS
// ============================================
export const badges = {
  mostPopular: 'Más Popular',
  bestValue: 'Mejor Valor',
  recommended: 'Recomendado',
  comingSoon: 'Próximamente',
  new: 'Nuevo',
};

// ============================================
// MENSAJES DE MARKETING
// ============================================
export const marketingMessages = {
  hero: {
    title: 'Planes que se adaptan a tu ministerio',
    subtitle:
      'Comienza gratis por 15 días. Sin tarjeta de crédito. Úsalo en tu próxima presentación.',
    badge: '🎁 15 días gratis • Sin tarjeta de crédito',
  },
  trialCTA: {
    title: 'Úsalo en tu próxima presentación',
    subtitle: 'Sin costo, sin riesgo, sin tarjeta de crédito',
    description:
      '15 días completos para probarlo en eventos reales. Descubre por qué grupos de alabanza en toda Latinoamérica confían en Zamr.',
    buttonText: 'Comenzar mi prueba gratis de 15 días',
    socialProof:
      'Incluso adultos mayores están tocando canciones modernas con Zamr',
  },
  savings: {
    annual: 'Ahorra {percentage}% con el plan anual',
    monthly: 'Pago mensual',
  },
};

// ============================================
// HELPER FUNCTIONS
// ============================================
export const getBillingPeriodLabel = (durationDays: number | null): string => {
  if (durationDays === null || durationDays === 30) return 'mes';
  if (durationDays === 365) return 'año';
  return `${durationDays} días`;
};

export const calculateAnnualSavings = (
  annualPrice: number,
  monthlyPrice: number,
): { amount: number; percentage: number } => {
  const monthlyTotal = monthlyPrice * 12;
  const savings = monthlyTotal - annualPrice;
  const percentage = Math.round((savings / monthlyTotal) * 100);

  return {
    amount: savings,
    percentage,
  };
};
