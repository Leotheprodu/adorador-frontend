import countryCodesJson from '@global/data/country-codes.json';

export const appName = 'Zamr';
export const Server1API = process.env.NEXT_PUBLIC_API_URL_1;
export const domain = process.env.NEXT_PUBLIC_DOMAIN;
export const appDescription =
  'Zamr es una plataforma cristiana, con herramientas para los ministerios de alabanza y la iglesia';
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

export const videoBackgroundIds = {
  worship: [
    'CbrFOgZuXUs',
    'cGDdIfGMzYY',
    'xgh4NBSYYKA',
    'YvIlqZ87fMA',
    '_6W8EGih2a8',
    '0Sufo_cRyF4',
    'RPyUdpZlwgs',
  ],
  praise: [
    'ZoalTKIxjBE',
    '4HTtkIVIT-o',
    'mMyws8zNj38',
    'jgGo3DlFFBQ',
    'aAd0cFAbM1A',
    'F3XRAUU_XYE',
  ],
};

export const worshipVerses: {
  message: string;
  source: string;
}[] = [
  {
    message: 'Todo lo que respira alabe a Jehová.',
    source: 'Salmos 150:6',
  },
  {
    message: 'Exaltad al Señor nuestro Dios, y postraos ante su santo monte.',
    source: 'Salmos 99:9',
  },
  {
    message:
      'Venid, aclamemos alegremente a Jehová; cantemos con júbilo a la roca de nuestra salvación.',
    source: 'Salmos 95:1',
  },
  {
    message:
      'Entrad por sus puertas con acción de gracias, por sus atrios con alabanza.',
    source: 'Salmos 100:4',
  },
  {
    message:
      'Alabad a Jehová, porque él es bueno; porque para siempre es su misericordia.',
    source: 'Salmos 107:1',
  },
  {
    message: 'Engrandeced a Jehová conmigo, y exaltemos a una su nombre.',
    source: 'Salmos 34:3',
  },
  {
    message:
      'Cantaré a Jehová mientras viva; a mi Dios cantaré salmos mientras exista.',
    source: 'Salmos 104:33',
  },
  {
    message: 'Adorad a Jehová en la hermosura de la santidad.',
    source: 'Salmos 29:2',
  },
  {
    message:
      'Sea la gloria de Jehová para siempre; alégrese Jehová en sus obras.',
    source: 'Salmos 104:31',
  },
  {
    message: 'Alzad vuestras manos al santuario, y bendecid a Jehová.',
    source: 'Salmos 134:2',
  },
  {
    message:
      'Bueno es alabarte, oh Jehová, y cantar salmos a tu nombre, oh Altísimo.',
    source: 'Salmos 92:1',
  },
  {
    message: 'Cantad a Jehová cántico nuevo; cantad a Jehová toda la tierra.',
    source: 'Salmos 96:1',
  },
  {
    message: 'Jehová es mi fortaleza y mi cántico.',
    source: 'Salmos 118:14',
  },
  {
    message: 'Alaben su nombre con danza; cántenle salmos con pandero y arpa.',
    source: 'Salmos 149:3',
  },
  {
    message: 'Grande es Jehová y digno de suprema alabanza.',
    source: 'Salmos 145:3',
  },
];
export const initialVideo = ['iXg9huPQdb8', 'EbbraAqD0nY'];

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
export const structureColors: { [key: string]: string } = {
  intro: '#FFE680',
  verse: '#FFD1A3',
  'pre-chorus': '#B3E5FC',
  chorus: '#C39BD3',
  bridge: '#80D6CB',
  outro: '#FFE680',
  preChorus: '#FFB3C6',
  interlude: '#FFA092',
  solo: '#8DE3B3',
};

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
