export function getNextPaymentDate(
  currentDateString: string | Date,
  format: 'iso' | 'yyyy-MM-dd' = 'iso',
): string {
  const currentDate = new Date(currentDateString);

  // Obtener el día actual
  const currentDay = currentDate.getDate();

  // Ajustar al próximo mes
  currentDate.setMonth(currentDate.getMonth() + 1);

  // Ajustar al día deseado, o al último día del mes si no existe ese día
  currentDate.setDate(currentDay);
  if (currentDate.getDate() !== currentDay) {
    // Si el día ajustado es diferente, significa que el mes no tiene ese día
    currentDate.setDate(0); // Esto ajusta al último día del mes anterior
  }

  // Devolver el resultado en el formato deseado
  if (format === 'iso') {
    return currentDate.toISOString();
  } else if (format === 'yyyy-MM-dd') {
    // Formatear la fecha como "yyyy-MM-dd"
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  } else {
    throw new Error('Formato no soportado');
  }
}

/**
 * Formatea una fecha como texto relativo (ej: "hace 5 minutos", "hace 2 horas")
 */
export function formatRelativeTime(date: string | Date): string {
  const now = new Date();
  const targetDate = new Date(date);
  const diffInMs = now.getTime() - targetDate.getTime();
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);
  const diffInMonths = Math.floor(diffInDays / 30);
  const diffInYears = Math.floor(diffInDays / 365);

  if (diffInSeconds < 60) {
    return 'hace unos segundos';
  } else if (diffInMinutes < 60) {
    return `hace ${diffInMinutes} ${diffInMinutes === 1 ? 'minuto' : 'minutos'}`;
  } else if (diffInHours < 24) {
    return `hace ${diffInHours} ${diffInHours === 1 ? 'hora' : 'horas'}`;
  } else if (diffInDays < 30) {
    return `hace ${diffInDays} ${diffInDays === 1 ? 'día' : 'días'}`;
  } else if (diffInMonths < 12) {
    return `hace ${diffInMonths} ${diffInMonths === 1 ? 'mes' : 'meses'}`;
  } else {
    return `hace ${diffInYears} ${diffInYears === 1 ? 'año' : 'años'}`;
  }
}
