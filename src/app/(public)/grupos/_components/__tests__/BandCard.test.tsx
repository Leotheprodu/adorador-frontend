/**
 * Tests para BandCard - Card principal de grupo en la página de grupos
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

// Mock NextUI components
// Mock dinámico de useDisclosure para controlar el estado en cada test
let disclosureState = { isEditOpen: false, isDeleteOpen: false };
let disclosureCallCount = 0;
jest.mock('@heroui/react', () => ({
  Card: ({ children }) => <div>{children}</div>,
  CardHeader: ({ children }) => <div>{children}</div>,
  CardBody: ({ children }) => <div>{children}</div>,
  CardFooter: ({ children }) => <div>{children}</div>,
  Button: ({ children, onPress, ...props }) => (
    <button onClick={onPress} {...props}>
      {children}
    </button>
  ),
  Chip: ({ children }) => <span>{children}</span>,
  User: ({ name }) => <div>{name}</div>,
  Spinner: () => <div aria-label="Loading">Loading...</div>,
  useDisclosure: () => {
    disclosureCallCount++;
    if (disclosureCallCount % 2 === 1) {
      // EditBandModal (primera llamada en cada render)
      return {
        isOpen: disclosureState.isEditOpen,
        onOpen: () => {
          disclosureState.isEditOpen = true;
        },
        onClose: () => {
          disclosureState.isEditOpen = false;
        },
        onOpenChange: jest.fn(),
      };
    } else {
      // DeleteBandModal (segunda llamada en cada render)
      return {
        isOpen: disclosureState.isDeleteOpen,
        onOpen: () => {
          disclosureState.isDeleteOpen = true;
        },
        onClose: () => {
          disclosureState.isDeleteOpen = false;
        },
        onOpenChange: jest.fn(),
      };
    }
  },
}));

// Mock stores with inline factory
jest.mock('@global/stores/users', () => {
  let value = {
    id: 1,
    name: 'Test User',
    isLoggedIn: true,
    email: 'test@test.com',
    phone: '+1234567890',
    roles: [1],
    membersofBands: [
      {
        id: 1,
        role: 'Admin',
        isAdmin: true,
        isEventManager: false,
        band: {
          id: 1,
          name: 'Test Band',
        },
      },
    ],
  };

  return {
    $user: {
      get: () => value,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      set: (newValue: any) => {
        value = newValue;
      },
      subscribe: jest.fn(),
    },
  };
});

import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { BandCard } from '../BandCard';
import { BandsWithMembersCount } from '@bands/_interfaces/bandsInterface';

// Mock de componentes y utilidades
jest.mock('@global/utils/checkUserStatus', () => ({
  CheckUserStatus: jest.fn(),
}));

jest.mock('@global/hooks/useEventTimeLeft', () => ({
  useEventTimeLeft: jest.fn(() => ({ eventTimeLeft: '', timeLeft: 0 })),
}));

jest.mock('../EditBandModal', () => ({
  EditBandModal: ({ isOpen }: { isOpen: boolean }) =>
    isOpen ? <div data-testid="edit-modal">Edit Modal</div> : null,
}));

jest.mock('../DeleteBandModal', () => ({
  DeleteBandModal: ({ isOpen }: { isOpen: boolean }) =>
    isOpen ? <div data-testid="delete-modal">Delete Modal</div> : null,
}));

jest.mock('@global/components/buttons', () => ({
  PrimaryButton: ({
    children,
    href,
    className,
  }: {
    children: React.ReactNode;
    href?: string;
    className?: string;
  }) => (
    <a href={href} className={className} data-testid="primary-button">
      {children}
    </a>
  ),
  IconButton: ({
    children,
    onClick,
    disabled,
    ariaLabel,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    disabled?: boolean;
    ariaLabel?: string;
  }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={ariaLabel}
      data-testid={`icon-button-${ariaLabel}`}
    >
      {children}
    </button>
  ),
}));

import { CheckUserStatus } from '@global/utils/checkUserStatus';
import { useEventTimeLeft } from '@global/hooks/useEventTimeLeft';

const mockCheckUserStatus = CheckUserStatus as jest.MockedFunction<
  typeof CheckUserStatus
>;
const mockUseEventTimeLeft = useEventTimeLeft as jest.MockedFunction<
  typeof useEventTimeLeft
>;

describe('BandCard', () => {
  const createMockDate = (daysFromNow: number): string => {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    return date.toISOString();
  };

  const mockBandWithEvents: BandsWithMembersCount = {
    id: 1,
    name: 'Grupo de Alabanza',
    _count: {
      events: 3,
      songs: 15,
      members: 8,
    },
    events: [
      {
        id: 1,
        title: 'Culto de Domingo',
        date: createMockDate(7),
        bandId: 1,
      },
      {
        id: 2,
        title: 'Reunión de Oración',
        date: createMockDate(14),
        bandId: 1,
      },
      {
        id: 3,
        title: 'Evento Especial',
        date: createMockDate(-3),
        bandId: 1,
      },
    ],
  };

  const mockBandWithoutEvents: BandsWithMembersCount = {
    id: 2,
    name: 'Banda sin Eventos',
    _count: {
      events: 0,
      songs: 5,
      members: 3,
    },
    events: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    mockCheckUserStatus.mockReturnValue(false);
    disclosureState = { isEditOpen: false, isDeleteOpen: false };
    disclosureCallCount = 0;
    mockUseEventTimeLeft.mockReturnValue({ eventTimeLeft: '', timeLeft: 0 });
  });

  describe('Renderizado básico', () => {
    test('debe renderizar el nombre del grupo', () => {
      render(<BandCard band={mockBandWithEvents} />);
      expect(screen.getByText('Grupo de Alabanza')).toBeInTheDocument();
    });

    test('debe mostrar las estadísticas del grupo (eventos, canciones, miembros)', () => {
      render(<BandCard band={mockBandWithEvents} />);

      expect(screen.getByText('3 eventos')).toBeInTheDocument();
      expect(screen.getByText('15 canciones')).toBeInTheDocument();
      expect(screen.getByText('8 miembros')).toBeInTheDocument();
    });

    test('debe mostrar el botón "Administrar Grupo" siempre', () => {
      render(<BandCard band={mockBandWithEvents} />);

      const buttons = screen.getAllByTestId('primary-button');
      const adminButton = buttons.find((btn) =>
        btn.textContent?.includes('Administrar Grupo'),
      );

      expect(adminButton).toBeInTheDocument();
      expect(adminButton).toHaveAttribute('href', '/grupos/1');
    });
  });

  describe('Eventos', () => {
    test('debe mostrar el primer evento ordenado por fecha', () => {
      render(<BandCard band={mockBandWithEvents} />);

      // El primer evento debería ser el evento pasado (más cercano en el tiempo)
      expect(screen.getByText('Evento Especial')).toBeInTheDocument();
    });

    test('debe mostrar el contador de eventos (1/3)', () => {
      render(<BandCard band={mockBandWithEvents} />);

      expect(screen.getByText('1 / 3')).toBeInTheDocument();
    });

    test('debe permitir navegar entre eventos con botones anterior/siguiente', () => {
      render(<BandCard band={mockBandWithEvents} />);

      // Primer evento
      expect(screen.getByText('Evento Especial')).toBeInTheDocument();

      // Hacer clic en siguiente
      const nextButton = screen.getByLabelText('Evento siguiente');
      fireEvent.click(nextButton);

      // Segundo evento
      expect(screen.getByText('Culto de Domingo')).toBeInTheDocument();
      expect(screen.getByText('2 / 3')).toBeInTheDocument();

      // Hacer clic en siguiente otra vez
      fireEvent.click(nextButton);

      // Tercer evento
      expect(screen.getByText('Reunión de Oración')).toBeInTheDocument();
      expect(screen.getByText('3 / 3')).toBeInTheDocument();
    });

    test('debe deshabilitar botón anterior en el primer evento', () => {
      render(<BandCard band={mockBandWithEvents} />);

      const prevButton = screen.getByLabelText('Evento anterior');
      expect(prevButton).toBeDisabled();
    });

    test('debe deshabilitar botón siguiente en el último evento', () => {
      render(<BandCard band={mockBandWithEvents} />);

      const nextButton = screen.getByLabelText('Evento siguiente');

      // Navegar hasta el último evento
      fireEvent.click(nextButton);
      fireEvent.click(nextButton);

      expect(nextButton).toBeDisabled();
    });

    test('debe mostrar "Ver Evento" para todos los usuarios cuando hay eventos', () => {
      mockCheckUserStatus.mockReturnValue(false); // Usuario NO autorizado

      render(<BandCard band={mockBandWithEvents} />);

      const buttons = screen.getAllByTestId('primary-button');
      const viewEventButton = buttons.find((btn) =>
        btn.textContent?.includes('Ver Evento'),
      );

      expect(viewEventButton).toBeInTheDocument();
      expect(viewEventButton).toHaveAttribute('href', '/grupos/1/eventos/3');
    });

    test('NO debe mostrar "Ver Evento" cuando no hay eventos', () => {
      render(<BandCard band={mockBandWithoutEvents} />);

      const buttons = screen.getAllByTestId('primary-button');
      const viewEventButton = buttons.find((btn) =>
        btn.textContent?.includes('Ver Evento'),
      );

      expect(viewEventButton).toBeUndefined();
    });

    test('debe actualizar el link de "Ver Evento" al cambiar de evento', () => {
      render(<BandCard band={mockBandWithEvents} />);

      const buttons = screen.getAllByTestId('primary-button');
      let viewEventButton = buttons.find((btn) =>
        btn.textContent?.includes('Ver Evento'),
      );

      // Primer evento (id: 3)
      expect(viewEventButton).toHaveAttribute('href', '/grupos/1/eventos/3');

      // Navegar al siguiente
      const nextButton = screen.getByLabelText('Evento siguiente');
      fireEvent.click(nextButton);

      const updatedButtons = screen.getAllByTestId('primary-button');
      viewEventButton = updatedButtons.find((btn) =>
        btn.textContent?.includes('Ver Evento'),
      );

      // Segundo evento (id: 1)
      expect(viewEventButton).toHaveAttribute('href', '/grupos/1/eventos/1');
    });
  });

  describe('Permisos de administración', () => {
    test('debe mostrar botones de editar y eliminar para usuarios autorizados', () => {
      mockCheckUserStatus.mockReturnValue(true);

      render(<BandCard band={mockBandWithEvents} />);

      expect(
        screen.getByTestId('icon-button-Editar grupo'),
      ).toBeInTheDocument();
      expect(
        screen.getByTestId('icon-button-Eliminar grupo'),
      ).toBeInTheDocument();
    });

    test('NO debe mostrar botones de editar y eliminar para usuarios NO autorizados', () => {
      mockCheckUserStatus.mockReturnValue(false);

      render(<BandCard band={mockBandWithEvents} />);

      expect(
        screen.queryByTestId('icon-button-Editar grupo'),
      ).not.toBeInTheDocument();
      expect(
        screen.queryByTestId('icon-button-Eliminar grupo'),
      ).not.toBeInTheDocument();
    });

    test('debe abrir modal de edición al hacer clic en botón editar', () => {
      mockCheckUserStatus.mockReturnValue(true);

      // Renderizar y forzar re-render tras abrir modal
      const { rerender } = render(<BandCard band={mockBandWithEvents} />);
      const editButton = screen.getByTestId('icon-button-Editar grupo');
      fireEvent.click(editButton);
      rerender(<BandCard band={mockBandWithEvents} />);
      expect(screen.getByTestId('edit-modal')).toBeInTheDocument();
    });

    test('debe abrir modal de eliminación al hacer clic en botón eliminar', () => {
      mockCheckUserStatus.mockReturnValue(true);

      const { rerender } = render(<BandCard band={mockBandWithEvents} />);
      const deleteButton = screen.getByTestId('icon-button-Eliminar grupo');
      fireEvent.click(deleteButton);
      rerender(<BandCard band={mockBandWithEvents} />);
      expect(screen.getByTestId('delete-modal')).toBeInTheDocument();
    });
  });

  describe('Tiempo restante del evento', () => {
    test('debe mostrar tiempo restante cuando está disponible y el evento es futuro', () => {
      mockUseEventTimeLeft.mockReturnValue({
        eventTimeLeft: '2 días, 5 horas',
        timeLeft: 180000000, // ~2 días en ms
      });

      // Crear banda con evento futuro
      const bandWithFutureEvent: BandsWithMembersCount = {
        ...mockBandWithEvents,
        events: [
          {
            id: 10,
            title: 'Evento Futuro',
            date: createMockDate(7), // 7 días en el futuro
            bandId: 1,
          },
        ],
      };

      render(<BandCard band={bandWithFutureEvent} />);

      expect(screen.getByText(/2 días, 5 horas/)).toBeInTheDocument();
    });

    test('NO debe mostrar tiempo restante cuando es string vacío', () => {
      mockUseEventTimeLeft.mockReturnValue({ eventTimeLeft: '', timeLeft: 0 });

      render(<BandCard band={mockBandWithEvents} />);

      expect(screen.queryByText(/días/)).not.toBeInTheDocument();
    });

    test('NO debe mostrar tiempo restante para eventos pasados', () => {
      mockUseEventTimeLeft.mockReturnValue({
        eventTimeLeft: '',
        timeLeft: -1000000,
      });

      // El mockBandWithEvents tiene un evento pasado como primer evento
      render(<BandCard band={mockBandWithEvents} />);

      // Verificar que estamos viendo el evento pasado
      expect(screen.getByText('Evento Especial')).toBeInTheDocument();

      // No debería mostrar tiempo restante
      expect(screen.queryByText(/⏱️/)).not.toBeInTheDocument();
    });
  });

  describe('Indicador de evento actual', () => {
    test('debe mostrar indicador "Hoy" para eventos del día actual', () => {
      const today = new Date();
      today.setHours(14, 0, 0, 0);

      const bandWithTodayEvent: BandsWithMembersCount = {
        ...mockBandWithEvents,
        events: [
          {
            id: 1,
            title: 'Evento de Hoy',
            date: today.toISOString(),
            bandId: 1,
          },
        ],
      };

      render(<BandCard band={bandWithTodayEvent} />);

      expect(screen.getByText('Hoy')).toBeInTheDocument();
    });
  });

  describe('Accesibilidad', () => {
    test('debe tener aria-labels apropiados en botones de navegación', () => {
      render(<BandCard band={mockBandWithEvents} />);

      expect(screen.getByLabelText('Evento anterior')).toBeInTheDocument();
      expect(screen.getByLabelText('Evento siguiente')).toBeInTheDocument();
    });

    test('debe tener aria-labels en botones de administración', () => {
      mockCheckUserStatus.mockReturnValue(true);

      render(<BandCard band={mockBandWithEvents} />);

      expect(screen.getByLabelText('Editar grupo')).toBeInTheDocument();
      expect(screen.getByLabelText('Eliminar grupo')).toBeInTheDocument();
    });
  });

  describe('Estilos y diseño', () => {
    test('debe tener clases de estilo para el gradiente del header', () => {
      const { container } = render(<BandCard band={mockBandWithEvents} />);

      const header = container.querySelector('.bg-brand-purple-600');
      expect(header).toBeInTheDocument();
    });

    test('debe aplicar hover effects en la card', () => {
      const { container } = render(<BandCard band={mockBandWithEvents} />);

      const card = container.querySelector('.group');
      expect(card).toHaveClass('hover:shadow-2xl');
    });
  });
});
