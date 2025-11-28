// Mock NextUI components usados en AddEventButton
jest.mock('@nextui-org/react', () => ({
  Button: ({ children, onPress, ...props }) => (
    <button onClick={onPress} {...props}>
      {children}
    </button>
  ),
  Modal: ({ children, ...props }) => <div {...props}>{children}</div>,
  ModalBody: ({ children }) => <div>{children}</div>,
  ModalContent: ({ children }) => <div>{children}</div>,
  ModalFooter: ({ children }) => <div>{children}</div>,
  ModalHeader: ({ children }) => <div>{children}</div>,
  Tooltip: ({ children }) => <div>{children}</div>,
  useDisclosure: () => ({
    isOpen: false,
    onOpen: jest.fn(),
    onClose: jest.fn(),
    onOpenChange: jest.fn(),
  }),
}));
/**
 * Tests para verificar que AddEventButton invalida correctamente las queries
 * después de crear un evento exitosamente
 */

// Mock nanostores FIRST - before any imports
jest.mock('nanostores', () => ({
  atom: jest.fn((initialValue) => ({
    get: jest.fn(() => initialValue),
    set: jest.fn(),
    subscribe: jest.fn(() => jest.fn()),
  })),
}));

jest.mock('@nanostores/react', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  useStore: jest.fn((store: any) => store?.get?.() || null),
}));

// Mock stores with inline factory
jest.mock('@global/stores/users', () => {
  let value = {
    id: 1,
    name: 'Test User',
    isLoggedIn: true,
    email: 'test@test.com',
    phone: '+1234567890',
    roles: [1], // Admin role
    membersofBands: [
      {
        id: 1,
        role: 'Admin',
        isAdmin: true,
        isEventManager: false,
        band: {
          id: 123,
          name: 'Test Band',
        },
      },
    ],
  };

  return {
    $user: {
      get: () => value,
      set: (newValue: typeof value) => {
        value = newValue;
      },
      subscribe: jest.fn(),
    },
  };
});

// Mocks BEFORE imports
jest.mock('@tanstack/react-query', () => ({
  ...jest.requireActual('@tanstack/react-query'),
  useQueryClient: jest.fn(),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@bands/[bandId]/eventos/_services/eventsOfBandService', () => ({
  addEventsToBandService: jest.fn(),
}));

// NOW imports
import { render, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import '@testing-library/jest-dom';
import { AddEventButton } from '../AddEventButton';
import { useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';

function renderWithQueryClient(ui) {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
}

jest.mock('@bands/[bandId]/eventos/_components/FormAddNewEvent', () => ({
  FormAddNewEvent: () => <div data-testid="form-add-event">Form</div>,
}));

jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    error: jest.fn(),
    success: jest.fn(),
  },
}));

import { addEventsToBandService } from '@bands/[bandId]/eventos/_services/eventsOfBandService';

describe('AddEventButton - Query Invalidation', () => {
  const mockBandId = '123';
  const mockNewEventId = '789';
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

    // Mock addEventsToBandService
    (addEventsToBandService as jest.Mock).mockImplementation(() => ({
      data: mockStatus === 'success' ? { id: mockNewEventId } : undefined,
      mutate: mockMutate,
      status: mockStatus,
    }));
  });

  it('should invalidate EventsOfBand and BandById queries after successful event creation', async () => {
    const { rerender } = renderWithQueryClient(
      <AddEventButton bandId={mockBandId} />,
    );

    mockStatus = 'success';
    (addEventsToBandService as jest.Mock).mockImplementation(() => ({
      data: { id: mockNewEventId },
      mutate: mockMutate,
      status: 'success',
    }));

    rerender(<AddEventButton bandId={mockBandId} />);

    await waitFor(() => {
      expect(mockInvalidateQueries).toHaveBeenCalledWith({
        queryKey: ['EventsOfBand', mockBandId],
      });
      expect(mockInvalidateQueries).toHaveBeenCalledWith({
        queryKey: ['BandById', mockBandId],
      });
    });
  });

  it('should invalidate queries and close modal after successful event creation (no redirect)', async () => {
    const { rerender } = renderWithQueryClient(
      <AddEventButton bandId={mockBandId} />,
    );

    mockStatus = 'success';
    (addEventsToBandService as jest.Mock).mockImplementation(() => ({
      data: { id: mockNewEventId },
      mutate: mockMutate,
      status: 'success',
    }));

    rerender(<AddEventButton bandId={mockBandId} />);

    await waitFor(() => {
      expect(mockInvalidateQueries).toHaveBeenCalled();
      // Ya NO debe redirigir - el usuario elige cuándo ir al evento
      expect(mockRouterPush).not.toHaveBeenCalled();
    });
  });

  it('should NOT invalidate queries if event creation fails', async () => {
    const { rerender } = renderWithQueryClient(
      <AddEventButton bandId={mockBandId} />,
    );

    mockStatus = 'error';
    (addEventsToBandService as jest.Mock).mockImplementation(() => ({
      data: undefined,
      mutate: mockMutate,
      status: 'error',
    }));

    rerender(<AddEventButton bandId={mockBandId} />);

    await waitFor(() => {
      expect(mockInvalidateQueries).not.toHaveBeenCalled();
      expect(mockRouterPush).not.toHaveBeenCalled();
    });
  });

  it('should invalidate all three queries even if navigating away immediately', async () => {
    const { rerender } = renderWithQueryClient(
      <AddEventButton bandId={mockBandId} />,
    );

    mockStatus = 'success';
    (addEventsToBandService as jest.Mock).mockImplementation(() => ({
      data: { id: mockNewEventId },
      mutate: mockMutate,
      status: 'success',
    }));

    rerender(<AddEventButton bandId={mockBandId} />);

    await waitFor(() => {
      // Las cuatro queries deberían ser invalidadas (EventsOfBand, BandById, BandsOfUser, SubscriptionLimits)
      expect(mockInvalidateQueries).toHaveBeenCalledTimes(4);
    });
  });
});
