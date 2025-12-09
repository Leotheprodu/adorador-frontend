/**
 * Tests para verificar que useEditSong invalida correctamente las queries
 * después de editar una canción exitosamente
 */

import { renderHook, waitFor } from '@testing-library/react';
import { useEditSong } from '../useEditSong';
import { useQueryClient } from '@tanstack/react-query';
import { useDisclosure } from "@heroui/react";

// Mocks
jest.mock('@tanstack/react-query', () => ({
  ...jest.requireActual('@tanstack/react-query'),
  useQueryClient: jest.fn(),
}));

jest.mock('@heroui/react', () => ({
  useDisclosure: jest.fn(),
}));

jest.mock('@bands/[bandId]/canciones/_services/songsOfBandService', () => ({
  updateSongService: jest.fn(),
}));

jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

import { updateSongService } from '@bands/[bandId]/canciones/_services/songsOfBandService';

describe('useEditSong - Query Invalidation', () => {
  const mockBandId = '123';
  const mockSongId = '456';
  const mockRefetch = jest.fn();
  const mockInvalidateQueries = jest.fn();
  const mockOnOpenChange = jest.fn();
  const mockOnOpen = jest.fn();
  let mockMutate: jest.Mock;
  let mockStatus: string;
  let mockReset: jest.Mock;

  const mockSongData = {
    title: 'Test Song',
    artist: 'Test Artist',
    songType: 'worship' as const,
    youtubeLink: 'test-link',
    key: 'C',
    tempo: 120,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockStatus = 'idle';
    mockMutate = jest.fn();
    mockReset = jest.fn();

    // Mock useQueryClient
    (useQueryClient as jest.Mock).mockReturnValue({
      invalidateQueries: mockInvalidateQueries,
    });

    // Mock useDisclosure
    (useDisclosure as jest.Mock).mockReturnValue({
      isOpen: false,
      onOpen: mockOnOpen,
      onOpenChange: mockOnOpenChange,
    });

    // Mock updateSongService
    (updateSongService as jest.Mock).mockImplementation(() => ({
      mutate: mockMutate,
      status: mockStatus,
      reset: mockReset,
    }));
  });

  it('should invalidate SongsOfBand, BandById, and SongData queries after successful update', async () => {
    const { rerender } = renderHook(() =>
      useEditSong({
        bandId: mockBandId,
        songId: mockSongId,
        refetch: mockRefetch,
        songData: mockSongData,
      }),
    );

    // Simular actualización exitosa
    mockStatus = 'success';
    (updateSongService as jest.Mock).mockImplementation(() => ({
      mutate: mockMutate,
      status: 'success',
      reset: mockReset,
    }));

    rerender();

    await waitFor(() => {
      expect(mockInvalidateQueries).toHaveBeenCalledWith({
        queryKey: ['SongsOfBand', mockBandId],
      });
      expect(mockInvalidateQueries).toHaveBeenCalledWith({
        queryKey: ['BandById', mockBandId],
      });
      expect(mockInvalidateQueries).toHaveBeenCalledWith({
        queryKey: ['SongData', mockBandId, mockSongId],
      });
    });
  });

  it('should invalidate all three queries', async () => {
    const { rerender } = renderHook(() =>
      useEditSong({
        bandId: mockBandId,
        songId: mockSongId,
        refetch: mockRefetch,
        songData: mockSongData,
      }),
    );

    mockStatus = 'success';
    (updateSongService as jest.Mock).mockImplementation(() => ({
      mutate: mockMutate,
      status: 'success',
      reset: mockReset,
    }));

    rerender();

    await waitFor(() => {
      // Debe invalidar exactamente 3 queries
      expect(mockInvalidateQueries).toHaveBeenCalledTimes(3);
    });
  });

  it('should NOT invalidate queries if update fails', async () => {
    const { rerender } = renderHook(() =>
      useEditSong({
        bandId: mockBandId,
        songId: mockSongId,
        refetch: mockRefetch,
        songData: mockSongData,
      }),
    );

    mockStatus = 'error';
    (updateSongService as jest.Mock).mockImplementation(() => ({
      mutate: mockMutate,
      status: 'error',
      reset: mockReset,
    }));

    rerender();

    await waitFor(() => {
      expect(mockInvalidateQueries).not.toHaveBeenCalled();
    });
  });

  it('should call refetch after invalidating queries', async () => {
    const { rerender } = renderHook(() =>
      useEditSong({
        bandId: mockBandId,
        songId: mockSongId,
        refetch: mockRefetch,
        songData: mockSongData,
      }),
    );

    mockStatus = 'success';
    (updateSongService as jest.Mock).mockImplementation(() => ({
      mutate: mockMutate,
      status: 'success',
      reset: mockReset,
    }));

    rerender();

    await waitFor(() => {
      expect(mockInvalidateQueries).toHaveBeenCalled();
      expect(mockRefetch).toHaveBeenCalled();
    });
  });
});
