// Interfaces optimizadas para mensajes WebSocket - Frontend
// Debe coincidir exactamente con el backend

export interface OptimizedLyricMessage {
  p: number; // position
  a: 'f' | 'b'; // action: 'f' = forward, 'b' = backward
}

export interface OptimizedEventSongMessage {
  s: number; // song id
}

export interface OptimizedLiveMessage {
  t: string; // text content
}

// Estructura base para todos los mensajes WebSocket
export interface BaseWebSocketMessage<T = unknown> {
  e: string; // event id
  m: T; // message data
  u: string; // user name (admin)
  ts: number; // timestamp
}

// Tipos específicos de mensajes
export type LyricWebSocketMessage = BaseWebSocketMessage<OptimizedLyricMessage>;
export type EventSongWebSocketMessage =
  BaseWebSocketMessage<OptimizedEventSongMessage>;
export type LiveWebSocketMessage = BaseWebSocketMessage<OptimizedLiveMessage>;

// Union type para todos los mensajes
export type WebSocketMessage =
  | LyricWebSocketMessage
  | EventSongWebSocketMessage
  | LiveWebSocketMessage;

// Funciones de conversión para mantener compatibilidad con código existente
export const toLegacyLyricFormat = (msg: OptimizedLyricMessage) => ({
  position: msg.p,
  action: msg.a === 'f' ? 'forward' : ('backward' as 'forward' | 'backward'),
});

export const fromLegacyLyricFormat = (legacy: {
  position: number;
  action: 'forward' | 'backward';
}): OptimizedLyricMessage => ({
  p: legacy.position,
  a: legacy.action === 'forward' ? 'f' : 'b',
});

export const toLegacyEventSongFormat = (msg: OptimizedEventSongMessage) =>
  msg.s;
export const fromLegacyEventSongFormat = (
  songId: number,
): OptimizedEventSongMessage => ({ s: songId });

export const toLegacyLiveMessageFormat = (msg: OptimizedLiveMessage) => msg.t;
export const fromLegacyLiveMessageFormat = (
  text: string,
): OptimizedLiveMessage => ({ t: text });

// Utilidades para comprimir/descomprimir mensajes
export const compressMessage = <T>(
  eventId: string,
  message: T,
  userName: string,
): BaseWebSocketMessage<T> => ({
  e: eventId,
  m: message,
  u: userName,
  ts: Date.now(),
});

export const decompressMessage = <T>(compressed: BaseWebSocketMessage<T>) => ({
  eventId: compressed.e,
  message: compressed.m,
  userName: compressed.u,
  timestamp: compressed.ts,
});

// Validadores rápidos con type guards seguros
export const isValidLyricMessage = (
  msg: unknown,
): msg is OptimizedLyricMessage => {
  if (!msg || typeof msg !== 'object') return false;
  const obj = msg as Record<string, unknown>;
  return typeof obj.p === 'number' && (obj.a === 'f' || obj.a === 'b');
};

export const isValidEventSongMessage = (
  msg: unknown,
): msg is OptimizedEventSongMessage => {
  if (!msg || typeof msg !== 'object') return false;
  const obj = msg as Record<string, unknown>;
  return typeof obj.s === 'number';
};

export const isValidLiveMessage = (
  msg: unknown,
): msg is OptimizedLiveMessage => {
  if (!msg || typeof msg !== 'object') return false;
  const obj = msg as Record<string, unknown>;
  return typeof obj.t === 'string';
};

// Función para detectar si un mensaje viene en formato legacy o nuevo
export const isLegacyLyricMessage = (msg: unknown): boolean => {
  if (!msg || typeof msg !== 'object') return false;
  const obj = msg as Record<string, unknown>;
  return obj.position !== undefined && obj.action !== undefined;
};

export const isLegacyEventSongMessage = (msg: unknown): boolean => {
  return typeof msg === 'number';
};

export const isCompressedMessage = (
  msg: unknown,
): msg is BaseWebSocketMessage => {
  if (!msg || typeof msg !== 'object') return false;
  const obj = msg as Record<string, unknown>;
  return (
    obj.e !== undefined &&
    obj.m !== undefined &&
    obj.u !== undefined &&
    obj.ts !== undefined
  );
};
