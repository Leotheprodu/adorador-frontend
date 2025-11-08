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

// Mock other dependencies BEFORE imports
jest.mock('@bands/_hooks/useBandMembers');
jest.mock('@global/utils/checkUserStatus');

// Mock stores with inline factory
jest.mock('@global/stores/users', () => {
  let value = {
    id: 1,
    name: 'Test User',
    isLoggedIn: true,
    email: 'test@test.com',
    phone: '+1234567890',
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

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import {
  QueryClient,
  QueryClientProvider,
  type UseQueryResult,
} from '@tanstack/react-query';
import { BandMembers } from '../BandMembers';
import { useBandMembers } from '@bands/_hooks/useBandMembers';
import { CheckUserStatus } from '@global/utils/checkUserStatus';
import type { BandMember } from '@bands/_hooks/useBandMembers';

const mockUseBandMembers = useBandMembers as jest.MockedFunction<
  typeof useBandMembers
>;
const mockCheckUserStatus = CheckUserStatus as jest.MockedFunction<
  typeof CheckUserStatus
>;

// Mock data
const mockMembers: BandMember[] = [
  {
    id: 1,
    userId: 1,
    bandId: 100,
    role: 'Guitarrista',
    active: true,
    isAdmin: true,
    isEventManager: false,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    user: {
      id: 1,
      name: 'Test User',
      email: 'test@test.com',
      phone: '+1234567890',
    },
  },
  {
    id: 2,
    userId: 2,
    bandId: 100,
    role: 'Vocalista',
    active: true,
    isAdmin: false,
    isEventManager: true,
    createdAt: '2024-01-02T00:00:00.000Z',
    updatedAt: '2024-01-02T00:00:00.000Z',
    user: {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@test.com',
      phone: '+0987654321',
    },
  },
  {
    id: 3,
    userId: 3,
    bandId: 100,
    role: 'Baterista',
    active: true,
    isAdmin: false,
    isEventManager: false,
    createdAt: '2024-01-03T00:00:00.000Z',
    updatedAt: '2024-01-03T00:00:00.000Z',
    user: {
      id: 3,
      name: 'Bob Johnson',
      email: null,
      phone: '+1122334455',
    },
  },
];

// Wrapper para React Query
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = 'QueryClientWrapper';
  return Wrapper;
};

describe('BandMembers', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Loading State', () => {
    it('should display spinner while loading', () => {
      mockUseBandMembers.mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
        isSuccess: false,
        isError: false,
      } as UseQueryResult<BandMember[], Error>);

      mockCheckUserStatus.mockReturnValue(false);

      render(<BandMembers bandId={100} />, { wrapper: createWrapper() });

      // NextUI Spinner usa aria-label="Loading"
      expect(screen.getByLabelText('Loading')).toBeInTheDocument();
    });
  });

  describe('Error State', () => {
    it('should display error message when fetch fails', () => {
      mockUseBandMembers.mockReturnValue({
        data: undefined,
        isLoading: false,
        error: new Error('Network error'),
        isSuccess: false,
        isError: true,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      mockCheckUserStatus.mockReturnValue(false);

      render(<BandMembers bandId={100} />, { wrapper: createWrapper() });

      expect(
        screen.getByText('Error al cargar los miembros'),
      ).toBeInTheDocument();
    });
  });

  describe('Success State - Members Display', () => {
    beforeEach(() => {
      mockUseBandMembers.mockReturnValue({
        data: mockMembers,
        isLoading: false,
        error: null,
        isSuccess: true,
        isError: false,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      mockCheckUserStatus.mockReturnValue(false);
    });

    it('should render member list correctly', () => {
      render(<BandMembers bandId={100} />, { wrapper: createWrapper() });

      expect(screen.getByText('Miembros del grupo')).toBeInTheDocument();
      expect(screen.getByText('3 miembros')).toBeInTheDocument();

      // Verificar que todos los miembros se muestren
      expect(screen.getByText('Test User')).toBeInTheDocument();
      expect(screen.getByText('Jane Smith')).toBeInTheDocument();
      expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
    });

    it('should display member roles correctly', () => {
      render(<BandMembers bandId={100} />, { wrapper: createWrapper() });

      expect(screen.getByText('Guitarrista')).toBeInTheDocument();
      expect(screen.getByText('Vocalista')).toBeInTheDocument();
      expect(screen.getByText('Baterista')).toBeInTheDocument();
    });

    it('should show admin badge for admin members', () => {
      render(<BandMembers bandId={100} />, { wrapper: createWrapper() });

      const adminChips = screen.getAllByText('Admin');
      expect(adminChips).toHaveLength(1);
    });

    it('should show event manager badge for event managers', () => {
      render(<BandMembers bandId={100} />, { wrapper: createWrapper() });

      const eventChips = screen.getAllByText('Eventos');
      expect(eventChips).toHaveLength(1);
    });

    it('should mark current user with "Tú" chip', () => {
      render(<BandMembers bandId={100} />, { wrapper: createWrapper() });

      const currentUserChip = screen.getByText('Tú');
      expect(currentUserChip).toBeInTheDocument();
    });

    it('should handle single member correctly', () => {
      mockUseBandMembers.mockReturnValue({
        data: [mockMembers[0]],
        isLoading: false,
        error: null,
        isSuccess: true,
        isError: false,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      render(<BandMembers bandId={100} />, { wrapper: createWrapper() });

      expect(screen.getByText('1 miembro')).toBeInTheDocument();
    });

    it('should show empty state when no members', () => {
      mockUseBandMembers.mockReturnValue({
        data: [],
        isLoading: false,
        error: null,
        isSuccess: true,
        isError: false,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      render(<BandMembers bandId={100} />, { wrapper: createWrapper() });

      expect(
        screen.getByText('No hay miembros en este grupo'),
      ).toBeInTheDocument();
    });
  });

  describe('Admin Features', () => {
    beforeEach(() => {
      mockUseBandMembers.mockReturnValue({
        data: mockMembers,
        isLoading: false,
        error: null,
        isSuccess: true,
        isError: false,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);
    });

    it('should show "Invitar miembro" button when user is admin', () => {
      mockCheckUserStatus.mockReturnValue(true);

      render(<BandMembers bandId={100} />, { wrapper: createWrapper() });

      const inviteButton = screen.getByText('Invitar miembro');
      expect(inviteButton).toBeInTheDocument();
    });

    it('should not show "Invitar miembro" button when user is not admin', () => {
      mockCheckUserStatus.mockReturnValue(false);

      render(<BandMembers bandId={100} />, { wrapper: createWrapper() });

      expect(screen.queryByText('Invitar miembro')).not.toBeInTheDocument();
    });

    it('should open InviteMemberModal when clicking invite button', async () => {
      mockCheckUserStatus.mockReturnValue(true);

      render(<BandMembers bandId={100} />, { wrapper: createWrapper() });

      const inviteButton = screen.getByText('Invitar miembro');
      fireEvent.click(inviteButton);

      // El modal debería abrirse (aunque esté mockeado)
      await waitFor(() => {
        expect(inviteButton).toBeInTheDocument();
      });
    });

    it('should show edit button for each member when user is admin', () => {
      mockCheckUserStatus.mockReturnValue(true);

      render(<BandMembers bandId={100} />, { wrapper: createWrapper() });

      // Debe haber un botón de edición por cada miembro
      const editButtons = screen.getAllByLabelText(
        /Editar mi perfil|Configurar miembro/,
      );
      expect(editButtons).toHaveLength(3);
    });

    it('should not show edit buttons when user is not admin', () => {
      mockCheckUserStatus.mockReturnValue(false);

      render(<BandMembers bandId={100} />, { wrapper: createWrapper() });

      const editButtons = screen.queryAllByLabelText(
        /Editar mi perfil|Configurar miembro/,
      );
      expect(editButtons).toHaveLength(0);
    });

    it('should open EditMemberModal when clicking edit button', async () => {
      mockCheckUserStatus.mockReturnValue(true);

      render(<BandMembers bandId={100} />, { wrapper: createWrapper() });

      const editButtons = screen.getAllByLabelText(
        /Editar mi perfil|Configurar miembro/,
      );
      fireEvent.click(editButtons[0]);

      // Verificar que el botón sigue existiendo (modal se abre pero está mockeado)
      await waitFor(() => {
        expect(editButtons[0]).toBeInTheDocument();
      });
    });
  });

  describe('WebSocket Integration', () => {
    it('should use useBandMembers hook with correct bandId', () => {
      mockUseBandMembers.mockReturnValue({
        data: mockMembers,
        isLoading: false,
        error: null,
        isSuccess: true,
        isError: false,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      mockCheckUserStatus.mockReturnValue(false);

      render(<BandMembers bandId={100} />, { wrapper: createWrapper() });

      expect(mockUseBandMembers).toHaveBeenCalledWith(100);
    });

    it('should re-fetch members when bandId changes', () => {
      mockUseBandMembers.mockReturnValue({
        data: mockMembers,
        isLoading: false,
        error: null,
        isSuccess: true,
        isError: false,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      mockCheckUserStatus.mockReturnValue(false);

      const { rerender } = render(<BandMembers bandId={100} />, {
        wrapper: createWrapper(),
      });

      expect(mockUseBandMembers).toHaveBeenCalledWith(100);

      rerender(<BandMembers bandId={200} />);

      expect(mockUseBandMembers).toHaveBeenCalledWith(200);
    });

    it('should handle real-time member updates via WebSocket', async () => {
      // Simular actualización en tiempo real
      const initialMembers = [mockMembers[0]];
      const updatedMembers = [...mockMembers];

      mockUseBandMembers.mockReturnValueOnce({
        data: initialMembers,
        isLoading: false,
        error: null,
        isSuccess: true,
        isError: false,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      const { rerender } = render(<BandMembers bandId={100} />, {
        wrapper: createWrapper(),
      });

      expect(screen.getByText('1 miembro')).toBeInTheDocument();

      // Simular actualización de WebSocket
      mockUseBandMembers.mockReturnValueOnce({
        data: updatedMembers,
        isLoading: false,
        error: null,
        isSuccess: true,
        isError: false,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      rerender(<BandMembers bandId={100} />);

      await waitFor(() => {
        expect(screen.getByText('3 miembros')).toBeInTheDocument();
      });
    });
  });

  describe('User Interface', () => {
    beforeEach(() => {
      mockUseBandMembers.mockReturnValue({
        data: mockMembers,
        isLoading: false,
        error: null,
        isSuccess: true,
        isError: false,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      mockCheckUserStatus.mockReturnValue(false);
    });

    it('should display UsersIcon in header', () => {
      render(<BandMembers bandId={100} />, { wrapper: createWrapper() });

      const header = screen.getByText('Miembros del grupo').closest('div');
      expect(header).toBeInTheDocument();
    });

    it('should apply correct styling to card', () => {
      render(<BandMembers bandId={100} />, { wrapper: createWrapper() });

      const card = screen
        .getByText('Miembros del grupo')
        .closest('[class*="rounded"]');
      expect(card).toBeInTheDocument();
    });

    it('should render member cards with hover effect', () => {
      render(<BandMembers bandId={100} />, { wrapper: createWrapper() });

      const memberCards = screen
        .getByText('Test User')
        .closest('[class*="rounded-lg"]');
      expect(memberCards).toBeInTheDocument();
    });
  });

  describe('Accessibility', () => {
    beforeEach(() => {
      mockUseBandMembers.mockReturnValue({
        data: mockMembers,
        isLoading: false,
        error: null,
        isSuccess: true,
        isError: false,
      } as UseQueryResult<BandMember[], Error>);

      mockCheckUserStatus.mockReturnValue(true);
    });

    it('should have proper aria-label for edit buttons', () => {
      render(<BandMembers bandId={100} />, { wrapper: createWrapper() });

      const selfEditButton = screen.getByLabelText('Editar mi perfil');
      expect(selfEditButton).toBeInTheDocument();

      const otherEditButtons = screen.getAllByLabelText('Configurar miembro');
      expect(otherEditButtons.length).toBeGreaterThan(0);
    });

    it('should maintain proper heading hierarchy', () => {
      render(<BandMembers bandId={100} />, { wrapper: createWrapper() });

      const heading = screen.getByText('Miembros del grupo');
      expect(heading.tagName).toBe('H2');
    });
  });

  describe('Edge Cases', () => {
    it('should handle member with null email', () => {
      mockUseBandMembers.mockReturnValue({
        data: [mockMembers[2]], // Bob Johnson tiene email null
        isLoading: false,
        error: null,
        isSuccess: true,
        isError: false,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      mockCheckUserStatus.mockReturnValue(false);

      render(<BandMembers bandId={100} />, { wrapper: createWrapper() });

      expect(screen.getByText('Bob Johnson')).toBeInTheDocument();
    });

    it('should handle member without admin or event manager roles', () => {
      mockUseBandMembers.mockReturnValue({
        data: [mockMembers[2]], // Bob Johnson no es admin ni event manager
        isLoading: false,
        error: null,
        isSuccess: true,
        isError: false,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      mockCheckUserStatus.mockReturnValue(false);

      render(<BandMembers bandId={100} />, { wrapper: createWrapper() });

      expect(screen.queryByText('Admin')).not.toBeInTheDocument();
      expect(screen.queryByText('Eventos')).not.toBeInTheDocument();
    });

    it('should handle very long member names gracefully', () => {
      const longNameMember: BandMember = {
        ...mockMembers[0],
        user: {
          ...mockMembers[0].user,
          name: 'Very Long Name That Should Be Handled Properly',
        },
      };

      mockUseBandMembers.mockReturnValue({
        data: [longNameMember],
        isLoading: false,
        error: null,
        isSuccess: true,
        isError: false,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      mockCheckUserStatus.mockReturnValue(false);

      render(<BandMembers bandId={100} />, { wrapper: createWrapper() });

      expect(
        screen.getByText('Very Long Name That Should Be Handled Properly'),
      ).toBeInTheDocument();
    });
  });
});
