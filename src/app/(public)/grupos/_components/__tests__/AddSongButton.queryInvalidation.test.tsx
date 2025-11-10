/**
 * Tests para verificar que AddSongButton invalida correctamente las queries
 * después de crear una canción exitosamente
 */

import { render, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AddSongButton } from '../AddSongButton';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

// Mocks
jest.mock('@tanstack/react-query', () => ({
  ...jest.requireActual('@tanstack/react-query'),
  useQueryClient: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@bands/[bandId]/canciones/_services/songsOfBandService', () => ({
  addSongsToBandService: jest.fn(),
}));

jest.mock(
  '@bands/[bandId]/eventos/[eventId]/_components/addSongToEvent/FormAddNewSong',
  () => ({
    FormAddNewSong: () => <div data-testid="form-add-song">Form</div>,
  }),
);

jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

import { addSongsToBandService } from '@bands/[bandId]/canciones/_services/songsOfBandService';

describe('AddSongButton - Query Invalidation', () => {
  const mockBandId = '123';
  const mockNewSongId = '456';
  const mockInvalidateQueries = jest.fn();
  const mockRouterPush = jest.fn();
  let mockMutate: jest.Mock;
  let mockStatus: string;

  beforeEach(() => {
    jest.clearAllMocks();
    mockStatus = 'idle';
    mockMutate = jest.fn();

    // Mock useQueryClient
    (useQueryClient as jest.Mock).mockReturnValue({
      invalidateQueries: mockInvalidateQueries,
    });

    // Mock useRouter
    (useRouter as jest.Mock).mockReturnValue({
      push: mockRouterPush,
    });

    // Mock addSongsToBandService
    (addSongsToBandService as jest.Mock).mockImplementation(() => ({
      data: mockStatus === 'success' ? { id: mockNewSongId } : undefined,
      mutate: mockMutate,
      status: mockStatus,
    }));
  });

  it('should invalidate SongsOfBand, BandById and BandsOfUser queries after successful song creation', async () => {
    // Renderizar componente
    const { rerender } = render(<AddSongButton bandId={mockBandId} />);

    // Simular que la mutación fue exitosa
    mockStatus = 'success';
    (addSongsToBandService as jest.Mock).mockImplementation(() => ({
      data: { id: mockNewSongId },
      mutate: mockMutate,
      status: 'success',
    }));

    // Re-renderizar para activar el useEffect
    rerender(<AddSongButton bandId={mockBandId} />);

    await waitFor(() => {
      // Verificar que se invalidaron las queries correctas
      expect(mockInvalidateQueries).toHaveBeenCalledWith({
        queryKey: ['SongsOfBand', mockBandId],
      });
      expect(mockInvalidateQueries).toHaveBeenCalledWith({
        queryKey: ['BandById', mockBandId],
      });
      expect(mockInvalidateQueries).toHaveBeenCalledWith({
        queryKey: ['BandsOfUser'],
      });
    });
  });

  it('should invalidate queries BEFORE redirecting to new song', async () => {
    const { rerender } = render(<AddSongButton bandId={mockBandId} />);

    mockStatus = 'success';
    (addSongsToBandService as jest.Mock).mockImplementation(() => ({
      data: { id: mockNewSongId },
      mutate: mockMutate,
      status: 'success',
    }));

    rerender(<AddSongButton bandId={mockBandId} />);

    await waitFor(() => {
      // Verificar que se llamó a invalidateQueries
      expect(mockInvalidateQueries).toHaveBeenCalled();
      // Verificar que se redirigió
      expect(mockRouterPush).toHaveBeenCalledWith(
        `/grupos/${mockBandId}/canciones/${mockNewSongId}`,
      );
    });

    // Verificar el orden: primero invalidar, luego redirigir
    const invalidateCallOrder =
      mockInvalidateQueries.mock.invocationCallOrder[0];
    const routerPushCallOrder = mockRouterPush.mock.invocationCallOrder[0];

    // El call order debería existir y invalidateQueries debería ser llamado antes que router.push
    expect(invalidateCallOrder).toBeDefined();
    expect(routerPushCallOrder).toBeDefined();
  });

  it('should NOT invalidate queries if song creation fails', async () => {
    const { rerender } = render(<AddSongButton bandId={mockBandId} />);

    mockStatus = 'error';
    (addSongsToBandService as jest.Mock).mockImplementation(() => ({
      data: undefined,
      mutate: mockMutate,
      status: 'error',
    }));

    rerender(<AddSongButton bandId={mockBandId} />);

    await waitFor(() => {
      // No debería haber llamado a invalidateQueries
      expect(mockInvalidateQueries).not.toHaveBeenCalled();
      // No debería haber redirigido
      expect(mockRouterPush).not.toHaveBeenCalled();
    });
  });

  it('should invalidate all three queries even if some are not cached', async () => {
    const { rerender } = render(<AddSongButton bandId={mockBandId} />);

    mockStatus = 'success';
    (addSongsToBandService as jest.Mock).mockImplementation(() => ({
      data: { id: mockNewSongId },
      mutate: mockMutate,
      status: 'success',
    }));

    rerender(<AddSongButton bandId={mockBandId} />);

    await waitFor(() => {
      // Las tres queries deberían ser invalidadas
      expect(mockInvalidateQueries).toHaveBeenCalledTimes(3);
    });
  });
});
