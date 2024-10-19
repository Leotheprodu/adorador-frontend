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
