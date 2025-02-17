import { countryCodes } from '../config/constants';

export const moneyFormat = (value: number) => {
  const userCountry = 'Costa Rica';
  const data = countryCodes.find(
    (countryCode) => countryCode.country === userCountry,
  );
  const currency: string = (data?.currency as string) || 'CRC';
  const langCountry: string = (data?.langCountry as string) || 'es-CR';

  const formatter = new Intl.NumberFormat(langCountry, {
    style: 'currency',
    currency,
  });
  return formatter.format(value);
};

export const formatNumber = (number: number) => {
  return new Intl.NumberFormat('es-CR', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number);
};

export const formatDate = (date: string | Date, showDay: boolean = false) => {
  const dateObject = new Date(date);

  // Obtener el día, mes y año usando métodos UTC para evitar problemas de zona horaria
  const day = dateObject.getDate();
  const month = dateObject.getMonth() + 1; // Los meses van de 0 a 11
  const year = dateObject.getFullYear();

  // Formatear el día y el mes para que siempre tengan dos dígitos
  const formattedDay = day < 10 ? `0${day}` : day;
  const formattedMonth = month < 10 ? `0${month}` : month;

  // Obtener el nombre del día de la semana si showDay es true
  const dayNames = [
    'domingo',
    'lunes',
    'martes',
    'miércoles',
    'jueves',
    'viernes',
    'sábado',
  ];
  const dayName = showDay ? `${dayNames[dateObject.getDay()]} ` : '';

  // Retornar en formato dd-mm-yyyy o con el nombre del día si showDay es true
  return `${dayName}${formattedDay}-${formattedMonth}-${year}`;
};

export const formatTime = (date: string | Date, format: 12 | 24 = 12) => {
  if (format === 24) {
    const dateObject = new Date(date);

    // Obtener la hora y los minutos usando métodos UTC para evitar problemas de zona horaria
    const hours = dateObject.getHours();
    const minutes = dateObject.getMinutes();

    // Formatear la hora para que siempre tenga dos dígitos
    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    // Retornar en formato hh:mm
    return `${formattedHours}:${formattedMinutes}`;
  } else {
    const dateObject = new Date(date);
    let hours = dateObject.getHours();
    const minutes = dateObject.getMinutes();
    const period = hours >= 12 ? 'PM' : 'AM';

    // Convertir la hora al formato de 12 horas
    hours = hours % 12 || 12;

    const formattedHours = hours < 10 ? `0${hours}` : hours;
    const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

    return `${formattedHours}:${formattedMinutes} ${period}`;
  }
};

export const convertDateForInput = (date: string | Date) => {
  const fecha = new Date(date);
  const year = fecha.getFullYear();
  const month = (fecha.getMonth() + 1).toString().padStart(2, '0'); // Los meses son 0-indexados
  const day = fecha.getDate().toString().padStart(2, '0');

  return `${year}-${month}-${day}`;
};

export const formatTimeLeft = (milliseconds: number) => {
  const totalSeconds = Math.floor(milliseconds / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return `${days}d ${hours}h ${minutes}m ${seconds}s`;
};
