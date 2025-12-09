import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { AddSongToEventModal } from '../AddSongToEventModal';

// Mock NextUI components
jest.mock('@heroui/react', () => {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const React = require('react');

  return {
    Modal: ({
      children,
      isOpen,
      onOpenChange,
    }: React.PropsWithChildren<{
      isOpen: boolean;
      onOpenChange?: (open: boolean) => void;
    }>) => {
      if (!isOpen) return null;
      const onClose = () => onOpenChange?.(false);

      return (
        <div role="dialog" data-testid="modal">
          {React.isValidElement(children)
            ? // eslint-disable-next-line @typescript-eslint/no-explicit-any
              React.cloneElement(children as React.ReactElement<any>, {
                __onClose: onClose,
              })
            : children}
        </div>
      );
    },
    ModalContent: ({
      children,
      __onClose,
      ...props
    }: React.PropsWithChildren & { __onClose?: () => void }) => (
      <div data-testid="modal-content" {...props}>
        {typeof children === 'function' ? children(__onClose) : children}
      </div>
    ),
    ModalHeader: ({ children }: React.PropsWithChildren) => (
      <div>{children}</div>
    ),
    ModalBody: ({ children }: React.PropsWithChildren) => <div>{children}</div>,
    ModalFooter: ({ children }: React.PropsWithChildren) => (
      <div>{children}</div>
    ),
    Button: ({
      children,
      onPress,
      ...props
    }: React.PropsWithChildren<{ onPress?: () => void }>) => (
      <button onClick={onPress} {...props}>
        {children}
      </button>
    ),
    Spinner: () => <div aria-label="Loading">Loading...</div>,
    Chip: ({
      children,
      color,
    }: React.PropsWithChildren<{ color?: string }>) => (
      <span data-color={color}>{children}</span>
    ),
  };
});

// Mock de los iconos
jest.mock('@global/icons', () => ({
  CalendarIcon: (props: React.SVGProps<SVGSVGElement>) => (
    <svg data-testid="calendar-icon" {...props}>
      <path />
    </svg>
  ),
  ArrowRightIcon: (props: React.SVGProps<SVGSVGElement>) => (
    <svg data-testid="arrow-right-icon" {...props}>
      <path />
    </svg>
  ),
  ClockIcon: (props: React.SVGProps<SVGSVGElement>) => (
    <svg data-testid="clock-icon" {...props}>
      <path />
    </svg>
  ),
}));

// Mock del hook useEventTimeLeft
jest.mock('@global/hooks/useEventTimeLeft', () => ({
  useEventTimeLeft: jest.fn(() => ({
    eventTimeLeft: 'En 2 días',
  })),
}));

describe('AddSongToEventModal', () => {
  const mockOnOpenChange = jest.fn();
  const mockOnSelectEvent = jest.fn();

  const mockEvents = [
    {
      id: 1,
      title: 'Culto Dominical',
      date: new Date(Date.now() + 86400000).toISOString(),
      songs: [],
      bandId: 1,
    },
    {
      id: 2,
      title: 'Vigilia de Oración',
      date: new Date(Date.now() + 172800000).toISOString(),
      songs: [],
      bandId: 1,
    },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('debe renderizar el modal cuando isOpen es true', () => {
    render(
      <AddSongToEventModal
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        upcomingEvents={mockEvents}
        onSelectEvent={mockOnSelectEvent}
        isLoading={false}
        songTitle="Amazing Grace"
      />,
    );

    expect(screen.getByText('Agregar a Evento')).toBeInTheDocument();
    expect(screen.getByText('Canción: Amazing Grace')).toBeInTheDocument();
  });

  it('debe mostrar la lista de eventos próximos', () => {
    render(
      <AddSongToEventModal
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        upcomingEvents={mockEvents}
        onSelectEvent={mockOnSelectEvent}
        isLoading={false}
        songTitle="Amazing Grace"
      />,
    );

    expect(screen.getByText('Culto Dominical')).toBeInTheDocument();
    expect(screen.getByText('Vigilia de Oración')).toBeInTheDocument();
  });

  it('debe mostrar mensaje cuando no hay eventos próximos', () => {
    render(
      <AddSongToEventModal
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        upcomingEvents={[]}
        onSelectEvent={mockOnSelectEvent}
        isLoading={false}
        songTitle="Amazing Grace"
      />,
    );

    expect(screen.getByText('No hay eventos próximos')).toBeInTheDocument();
    expect(
      screen.getByText('Crea un evento futuro para poder agregar canciones'),
    ).toBeInTheDocument();
  });

  it('debe llamar onSelectEvent cuando se selecciona un evento', () => {
    render(
      <AddSongToEventModal
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        upcomingEvents={mockEvents}
        onSelectEvent={mockOnSelectEvent}
        isLoading={false}
        songTitle="Amazing Grace"
      />,
    );

    const firstEventButton = screen
      .getByText('Culto Dominical')
      .closest('button');
    if (firstEventButton) {
      fireEvent.click(firstEventButton);
    }

    expect(mockOnSelectEvent).toHaveBeenCalledWith(1);
  });

  it('debe deshabilitar los botones de eventos cuando isLoading es true', () => {
    render(
      <AddSongToEventModal
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        upcomingEvents={mockEvents}
        onSelectEvent={mockOnSelectEvent}
        isLoading={true}
        songTitle="Amazing Grace"
      />,
    );

    const buttons = screen.getAllByRole('button');
    const eventButtons = buttons.filter(
      (btn) =>
        btn.textContent?.includes('Culto Dominical') ||
        btn.textContent?.includes('Vigilia de Oración'),
    );

    eventButtons.forEach((btn) => {
      expect(btn).toBeDisabled();
    });
  });

  it('debe mostrar el tiempo restante para cada evento', () => {
    render(
      <AddSongToEventModal
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        upcomingEvents={mockEvents}
        onSelectEvent={mockOnSelectEvent}
        isLoading={false}
        songTitle="Amazing Grace"
      />,
    );

    const timeLeftElements = screen.getAllByText('En 2 días');
    expect(timeLeftElements.length).toBeGreaterThan(0);
  });

  it('debe renderizar correctamente con eventos', () => {
    render(
      <AddSongToEventModal
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        upcomingEvents={mockEvents}
        onSelectEvent={mockOnSelectEvent}
        isLoading={false}
        songTitle="Amazing Grace"
      />,
    );

    // Verificar que el modal se renderiza con el contenido correcto
    expect(screen.getByText('Agregar a Evento')).toBeInTheDocument();
    expect(screen.getByText('Canción: Amazing Grace')).toBeInTheDocument();

    // Verificar que los iconos se renderizan
    expect(screen.getAllByTestId('calendar-icon').length).toBeGreaterThan(0);
  });

  it('debe renderizar botones de eventos con iconos', () => {
    render(
      <AddSongToEventModal
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        upcomingEvents={mockEvents}
        onSelectEvent={mockOnSelectEvent}
        isLoading={false}
        songTitle="Amazing Grace"
      />,
    );

    // Verificar que hay iconos de flecha para cada evento
    const arrowIcons = screen.getAllByTestId('arrow-right-icon');
    expect(arrowIcons.length).toBe(mockEvents.length);
  });

  it('debe llamar onOpenChange al hacer click en Cancelar', () => {
    render(
      <AddSongToEventModal
        isOpen={true}
        onOpenChange={mockOnOpenChange}
        upcomingEvents={mockEvents}
        onSelectEvent={mockOnSelectEvent}
        isLoading={false}
        songTitle="Amazing Grace"
      />,
    );

    const cancelButton = screen.getByText('Cancelar');
    fireEvent.click(cancelButton);

    expect(mockOnOpenChange).toHaveBeenCalled();
  });
});
