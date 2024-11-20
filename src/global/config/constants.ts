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
  eventWebManager: {
    id: 13,
    name: 'Administrador de eventos web',
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

export const songTypes = {
  worship: {
    es: 'Adoración',
    en: 'Worship',
  },
  praise: {
    es: 'Alabanza',
    en: 'Praise',
  },
};

export const rootNotes: {
  [key: string]: {
    american: string;
    regular: string;
    aBemol?: string;
    rBemol?: string;
  };
} = {
  C: { american: 'C', regular: 'Do' },
  'C#': { american: 'C#', regular: 'Do#', aBemol: 'Db', rBemol: 'Reb' },
  D: { american: 'D', regular: 'Re' },
  'D#': { american: 'D#', regular: 'Re#', aBemol: 'Eb', rBemol: 'Mib' },
  E: { american: 'E', regular: 'Mi' },
  F: { american: 'F', regular: 'Fa' },
  'F#': { american: 'F#', regular: 'Fa#', aBemol: 'Gb', rBemol: 'Solb' },
  G: { american: 'G', regular: 'Sol' },
  'G#': { american: 'G#', regular: 'Sol#', aBemol: 'Ab', rBemol: 'Lab' },
  A: { american: 'A', regular: 'La' },
  'A#': { american: 'A#', regular: 'La#', aBemol: 'Bb', rBemol: 'Sib' },
  B: { american: 'B', regular: 'Si' },
};

export const keys = [
  'C',
  'C#',
  'D',
  'D#',
  'E',
  'F',
  'F#',
  'G',
  'G#',
  'A',
  'A#',
  'B',
];

export const chordQualities = [
  '',
  'm',
  'dim',
  'aug',
  'sus2',
  'sus4',
  '7',
  'maj7',
  'm7',
  'mMaj7',
  'dim7',
  'm7b5',
  '9',
  'maj9',
  'm9',
  '11',
  'maj11',
  'm11',
  '13',
  'maj13',
  'm13',
];
export const keyChordQualities = ['', 'm'];

export const songKeys = keys.flatMap((note) =>
  keyChordQualities.map((quality) => `${note}${quality}`),
);

export const structureLib = {
  intro: {
    es: 'Intro',
    en: 'Intro',
  },
  verse: {
    es: 'Verso',
    en: 'Verse',
  },
  'pre-chorus': {
    es: 'Pre-Coro',
    en: 'Pre-Chorus',
  },
  chorus: {
    es: 'Coro',
    en: 'Chorus',
  },
  bridge: {
    es: 'Puente',
    en: 'Bridge',
  },
  outro: {
    es: 'Outro',
    en: 'Outro',
  },
  interlude: {
    es: 'Interludio',
    en: 'Interlude',
  },
  solo: {
    es: 'Solo',
    en: 'Solo',
  },
};
export const songStructure = [
  {
    title: 'intro',
    id: 1,
  },
  {
    title: 'verse',
    id: 2,
  },
  {
    title: 'pre-chorus',
    id: 3,
  },
  {
    title: 'chorus',
    id: 4,
  },
  {
    title: 'bridge',
    id: 5,
  },
  {
    title: 'interlude',
    id: 6,
  },
  {
    title: 'solo',
    id: 7,
  },
  {
    title: 'outro',
    id: 8,
  },
];

export const backgroundImages = [
  '/images/backgrounds/paisaje_1.avif',
  '/images/backgrounds/paisaje_2.avif',
  '/images/backgrounds/paisaje_3.avif',
  '/images/backgrounds/paisaje_4.avif',
  '/images/backgrounds/paisaje_5.avif',
  '/images/backgrounds/paisaje_6.avif',
];
