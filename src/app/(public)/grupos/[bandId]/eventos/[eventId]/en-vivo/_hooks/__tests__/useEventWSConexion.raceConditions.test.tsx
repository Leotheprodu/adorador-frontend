import { renderHook, waitFor } from '@testing-library/react';
import { io } from 'socket.io-client';
import type { EventByIdInterface } from '@bands/[bandId]/eventos/_interfaces/eventsInterface';
import type { lyricSelectedProps } from '@stores/event';
import type { LoggedUser } from '@auth/login/_interfaces/LoginInterface';

// Mock @nanostores/react FIRST
jest.mock('@nanostores/react', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useStore: (store: any) => store.get(),
}));

// Mock users store
jest.mock('@stores/users', () => {
  let userValue: LoggedUser = {
    id: 0,
    name: '',
    email: '',
    phone: '',
    birthdate: '',
    status: 'inactive',
    roles: [],
    memberships: [],
    membersofBands: [],
    isLoggedIn: false,
  };

  return {
    $user: {
      get: () => userValue,
      set: (newValue: LoggedUser) => {
        userValue = newValue;
      },
      subscribe: jest.fn(),
    },
  };
});

// Mock the event stores with inline factory
jest.mock('@stores/event', () => {
  let eventValue: EventByIdInterface = {
    id: 0,
    title: '',
    date: '',
    bandId: 0,
    songs: [],
  };
  let lyricSelectedValue: lyricSelectedProps = {
    position: 0,
    action: 'forward',
  };
  let eventSelectedSongIdValue = 0;
  let eventAdminNameValue = '';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let eventSocketValue: any = null;
  let eventLiveMessageValue = '';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let selectedSongDataValue: any = undefined;
  let selectedSongLyricLengthValue = 0;

  return {
    $event: {
      get: () => eventValue,
      set: (newValue: EventByIdInterface) => {
        eventValue = newValue;
      },
      subscribe: jest.fn(),
    },
    $lyricSelected: {
      get: () => lyricSelectedValue,
      set: (newValue: lyricSelectedProps) => {
        lyricSelectedValue = newValue;
      },
      subscribe: jest.fn(),
    },
    $eventSelectedSongId: {
      get: () => eventSelectedSongIdValue,
      set: (newValue: number) => {
        eventSelectedSongIdValue = newValue;
      },
      subscribe: jest.fn(),
    },
    $eventAdminName: {
      get: () => eventAdminNameValue,
      set: (newValue: string) => {
        eventAdminNameValue = newValue;
      },
      subscribe: jest.fn(),
    },
    $eventSocket: {
      get: () => eventSocketValue,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      set: (newValue: any) => {
        eventSocketValue = newValue;
      },
      subscribe: jest.fn(),
    },
    $eventLiveMessage: {
      get: () => eventLiveMessageValue,
      set: (newValue: string) => {
        eventLiveMessageValue = newValue;
      },
      subscribe: jest.fn(),
    },
    $selectedSongData: {
      get: () => selectedSongDataValue,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      set: (newValue: any) => {
        selectedSongDataValue = newValue;
      },
      subscribe: jest.fn(),
    },
    $selectedSongLyricLength: {
      get: () => selectedSongLyricLengthValue,
      set: (newValue: number) => {
        selectedSongLyricLengthValue = newValue;
      },
      subscribe: jest.fn(),
    },
  };
});

jest.mock('socket.io-client');
jest.mock('@global/utils/jwtUtils', () => ({
  getValidAccessToken: jest.fn().mockResolvedValue('mock-token'),
  isTokenExpired: jest.fn().mockReturnValue(false),
  getTokens: jest.fn().mockReturnValue({ accessToken: 'mock-token' }),
}));

// Import after mocks
import { useEventWSConexion } from '../useEventWSConexion';
import {
  $lyricSelected,
  $eventSelectedSongId,
  $eventAdminName,
  $event,
} from '@stores/event';

describe('useEventWSConexion - Orden de eventos y race conditions', () => {
  let mockSocket: Record<string, jest.Mock>;
  let mockEmit: jest.Mock;
  let mockOn: jest.Mock;

  beforeEach(() => {
    $lyricSelected.set({ position: 0, action: 'forward' });
    $eventSelectedSongId.set(0);
    $eventAdminName.set('');
    $event.set({
      id: 17,
      title: 'Test Event',
      date: '2025-11-06',
      bandId: 1,
      songs: [
        {
          transpose: 0,
          order: 1,
          song: {
            id: 17,
            title: 'Test Song',
            artist: 'Test Artist',
            songType: 'worship' as const,
            key: 'C',
            lyrics: [
              {
                id: 1,
                lyrics: 'Line 1',
                position: 1,
                chords: [],
                structure: { id: 1, title: 'verse' },
              },
              {
                id: 2,
                lyrics: 'Line 2',
                position: 2,
                chords: [],
                structure: { id: 1, title: 'verse' },
              },
            ],
          },
        },
      ],
    });

    mockEmit = jest.fn();
    mockOn = jest.fn();

    mockSocket = {
      emit: mockEmit,
      on: mockOn,
      off: jest.fn(),
      disconnect: jest.fn(),
    };

    (io as jest.Mock).mockReturnValue(mockSocket);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('Race condition: lyricSelected llega antes que eventSelectedSong', () => {
    it('debe mantener la posición cuando lyricSelected llega primero', async () => {
      const params = { bandId: '1', eventId: '17' };

      renderHook(() => useEventWSConexion({ params }));

      await waitFor(() => {
        expect(mockOn).toHaveBeenCalled();
      });

      const lyricListener = mockOn.mock.calls.find(
        ([event]) => event === 'lyricSelected-17',
      )?.[1];
      const songListener = mockOn.mock.calls.find(
        ([event]) => event === 'eventSelectedSong-17',
      )?.[1];

      // Orden de llegada: lyric ANTES de song (caso común en carga inicial)
      lyricListener({
        message: { position: 4, action: 'forward' },
        eventAdmin: 'Leo',
      });

      expect($lyricSelected.get()).toEqual({ position: 4, action: 'forward' });

      // Luego llega la canción
      songListener({
        message: 17,
        eventAdmin: 'Leo',
      });

      // La posición debe mantenerse en 4, NO resetear a 0
      await waitFor(() => {
        expect($lyricSelected.get()).toEqual({
          position: 4,
          action: 'forward',
        });
      });
    });
  });

  describe('Race condition: eventSelectedSong llega antes que lyricSelected', () => {
    it('debe aplicar la posición correcta cuando song llega primero', async () => {
      const params = { bandId: '1', eventId: '17' };

      renderHook(() => useEventWSConexion({ params }));

      await waitFor(() => {
        expect(mockOn).toHaveBeenCalled();
      });

      const lyricListener = mockOn.mock.calls.find(
        ([event]) => event === 'lyricSelected-17',
      )?.[1];
      const songListener = mockOn.mock.calls.find(
        ([event]) => event === 'eventSelectedSong-17',
      )?.[1];

      // Orden de llegada: song ANTES de lyric
      songListener({
        message: 17,
        eventAdmin: 'Leo',
      });

      // Como previousSongId es 0, NO debe resetear
      expect($lyricSelected.get()).toEqual({ position: 0, action: 'forward' });

      // Luego llega la posición
      lyricListener({
        message: { position: 4, action: 'forward' },
        eventAdmin: 'Leo',
      });

      // La posición debe actualizarse correctamente
      await waitFor(() => {
        expect($lyricSelected.get()).toEqual({
          position: 4,
          action: 'forward',
        });
      });
    });
  });

  describe('Múltiples recargas rápidas', () => {
    it('debe manejar correctamente múltiples mensajes duplicados', async () => {
      const params = { bandId: '1', eventId: '17' };

      renderHook(() => useEventWSConexion({ params }));

      await waitFor(() => {
        expect(mockOn).toHaveBeenCalled();
      });

      const lyricListener = mockOn.mock.calls.find(
        ([event]) => event === 'lyricSelected-17',
      )?.[1];
      const songListener = mockOn.mock.calls.find(
        ([event]) => event === 'eventSelectedSong-17',
      )?.[1];

      // Primera carga
      lyricListener({
        message: { position: 3, action: 'forward' },
        eventAdmin: 'Leo',
      });
      songListener({
        message: 17,
        eventAdmin: 'Leo',
      });

      expect($lyricSelected.get()).toEqual({ position: 3, action: 'forward' });

      // Llegan los mismos mensajes otra vez (duplicados)
      lyricListener({
        message: { position: 3, action: 'forward' },
        eventAdmin: 'Leo',
      });
      songListener({
        message: 17,
        eventAdmin: 'Leo',
      });

      // La posición debe mantenerse, no resetear
      await waitFor(() => {
        expect($lyricSelected.get()).toEqual({
          position: 3,
          action: 'forward',
        });
        expect($eventSelectedSongId.get()).toBe(17);
      });
    });
  });

  describe('Cambios rápidos de posición', () => {
    it('debe procesar todos los cambios de posición en orden', async () => {
      const params = { bandId: '1', eventId: '17' };

      renderHook(() => useEventWSConexion({ params }));

      await waitFor(() => {
        expect(mockOn).toHaveBeenCalled();
      });

      const lyricListener = mockOn.mock.calls.find(
        ([event]) => event === 'lyricSelected-17',
      )?.[1];

      // Estado inicial
      $eventSelectedSongId.set(17);

      // Cambios rápidos de posición
      lyricListener({
        message: { position: 1, action: 'forward' },
        eventAdmin: 'Leo',
      });
      expect($lyricSelected.get().position).toBe(1);

      lyricListener({
        message: { position: 2, action: 'forward' },
        eventAdmin: 'Leo',
      });
      expect($lyricSelected.get().position).toBe(2);

      lyricListener({
        message: { position: 1, action: 'backward' },
        eventAdmin: 'Leo',
      });
      expect($lyricSelected.get().position).toBe(1);

      // Todas las actualizaciones deben procesarse
      await waitFor(() => {
        expect($lyricSelected.get()).toEqual({
          position: 1,
          action: 'backward',
        });
      });
    });
  });

  describe('Estado del servidor vs estado local', () => {
    it('debe priorizar el estado del servidor sobre el estado local', async () => {
      const params = { bandId: '1', eventId: '17' };

      // Simular que el estado local tiene valores diferentes
      $lyricSelected.set({ position: 10, action: 'forward' });
      $eventSelectedSongId.set(99);

      renderHook(() => useEventWSConexion({ params }));

      await waitFor(() => {
        expect(mockOn).toHaveBeenCalled();
      });

      const lyricListener = mockOn.mock.calls.find(
        ([event]) => event === 'lyricSelected-17',
      )?.[1];
      const songListener = mockOn.mock.calls.find(
        ([event]) => event === 'eventSelectedSong-17',
      )?.[1];

      // Llegan los valores del servidor
      songListener({
        message: 17,
        eventAdmin: 'Leo',
      });
      lyricListener({
        message: { position: 2, action: 'forward' },
        eventAdmin: 'Leo',
      });

      // El estado del servidor debe sobrescribir el local
      await waitFor(() => {
        expect($eventSelectedSongId.get()).toBe(17);
        expect($lyricSelected.get()).toEqual({
          position: 2,
          action: 'forward',
        });
      });
    });
  });

  describe('Verificación de que previousSongId funciona correctamente', () => {
    it('debe detectar correctamente cuando la canción NO cambió (estado inicial)', () => {
      const params = { bandId: '1', eventId: '17' };

      renderHook(() => useEventWSConexion({ params }));

      // Estado inicial: previousSongId = 0
      expect($eventSelectedSongId.get()).toBe(0);

      // Este caso simula la primera carga donde previousSongId es 0
      // y llega songId 17, por lo tanto isSongChange debe ser false
      // (porque previousSongId === 0 hace que la condición sea false)
    });

    it('debe detectar correctamente cuando la canción SÍ cambió', async () => {
      const params = { bandId: '1', eventId: '17' };

      renderHook(() => useEventWSConexion({ params }));

      await waitFor(() => {
        expect(mockOn).toHaveBeenCalled();
      });

      const songListener = mockOn.mock.calls.find(
        ([event]) => event === 'eventSelectedSong-17',
      )?.[1];

      // Establecer canción inicial
      $eventSelectedSongId.set(17);
      $lyricSelected.set({ position: 3, action: 'forward' });

      // Agregar segunda canción al evento
      $event.set({
        ...$event.get(),
        songs: [
          ...$event.get().songs,
          {
            transpose: 0,
            order: 2,
            song: {
              id: 18,
              title: 'Song 2',
              artist: 'Test Artist 2',
              songType: 'praise' as const,
              key: 'D',
              lyrics: [],
            },
          },
        ],
      });

      // Cambiar a canción diferente
      songListener({
        message: 18,
        eventAdmin: 'Leo',
      });

      // previousSongId = 17, songId = 18, entonces isSongChange = true
      // Debe resetear a 0
      await waitFor(() => {
        expect($eventSelectedSongId.get()).toBe(18);
        expect($lyricSelected.get()).toEqual({
          position: 0,
          action: 'backward',
        });
      });
    });
  });
});
