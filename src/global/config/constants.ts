import countryCodesJson from '@global/data/country-codes.json';

export const appName = 'Adorador';
export const Server1API = process.env.NEXT_PUBLIC_API_URL_1;
export const domain = process.env.NEXT_PUBLIC_DOMAIN;
export const appDescription =
  'Adorador es una plataforma cristiana, con herramientas para la iglesia';
export const userRoles = {
  admin: {
    id: 1,
    name: 'admin',
  },
  user: {
    id: 2,
    name: 'user',
  },
  moderator: {
    id: 3,
    name: 'moderator',
  },
  editor: {
    id: 4,
    name: 'editor',
  },
};

export const churchRoles = {
  pastor: {
    id: 1,
    name: 'Pastor',
  },
  worshipLeader: {
    id: 2,
    name: 'Líder de Alabanza',
  },
  musician: {
    id: 3,
    name: 'Músico',
  },
  youthLeader: {
    id: 4,
    name: 'Líder de Jóvenes',
  },
  deacon: {
    id: 5,
    name: 'Diácono',
  },
  teacher: {
    id: 6,
    name: 'Maestro',
  },
  evangelist: {
    id: 7,
    name: 'Evangelista',
  },
  intercessor: {
    id: 8,
    name: 'Intercesor',
  },
  counselor: {
    id: 9,
    name: 'Consejero',
  },
  treasurer: {
    id: 10,
    name: 'Tesorero',
  },
  cousilOfElders: {
    id: 11,
    name: 'Consejo de Ancianos',
  },
  danceAndTheater: {
    id: 12,
    name: 'Danza y Teatro',
  },
};
export const countryCodes: {
  country: string;
  code: string;
  currency: string;
  langCountry: string;
}[] = countryCodesJson;

export const translates = {
  active: 'Activo',
  inactive: 'Inactivo',
};
