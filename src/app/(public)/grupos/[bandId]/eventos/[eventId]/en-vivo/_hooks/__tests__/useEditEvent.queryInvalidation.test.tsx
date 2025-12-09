/**
 * Tests para verificar que useEditEvent invalida correctamente las queries
 * después de editar un evento exitosamente
 */

import { renderHook, waitFor } from '@testing-library/react';
import { useEditEvent } from '../useEditEvent';
import { useQueryClient } from '@tanstack/react-query';
import { useDisclosure } from "@heroui/react";
import { useStore } from '@nanostores/react';

// Mocks
jest.mock('@tanstack/react-query', () => ({
  ...jest.requireActual('@tanstack/react-query'),
  useQueryClient: jest.fn(),
}));

jest.mock('@heroui/react', () => ({
  useDisclosure: jest.fn(),
}));

jest.mock('@nanostores/react', () => ({
  useStore: jest.fn(),
}));

jest.mock('@stores/event', () => ({
  $event: {},
}));

jest.mock('@bands/[bandId]/eventos/_services/eventsOfBandService', () => ({
  updateEventService: jest.fn(),
}));

jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

import { updateEventService } from '@bands/[bandId]/eventos/_services/eventsOfBandService';

describe('useEditEvent - Query Invalidation', () => {
  const mockBandId = '123';
  const mockEventId = '789';
  const mockRefetch = jest.fn();
  const mockInvalidateQueries = jest.fn();
  const mockOnOpenChange = jest.fn();
  const mockOnOpen = jest.fn();
  let mockMutate: jest.Mock;
  let mockStatus: string;
  let mockReset: jest.Mock;

  const mockEventData = {
    title: 'Test Event',
    date: new Date('2025-12-25T10:00:00').toISOString(),
    bandId: 123,
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

    // Mock useStore
    (useStore as jest.Mock).mockReturnValue(mockEventData);

    // Mock updateEventService
    (updateEventService as jest.Mock).mockImplementation(() => ({
      mutate: mockMutate,
      status: mockStatus,
      reset: mockReset,
    }));
  });

  it('should invalidate EventsOfBand, BandById, and Event queries after successful update', async () => {
    const { rerender } = renderHook(() =>
      useEditEvent({
        bandId: mockBandId,
        eventId: mockEventId,
        refetch: mockRefetch,
      }),
    );

    // Simular actualización exitosa
    mockStatus = 'success';
    (updateEventService as jest.Mock).mockImplementation(() => ({
      mutate: mockMutate,
      status: 'success',
      reset: mockReset,
    }));

    rerender();

    await waitFor(() => {
      expect(mockInvalidateQueries).toHaveBeenCalledWith({
        queryKey: ['EventsOfBand', mockBandId],
        refetchType: 'all',
      });
      expect(mockInvalidateQueries).toHaveBeenCalledWith({
        queryKey: ['BandById', mockBandId],
        refetchType: 'all',
      });
      expect(mockInvalidateQueries).toHaveBeenCalledWith({
        queryKey: ['Event', mockBandId, mockEventId],
        refetchType: 'all',
      });
      expect(mockInvalidateQueries).toHaveBeenCalledWith({
        queryKey: ['BandsOfUser'],
        refetchType: 'all',
      });
    });
  });

  it('should invalidate all four queries', async () => {
    const { rerender } = renderHook(() =>
      useEditEvent({
        bandId: mockBandId,
        eventId: mockEventId,
        refetch: mockRefetch,
      }),
    );

    mockStatus = 'success';
    (updateEventService as jest.Mock).mockImplementation(() => ({
      mutate: mockMutate,
      status: 'success',
      reset: mockReset,
    }));

    rerender();

    await waitFor(() => {
      // Debe invalidar exactamente 4 queries
      expect(mockInvalidateQueries).toHaveBeenCalledTimes(4);
    });
  });

  it('should NOT invalidate queries if update fails', async () => {
    const { rerender } = renderHook(() =>
      useEditEvent({
        bandId: mockBandId,
        eventId: mockEventId,
        refetch: mockRefetch,
      }),
    );

    mockStatus = 'error';
    (updateEventService as jest.Mock).mockImplementation(() => ({
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
      useEditEvent({
        bandId: mockBandId,
        eventId: mockEventId,
        refetch: mockRefetch,
      }),
    );

    mockStatus = 'success';
    (updateEventService as jest.Mock).mockImplementation(() => ({
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

  it('should close modal after successful update', async () => {
    const { rerender } = renderHook(() =>
      useEditEvent({
        bandId: mockBandId,
        eventId: mockEventId,
        refetch: mockRefetch,
      }),
    );

    mockStatus = 'success';
    (updateEventService as jest.Mock).mockImplementation(() => ({
      mutate: mockMutate,
      status: 'success',
      reset: mockReset,
    }));

    rerender();

    await waitFor(() => {
      expect(mockOnOpenChange).toHaveBeenCalled();
      expect(mockReset).toHaveBeenCalled();
    });
  });
});
