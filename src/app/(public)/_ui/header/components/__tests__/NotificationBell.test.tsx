// Mock nanostores FIRST - before any imports
jest.mock('nanostores', () => ({
  atom: jest.fn((initialValue) => ({
    get: jest.fn(() => initialValue),
    set: jest.fn(),
    subscribe: jest.fn(() => jest.fn()),
  })),
}));

jest.mock('@nanostores/react', () => ({
  useStore: jest.fn(),
}));

// Mock hooks
jest.mock('@app/(public)/grupos/_hooks/usePendingInvitations');
jest.mock('@app/(public)/grupos/_hooks/useAcceptInvitation');
jest.mock('@app/(public)/grupos/_hooks/useRejectInvitation');
jest.mock('@global/utils/updateUserFromToken');
jest.mock('@global/hooks/useNotifications');

// Mock stores with inline factory
jest.mock('@global/stores/users', () => {
  let value = {
    id: 1,
    name: 'Test User',
    email: 'test@test.com',
    phone: '+1234567890',
    birthdate: '1990-01-01',
    status: 'active' as const,
    roles: [],
    memberships: [],
    membersofBands: [],
    isLoggedIn: true,
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

import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { NotificationBell } from '../NotificationBell';
import { usePendingInvitations } from '@app/(public)/grupos/_hooks/usePendingInvitations';
import { useAcceptInvitation } from '@app/(public)/grupos/_hooks/useAcceptInvitation';
import { useRejectInvitation } from '@app/(public)/grupos/_hooks/useRejectInvitation';
import { renderWithQueryClient } from '@global/test-utils/renderWithProviders';
import { $user } from '@global/stores/users';
import { useStore } from '@nanostores/react';
import {
  useUnreadCount,
  useNotifications,
} from '@global/hooks/useNotifications';

const mockUsePendingInvitations = usePendingInvitations as jest.MockedFunction<
  typeof usePendingInvitations
>;
const mockUseAcceptInvitation = useAcceptInvitation as jest.MockedFunction<
  typeof useAcceptInvitation
>;
const mockUseRejectInvitation = useRejectInvitation as jest.MockedFunction<
  typeof useRejectInvitation
>;
const mockUseUnreadCount = useUnreadCount as jest.MockedFunction<
  typeof useUnreadCount
>;
const mockUseNotifications = useNotifications as jest.MockedFunction<
  typeof useNotifications
>;
const mockUseStore = useStore as jest.MockedFunction<typeof useStore>;

describe('NotificationBell', () => {
  const mockAcceptInvitation = jest.fn();
  const mockRejectInvitation = jest.fn();

  const mockInvitations = [
    {
      id: 1,
      bandId: 1,
      invitedUserId: 1,
      invitedBy: 2,
      status: 'pending',
      createdAt: '2025-01-01',
      expiresAt: '2025-12-31',
      band: { id: 1, name: 'Banda de Rock' },
      inviter: { id: 2, name: 'Juan Pérez' },
    },
    {
      id: 2,
      bandId: 2,
      invitedUserId: 1,
      invitedBy: 3,
      status: 'pending',
      createdAt: '2025-01-01',
      expiresAt: '2025-12-31',
      band: { id: 2, name: 'Banda de Jazz' },
      inviter: { id: 3, name: 'María García' },
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    // Reset user store to logged in state
    $user.set({
      id: 1,
      name: 'Test User',
      email: 'test@test.com',
      phone: '+1234567890',
      birthdate: '1990-01-01',
      status: 'active',
      roles: [],
      memberships: [],
      membersofBands: [],
      isLoggedIn: true,
    });

    // Mock useStore to return the user
    mockUseStore.mockReturnValue($user.get());

    // Default mocks for hooks
    mockUsePendingInvitations.mockReturnValue({
      data: [],
      isLoading: false,
      error: null,
      refetch: jest.fn(),
      isError: false,
      isSuccess: true,
      status: 'success',
      isFetching: false,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    mockUseAcceptInvitation.mockReturnValue({
      acceptInvitation: mockAcceptInvitation,
      isAccepting: false,
      acceptInvitationStatus: 'idle',
    });

    mockUseRejectInvitation.mockReturnValue({
      rejectInvitation: mockRejectInvitation,
      isRejecting: false,
      rejectInvitationStatus: 'idle',
    });

    mockUseUnreadCount.mockReturnValue({
      data: { count: 0 },
      isLoading: false,
      error: null,
      isError: false,
      isSuccess: true,
      status: 'success',
      isFetching: false,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);

    mockUseNotifications.mockReturnValue({
      data: { items: [], nextCursor: null },
      isLoading: false,
      error: null,
      isError: false,
      isSuccess: true,
      status: 'success',
      isFetching: false,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
  });

  describe('Visibilidad y renderizado básico', () => {
    it('no debe renderizar si el usuario no está logueado', () => {
      $user.set({
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
      });
      mockUseStore.mockReturnValue($user.get());

      const { container } = renderWithQueryClient(<NotificationBell />);
      expect(container).toBeEmptyDOMElement();
    });

    it('debe renderizar el botón de notificaciones cuando el usuario está logueado', () => {
      renderWithQueryClient(<NotificationBell />);
      const button = screen.getByTestId('notification-bell-button');
      expect(button).toBeInTheDocument();
      expect(button).toHaveAttribute('aria-label', 'Notificaciones');
    });

    it('debe tener z-index alto para visibilidad en móviles', () => {
      renderWithQueryClient(<NotificationBell />);
      const button = screen.getByTestId('notification-bell-button');
      expect(button).toHaveClass('z-10');
    });
  });

  describe('Contador de invitaciones pendientes', () => {
    it('no debe mostrar badge cuando no hay invitaciones', () => {
      renderWithQueryClient(<NotificationBell />);
      const badge = screen.queryByTestId('notification-badge');
      expect(badge).not.toBeInTheDocument();
    });

    it('debe mostrar badge con el número correcto de invitaciones', () => {
      mockUsePendingInvitations.mockReturnValue({
        data: mockInvitations,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
        isError: false,
        isSuccess: true,
        status: 'success',
        isFetching: false,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      renderWithQueryClient(<NotificationBell />);
      const badge = screen.getByTestId('notification-badge');
      expect(badge).toBeInTheDocument();
      expect(badge).toHaveTextContent('2');
    });

    it('debe mostrar badge rojo visible', () => {
      mockUsePendingInvitations.mockReturnValue({
        data: [mockInvitations[0]],
        isLoading: false,
        error: null,
        refetch: jest.fn(),
        isError: false,
        isSuccess: true,
        status: 'success',
        isFetching: false,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      renderWithQueryClient(<NotificationBell />);
      const badge = screen.getByTestId('notification-badge');
      expect(badge).toHaveClass('bg-red-500', 'text-white');
    });
  });

  describe('Popover de invitaciones', () => {
    it('debe abrir el popover al hacer click en el botón', async () => {
      const user = userEvent.setup();
      renderWithQueryClient(<NotificationBell />);

      const button = screen.getByTestId('notification-bell-button');
      await user.click(button);

      await waitFor(() => {
        const popover = screen.getByTestId('notification-popover');
        expect(popover).toBeInTheDocument();
      });
    });

    it('debe tener ancho responsivo para móviles', async () => {
      const user = userEvent.setup();
      renderWithQueryClient(<NotificationBell />);

      const button = screen.getByTestId('notification-bell-button');
      await user.click(button);

      await waitFor(() => {
        // NextUI PopoverContent aplica las clases en el div interno
        const content = screen
          .getByTestId('notification-popover')
          .querySelector('[data-slot="content"]');
        expect(content).toHaveClass('max-w-[calc(100vw-2rem)]');
        expect(content).toHaveClass('z-50');
      });
    });

    it('debe mostrar mensaje cuando no hay invitaciones', async () => {
      const user = userEvent.setup();
      renderWithQueryClient(<NotificationBell />);

      const button = screen.getByTestId('notification-bell-button');
      await user.click(button);

      await waitFor(() => {
        expect(
          screen.getByText('No tienes invitaciones pendientes'),
        ).toBeInTheDocument();
      });
    });

    it('debe mostrar spinner cuando está cargando', async () => {
      mockUsePendingInvitations.mockReturnValue({
        data: undefined,
        isLoading: true,
        error: null,
        refetch: jest.fn(),
        isError: false,
        isSuccess: false,
        status: 'loading',
        isFetching: true,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      const user = userEvent.setup();
      renderWithQueryClient(<NotificationBell />);

      const button = screen.getByTestId('notification-bell-button');
      await user.click(button);

      await waitFor(() => {
        // Verificamos que el popover de notificaciones esté visible en estado de carga
        const content = screen.getByTestId('notification-popover');
        expect(content).toBeInTheDocument();
      });
    });
  });

  describe('Lista de invitaciones', () => {
    beforeEach(() => {
      mockUsePendingInvitations.mockReturnValue({
        data: mockInvitations,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
        isError: false,
        isSuccess: true,
        status: 'success',
        isFetching: false,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);
    });

    it('debe renderizar todas las invitaciones pendientes', async () => {
      const user = userEvent.setup();
      renderWithQueryClient(<NotificationBell />);

      const button = screen.getByTestId('notification-bell-button');
      await user.click(button);

      await waitFor(() => {
        const invitationsTab = screen.getByRole('tab', {
          name: /invitaciones/i,
        });
        expect(invitationsTab).toBeInTheDocument();
      });

      const invitationsTab = screen.getByRole('tab', {
        name: /invitaciones/i,
      });
      await user.click(invitationsTab);

      await waitFor(() => {
        const list = screen.getByTestId('invitations-list');
        expect(list).toBeInTheDocument();
        expect(screen.getByTestId('invitation-card-1')).toBeInTheDocument();
        expect(screen.getByTestId('invitation-card-2')).toBeInTheDocument();
      });
    });

    it('debe mostrar información correcta de cada invitación', async () => {
      mockUsePendingInvitations.mockReturnValue({
        data: [mockInvitations[0]],
        isLoading: false,
        error: null,
        refetch: jest.fn(),
        isError: false,
        isSuccess: true,
        status: 'success',
        isFetching: false,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      const user = userEvent.setup();
      renderWithQueryClient(<NotificationBell />);

      const button = screen.getByTestId('notification-bell-button');
      await user.click(button);

      await waitFor(() => {
        const invitationsTab = screen.getByRole('tab', {
          name: /invitaciones/i,
        });
        expect(invitationsTab).toBeInTheDocument();
      });

      const invitationsTab = screen.getByRole('tab', {
        name: /invitaciones/i,
      });
      await user.click(invitationsTab);

      await waitFor(() => {
        const card = screen.getByTestId('invitation-card-1');
        const bandName = within(card).getByTestId('band-name');
        const inviterName = within(card).getByTestId('inviter-name');

        expect(bandName).toHaveTextContent('Banda de Rock');
        expect(inviterName).toHaveTextContent('Invitado por Juan Pérez');
      });
    });

    it('debe mostrar advertencia cuando la invitación expira pronto', async () => {
      const expiresIn6Days = new Date();
      expiresIn6Days.setDate(expiresIn6Days.getDate() + 6);

      mockUsePendingInvitations.mockReturnValue({
        data: [
          {
            ...mockInvitations[0],
            expiresAt: expiresIn6Days.toISOString(),
          },
        ],
        isLoading: false,
        error: null,
        refetch: jest.fn(),
        isError: false,
        isSuccess: true,
        status: 'success',
        isFetching: false,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      const user = userEvent.setup();
      renderWithQueryClient(<NotificationBell />);

      const button = screen.getByTestId('notification-bell-button');
      await user.click(button);

      await waitFor(() => {
        const invitationsTab = screen.getByRole('tab', {
          name: /invitaciones/i,
        });
        expect(invitationsTab).toBeInTheDocument();
      });

      const invitationsTab = screen.getByRole('tab', {
        name: /invitaciones/i,
      });
      await user.click(invitationsTab);

      await waitFor(() => {
        const card = screen.getByTestId('invitation-card-1');
        const warning = within(card).getByTestId('expiring-warning');
        expect(warning).toBeInTheDocument();
        expect(warning).toHaveTextContent('Expira pronto');
      });
    });

    it('no debe mostrar advertencia cuando la invitación no expira pronto', async () => {
      const expiresIn30Days = new Date();
      expiresIn30Days.setDate(expiresIn30Days.getDate() + 30);

      mockUsePendingInvitations.mockReturnValue({
        data: [
          {
            ...mockInvitations[0],
            expiresAt: expiresIn30Days.toISOString(),
          },
        ],
        isLoading: false,
        error: null,
        refetch: jest.fn(),
        isError: false,
        isSuccess: true,
        status: 'success',
        isFetching: false,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      const user = userEvent.setup();
      renderWithQueryClient(<NotificationBell />);

      const button = screen.getByTestId('notification-bell-button');
      await user.click(button);

      await waitFor(() => {
        const invitationsTab = screen.getByRole('tab', {
          name: /invitaciones/i,
        });
        expect(invitationsTab).toBeInTheDocument();
      });

      const invitationsTab = screen.getByRole('tab', {
        name: /invitaciones/i,
      });
      await user.click(invitationsTab);

      await waitFor(() => {
        const card = screen.getByTestId('invitation-card-1');
        const warning = within(card).queryByTestId('expiring-warning');
        expect(warning).not.toBeInTheDocument();
      });
    });
  });

  describe('Acciones de aceptar/rechazar', () => {
    beforeEach(() => {
      mockUsePendingInvitations.mockReturnValue({
        data: [mockInvitations[0]],
        isLoading: false,
        error: null,
        refetch: jest.fn(),
        isError: false,
        isSuccess: true,
        status: 'success',
        isFetching: false,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);
    });

    it('debe llamar a acceptInvitation al hacer click en Aceptar', async () => {
      mockAcceptInvitation.mockResolvedValue({ success: true });
      const user = userEvent.setup();
      renderWithQueryClient(<NotificationBell />);

      const button = screen.getByTestId('notification-bell-button');
      await user.click(button);

      await waitFor(() => {
        const invitationsTab = screen.getByRole('tab', {
          name: /invitaciones/i,
        });
        expect(invitationsTab).toBeInTheDocument();
      });

      const invitationsTab = screen.getByRole('tab', {
        name: /invitaciones/i,
      });
      await user.click(invitationsTab);

      await waitFor(() => {
        const card = screen.getByTestId('invitation-card-1');
        const acceptButton = within(card).getByTestId('accept-button');
        expect(acceptButton).toBeInTheDocument();
      });

      const card = screen.getByTestId('invitation-card-1');
      const acceptButton = within(card).getByTestId('accept-button');
      await user.click(acceptButton);

      await waitFor(() => {
        expect(mockAcceptInvitation).toHaveBeenCalledTimes(1);
      });
    });

    it('debe llamar a rejectInvitation al hacer click en Rechazar', async () => {
      mockRejectInvitation.mockResolvedValue(true);
      const user = userEvent.setup();
      renderWithQueryClient(<NotificationBell />);

      const button = screen.getByTestId('notification-bell-button');
      await user.click(button);

      await waitFor(() => {
        const invitationsTab = screen.getByRole('tab', {
          name: /invitaciones/i,
        });
        expect(invitationsTab).toBeInTheDocument();
      });

      const invitationsTab = screen.getByRole('tab', {
        name: /invitaciones/i,
      });
      await user.click(invitationsTab);

      await waitFor(() => {
        const card = screen.getByTestId('invitation-card-1');
        const rejectButton = within(card).getByTestId('reject-button');
        expect(rejectButton).toBeInTheDocument();
      });

      const card = screen.getByTestId('invitation-card-1');
      const rejectButton = within(card).getByTestId('reject-button');
      await user.click(rejectButton);

      await waitFor(() => {
        expect(mockRejectInvitation).toHaveBeenCalledTimes(1);
      });
    });

    it('debe deshabilitar botón de rechazar mientras se acepta', async () => {
      mockUseAcceptInvitation.mockReturnValue({
        acceptInvitation: mockAcceptInvitation,
        isAccepting: true,
        acceptInvitationStatus: 'pending',
      });

      const user = userEvent.setup();
      renderWithQueryClient(<NotificationBell />);

      const button = screen.getByTestId('notification-bell-button');
      await user.click(button);

      await waitFor(() => {
        const invitationsTab = screen.getByRole('tab', {
          name: /invitaciones/i,
        });
        expect(invitationsTab).toBeInTheDocument();
      });

      const invitationsTab = screen.getByRole('tab', {
        name: /invitaciones/i,
      });
      await user.click(invitationsTab);

      await waitFor(() => {
        expect(screen.getByTestId('invitation-card-1')).toBeInTheDocument();
      });

      const card = screen.getByTestId('invitation-card-1');
      const rejectButton = within(card).getByTestId('reject-button');
      expect(rejectButton).toBeDisabled();
    });

    it('debe deshabilitar botón de aceptar mientras se rechaza', async () => {
      mockUseRejectInvitation.mockReturnValue({
        rejectInvitation: mockRejectInvitation,
        isRejecting: true,
        rejectInvitationStatus: 'pending',
      });

      const user = userEvent.setup();
      renderWithQueryClient(<NotificationBell />);

      const button = screen.getByTestId('notification-bell-button');
      await user.click(button);

      await waitFor(() => {
        const invitationsTab = screen.getByRole('tab', {
          name: /invitaciones/i,
        });
        expect(invitationsTab).toBeInTheDocument();
      });

      const invitationsTab = screen.getByRole('tab', {
        name: /invitaciones/i,
      });
      await user.click(invitationsTab);

      await waitFor(() => {
        expect(screen.getByTestId('invitation-card-1')).toBeInTheDocument();
      });

      const card = screen.getByTestId('invitation-card-1');
      const acceptButton = within(card).getByTestId('accept-button');
      expect(acceptButton).toBeDisabled();
    });

    it('debe mostrar loading en botón de aceptar mientras procesa', async () => {
      mockUseAcceptInvitation.mockReturnValue({
        acceptInvitation: mockAcceptInvitation,
        isAccepting: true,
        acceptInvitationStatus: 'pending',
      });

      const user = userEvent.setup();
      renderWithQueryClient(<NotificationBell />);

      const button = screen.getByTestId('notification-bell-button');
      await user.click(button);

      await waitFor(() => {
        const invitationsTab = screen.getByRole('tab', {
          name: /invitaciones/i,
        });
        expect(invitationsTab).toBeInTheDocument();
      });

      const invitationsTab = screen.getByRole('tab', {
        name: /invitaciones/i,
      });
      await user.click(invitationsTab);

      await waitFor(() => {
        expect(screen.getByTestId('invitation-card-1')).toBeInTheDocument();
      });

      const card = screen.getByTestId('invitation-card-1');
      const acceptButton = within(card).getByTestId('accept-button');
      expect(acceptButton).toHaveAttribute('data-loading', 'true');
    });

    it('debe mostrar loading en botón de rechazar mientras procesa', async () => {
      mockUseRejectInvitation.mockReturnValue({
        rejectInvitation: mockRejectInvitation,
        isRejecting: true,
        rejectInvitationStatus: 'pending',
      });

      const user = userEvent.setup();
      renderWithQueryClient(<NotificationBell />);

      const button = screen.getByTestId('notification-bell-button');
      await user.click(button);

      await waitFor(() => {
        const invitationsTab = screen.getByRole('tab', {
          name: /invitaciones/i,
        });
        expect(invitationsTab).toBeInTheDocument();
      });

      const invitationsTab = screen.getByRole('tab', {
        name: /invitaciones/i,
      });
      await user.click(invitationsTab);

      await waitFor(() => {
        expect(screen.getByTestId('invitation-card-1')).toBeInTheDocument();
      });

      const card = screen.getByTestId('invitation-card-1');
      const rejectButton = within(card).getByTestId('reject-button');
      expect(rejectButton).toHaveAttribute('data-loading', 'true');
    });
  });

  describe('Responsividad', () => {
    it('debe tener scroll cuando hay muchas invitaciones', async () => {
      const manyInvitations = Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        bandId: i + 1,
        invitedUserId: 1,
        invitedBy: 2,
        status: 'pending',
        createdAt: '2025-01-01',
        expiresAt: '2025-12-31',
        band: { id: i + 1, name: `Banda ${i + 1}` },
        inviter: { id: 2, name: 'Invitador' },
      }));

      mockUsePendingInvitations.mockReturnValue({
        data: manyInvitations,
        isLoading: false,
        error: null,
        refetch: jest.fn(),
        isError: false,
        isSuccess: true,
        status: 'success',
        isFetching: false,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } as any);

      const user = userEvent.setup();
      renderWithQueryClient(<NotificationBell />);

      const button = screen.getByTestId('notification-bell-button');
      await user.click(button);

      await waitFor(() => {
        const invitationsTab = screen.getByRole('tab', {
          name: /invitaciones/i,
        });
        expect(invitationsTab).toBeInTheDocument();
      });

      const invitationsTab = screen.getByRole('tab', {
        name: /invitaciones/i,
      });
      await user.click(invitationsTab);

      await waitFor(() => {
        expect(screen.getByTestId('invitations-list')).toBeInTheDocument();
      });

      const list = screen.getByTestId('invitations-list');
      expect(list).toHaveClass('overflow-y-auto', 'max-h-96');
    });

    it('el popover debe tener z-index alto para estar sobre otros elementos', async () => {
      const user = userEvent.setup();
      renderWithQueryClient(<NotificationBell />);

      const button = screen.getByTestId('notification-bell-button');
      await user.click(button);

      await waitFor(() => {
        // NextUI PopoverContent aplica las clases en el div interno
        const content = screen
          .getByTestId('notification-popover')
          .querySelector('[data-slot="content"]');
        expect(content).toHaveClass('z-50');
      });
    });
  });
});
