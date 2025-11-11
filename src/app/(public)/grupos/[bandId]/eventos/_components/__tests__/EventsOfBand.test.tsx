import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { EventsOfBand } from '../EventsOfBand';
import { getEventsOfBand } from '../../_services/eventsOfBandService';
import { useRouter } from 'next/navigation';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock de los módulos
jest.mock('../../_services/eventsOfBandService');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));
jest.mock('@global/utils/UIGuard', () => ({
  UIGuard: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="ui-guard">{children}</div>
  ),
}));
jest.mock('@bands/_components/AddEventButton', () => ({
  AddEventButton: ({ bandId }: { bandId: string }) => (
    <button data-testid="add-event-button">Add Event {bandId}</button>
  ),
}));
jest.mock(
  '@bands/[bandId]/eventos/[eventId]/en-vivo/_hooks/useEditEvent',
  () => ({
    useEditEvent: () => ({
      form: { title: '', date: '' },
      setForm: jest.fn(),
      isOpen: false,
      onOpenChange: jest.fn(),
      handleChange: jest.fn(),
      handleUpdateEvent: jest.fn(),
      handleOpenModal: jest.fn(),
      statusUpdateEvent: 'idle',
    }),
  }),
);
jest.mock('@bands/[bandId]/eventos/_components/FormAddNewEvent', () => ({
  FormAddNewEvent: () => <div data-testid="form-add-new-event">Form</div>,
}));

const createMockDate = (daysFromNow: number): string => {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString();
};

const mockEvents = [
  {
    id: 1,
    title: 'Culto de Domingo',
    date: createMockDate(7), // Próximo evento
  },
  {
    id: 2,
    title: 'Reunión de Oración',
    date: createMockDate(-3), // Evento pasado
  },
  {
    id: 3,
    title: 'Concierto Especial',
    date: createMockDate(14), // Próximo evento
  },
  {
    id: 4,
    title: 'Vigilia de Año Nuevo',
    date: createMockDate(-30), // Evento pasado
  },
];

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });
  const Wrapper = ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
  Wrapper.displayName = 'EventsOfBandTestWrapper';
  return Wrapper;
};

describe('EventsOfBand - Table Structure', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (getEventsOfBand as jest.Mock).mockReturnValue({
      data: mockEvents,
      isLoading: false,
      status: 'success',
    });
  });

  it('should render as a table structure', () => {
    render(<EventsOfBand params={{ bandId: '1' }} />, {
      wrapper: createWrapper(),
    });

    const table = screen.getByRole('table');
    expect(table).toBeInTheDocument();
  });

  it('should have correct table headers in desktop', () => {
    render(<EventsOfBand params={{ bandId: '1' }} />, {
      wrapper: createWrapper(),
    });

    // Headers están ocultos en mobile (hidden sm:table-header-group)
    // pero deben existir en el DOM
    expect(screen.getByText('Estado')).toBeInTheDocument();
    expect(screen.getByText('Evento')).toBeInTheDocument();
    expect(screen.getByText('Fecha')).toBeInTheDocument();
    expect(screen.getByText('Hora')).toBeInTheDocument();
    expect(screen.getByText('Acción')).toBeInTheDocument();
  });

  it('should display all events in unified table', () => {
    render(<EventsOfBand params={{ bandId: '1' }} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByText('Culto de Domingo')).toBeInTheDocument();
    expect(screen.getByText('Reunión de Oración')).toBeInTheDocument();
    expect(screen.getByText('Concierto Especial')).toBeInTheDocument();
    expect(screen.getByText('Vigilia de Año Nuevo')).toBeInTheDocument();
  });

  it('should show event status indicators', () => {
    render(<EventsOfBand params={{ bandId: '1' }} />, {
      wrapper: createWrapper(),
    });

    // Buscar indicadores de estado (próximo/finalizado)
    const proximoBadges = screen.getAllByText('Próximo');
    const finalizadoBadges = screen.getAllByText('Finalizado');

    expect(proximoBadges.length).toBeGreaterThan(0);
    expect(finalizadoBadges.length).toBeGreaterThan(0);
  });

  it('should have action menu for each event', () => {
    render(<EventsOfBand params={{ bandId: '1' }} />, {
      wrapper: createWrapper(),
    });

    // Verificar que hay botones de menú de acciones
    const actionButtons = screen.getAllByLabelText('Menú de opciones');
    expect(actionButtons.length).toBe(mockEvents.length);
  });

  it('should show "Ir a evento" and "Editar evento" options in dropdown menu', async () => {
    render(<EventsOfBand params={{ bandId: '1' }} />, {
      wrapper: createWrapper(),
    });

    // Hacer clic en el primer menú de acciones
    const actionButtons = screen.getAllByLabelText('Menú de opciones');
    fireEvent.click(actionButtons[0]);

    // Verificar que aparecen las opciones del menú
    await waitFor(() => {
      expect(screen.getByText('Ir a evento')).toBeInTheDocument();
      expect(screen.getByText('Editar evento')).toBeInTheDocument();
    });
  });
});

describe('EventsOfBand - Search and Filters', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (getEventsOfBand as jest.Mock).mockReturnValue({
      data: mockEvents,
      isLoading: false,
      status: 'success',
    });
  });

  it('should render search input', () => {
    render(<EventsOfBand params={{ bandId: '1' }} />, {
      wrapper: createWrapper(),
    });

    const searchInput = screen.getByPlaceholderText(
      /buscar eventos por título/i,
    );
    expect(searchInput).toBeInTheDocument();
  });

  it('should render filter buttons', () => {
    render(<EventsOfBand params={{ bandId: '1' }} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByText('Todos')).toBeInTheDocument();
    expect(screen.getByText('🎯 Próximos')).toBeInTheDocument();
    expect(screen.getByText('✓ Pasados')).toBeInTheDocument();
  });

  it('should filter events by search term', async () => {
    render(<EventsOfBand params={{ bandId: '1' }} />, {
      wrapper: createWrapper(),
    });

    const searchInput = screen.getByPlaceholderText(
      /buscar eventos por título/i,
    );

    fireEvent.change(searchInput, { target: { value: 'culto' } });

    await waitFor(() => {
      expect(screen.getByText('Culto de Domingo')).toBeInTheDocument();
      expect(screen.queryByText('Reunión de Oración')).not.toBeInTheDocument();
      expect(screen.queryByText('Concierto Especial')).not.toBeInTheDocument();
      expect(
        screen.queryByText('Vigilia de Año Nuevo'),
      ).not.toBeInTheDocument();
    });
  });

  it('should filter by upcoming events', async () => {
    render(<EventsOfBand params={{ bandId: '1' }} />, {
      wrapper: createWrapper(),
    });

    const upcomingButton = screen.getByText('🎯 Próximos');
    fireEvent.click(upcomingButton);

    await waitFor(() => {
      expect(screen.getByText('Culto de Domingo')).toBeInTheDocument();
      expect(screen.getByText('Concierto Especial')).toBeInTheDocument();
      expect(screen.queryByText('Reunión de Oración')).not.toBeInTheDocument();
      expect(
        screen.queryByText('Vigilia de Año Nuevo'),
      ).not.toBeInTheDocument();
    });
  });

  it('should filter by past events', async () => {
    render(<EventsOfBand params={{ bandId: '1' }} />, {
      wrapper: createWrapper(),
    });

    const pastButton = screen.getByText('✓ Pasados');
    fireEvent.click(pastButton);

    await waitFor(() => {
      expect(screen.queryByText('Culto de Domingo')).not.toBeInTheDocument();
      expect(screen.queryByText('Concierto Especial')).not.toBeInTheDocument();
      expect(screen.getByText('Reunión de Oración')).toBeInTheDocument();
      expect(screen.getByText('Vigilia de Año Nuevo')).toBeInTheDocument();
    });
  });

  it('should show all events when clicking "Todos"', async () => {
    render(<EventsOfBand params={{ bandId: '1' }} />, {
      wrapper: createWrapper(),
    });

    // Primero filtrar por próximos
    const upcomingButton = screen.getByText('🎯 Próximos');
    fireEvent.click(upcomingButton);

    await waitFor(() => {
      expect(screen.queryByText('Reunión de Oración')).not.toBeInTheDocument();
    });

    // Luego volver a mostrar todos
    const allButton = screen.getByText('Todos');
    fireEvent.click(allButton);

    await waitFor(() => {
      expect(screen.getByText('Culto de Domingo')).toBeInTheDocument();
      expect(screen.getByText('Reunión de Oración')).toBeInTheDocument();
      expect(screen.getByText('Concierto Especial')).toBeInTheDocument();
      expect(screen.getByText('Vigilia de Año Nuevo')).toBeInTheDocument();
    });
  });

  it('should show correct count of filtered results', async () => {
    render(<EventsOfBand params={{ bandId: '1' }} />, {
      wrapper: createWrapper(),
    });

    // Inicialmente debe mostrar "4 de 4 eventos"
    expect(screen.getByText(/4 de 4 eventos/i)).toBeInTheDocument();

    // Filtrar por próximos (2 eventos)
    const upcomingButton = screen.getByText('🎯 Próximos');
    fireEvent.click(upcomingButton);

    await waitFor(() => {
      expect(screen.getByText(/2 de 4 eventos/i)).toBeInTheDocument();
    });
  });

  it('should show empty state when no results found', async () => {
    render(<EventsOfBand params={{ bandId: '1' }} />, {
      wrapper: createWrapper(),
    });

    const searchInput = screen.getByPlaceholderText(
      /buscar eventos por título/i,
    );

    fireEvent.change(searchInput, { target: { value: 'nonexistent event' } });

    await waitFor(() => {
      expect(
        screen.getByText(/no se encontraron eventos/i),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/intenta con otros términos de búsqueda o filtros/i),
      ).toBeInTheDocument();
    });
  });

  it('should normalize search text (remove accents)', async () => {
    render(<EventsOfBand params={{ bandId: '1' }} />, {
      wrapper: createWrapper(),
    });

    const searchInput = screen.getByPlaceholderText(
      /buscar eventos por título/i,
    );

    // Buscar con acentos
    fireEvent.change(searchInput, { target: { value: 'reunión' } });

    await waitFor(() => {
      expect(screen.getByText('Reunión de Oración')).toBeInTheDocument();
    });
  });

  it('should not show AddEventButton in empty state when filters are active', async () => {
    render(<EventsOfBand params={{ bandId: '1' }} />, {
      wrapper: createWrapper(),
    });

    const searchInput = screen.getByPlaceholderText(
      /buscar eventos por título/i,
    );

    fireEvent.change(searchInput, { target: { value: 'nonexistent event' } });

    await waitFor(() => {
      // El botón de "Add Event" en el estado vacío solo debe aparecer
      // cuando no hay filtros activos (searchTerm === '' && eventStatusFilter === 'all')
      const addEventButtons = screen.getAllByTestId('add-event-button');
      // Solo debe haber 1-2 botones (header y posiblemente mobile), no el del empty state
      expect(addEventButtons.length).toBeLessThanOrEqual(2);
    });
  });
});

describe('EventsOfBand - Empty State', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  it('should show empty state when no events exist', () => {
    (getEventsOfBand as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      status: 'success',
    });

    render(<EventsOfBand params={{ bandId: '1' }} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByText(/no hay eventos registrados/i)).toBeInTheDocument();
    expect(
      screen.getByText(/crea tu primer evento para comenzar/i),
    ).toBeInTheDocument();
  });

  it('should show AddEventButton in empty state when no filters', () => {
    (getEventsOfBand as jest.Mock).mockReturnValue({
      data: [],
      isLoading: false,
      status: 'success',
    });

    render(<EventsOfBand params={{ bandId: '1' }} />, {
      wrapper: createWrapper(),
    });

    const addEventButtons = screen.getAllByTestId('add-event-button');
    // Debe haber al menos 2: uno en el header y uno en el empty state
    expect(addEventButtons.length).toBeGreaterThanOrEqual(2);
  });
});

describe('EventsOfBand - Responsive Layout', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (getEventsOfBand as jest.Mock).mockReturnValue({
      data: mockEvents,
      isLoading: false,
      status: 'success',
    });
  });

  it('should have filter buttons with flex-wrap for mobile responsiveness', () => {
    const { container } = render(<EventsOfBand params={{ bandId: '1' }} />, {
      wrapper: createWrapper(),
    });

    // Verificar que el contenedor de botones de filtro tiene flex-wrap
    const filterContainer = container.querySelector('.flex.flex-wrap.gap-2');
    expect(filterContainer).toBeInTheDocument();
  });

  it('should have whitespace-nowrap on filter buttons to prevent text wrapping', () => {
    render(<EventsOfBand params={{ bandId: '1' }} />, {
      wrapper: createWrapper(),
    });

    // Buscar botones de filtro y verificar que tengan whitespace-nowrap
    const allButton = screen.getByText('Todos').closest('button');
    const upcomingButton = screen.getByText('🎯 Próximos').closest('button');
    const pastButton = screen.getByText('✓ Pasados').closest('button');

    expect(allButton).toHaveClass('whitespace-nowrap');
    expect(upcomingButton).toHaveClass('whitespace-nowrap');
    expect(pastButton).toHaveClass('whitespace-nowrap');
  });

  it('should have table with max-w-full and overflow-x-auto for mobile scrolling', () => {
    const { container } = render(<EventsOfBand params={{ bandId: '1' }} />, {
      wrapper: createWrapper(),
    });

    // Verificar el contenedor de la tabla
    const tableContainer = container.querySelector(
      '.max-w-full.overflow-x-auto',
    );
    expect(tableContainer).toBeInTheDocument();

    // Verificar que la tabla tiene min-w-full
    const table = container.querySelector('table');
    expect(table).toHaveClass('min-w-full', 'w-full');
  });
});

describe('EventsOfBand - Sorting', () => {
  const mockPush = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (getEventsOfBand as jest.Mock).mockReturnValue({
      data: mockEvents,
      isLoading: false,
      status: 'success',
    });
  });

  it('should show upcoming events first when showing all', async () => {
    render(<EventsOfBand params={{ bandId: '1' }} />, {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      const table = screen.getByRole('table');
      const rows = table.querySelectorAll('tbody tr');

      // Los eventos próximos deben aparecer primero
      // Verificar que al menos el primer evento sea próximo
      const firstRow = rows[0];
      expect(firstRow.textContent).toMatch(/Próximo|Culto de Domingo/);
    });
  });
});
