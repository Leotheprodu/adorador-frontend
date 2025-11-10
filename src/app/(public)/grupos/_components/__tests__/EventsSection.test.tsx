import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { EventsSection } from '../EventsSection';

jest.mock('@bands/_components/AddEventButton', () => ({
  AddEventButton: ({ bandId }: { bandId: string }) => (
    <button data-testid="add-event-button">Add Event {bandId}</button>
  ),
}));

jest.mock('@bands/[bandId]/eventos/_components/EventOfBandCard', () => ({
  EventOfBandCard: ({ event }: { event: { id: number; title: string } }) => (
    <div data-testid={`event-card-${event.id}`}>{event.title}</div>
  ),
}));

const mockData = {
  id: 1,
  name: 'Test Band',
  _count: {
    songs: 3,
    events: 2,
  },
  events: [
    { id: 1, title: 'Event 1', date: '2024-12-01' },
    { id: 2, title: 'Event 2', date: '2024-12-15' },
  ],
};

describe('EventsSection - Responsive Layout', () => {
  it('should render without crashing', () => {
    render(<EventsSection data={mockData} bandId="1" />);
    expect(screen.getByText('Eventos')).toBeInTheDocument();
  });

  it('should have responsive header layout with flex-col on mobile and flex-row on desktop', () => {
    const { container } = render(<EventsSection data={mockData} bandId="1" />);

    // Verificar que el header tiene las clases responsive correctas
    const header = container.querySelector('.mb-6.flex');
    expect(header).toHaveClass(
      'flex-col',
      'sm:flex-row',
      'sm:items-center',
      'sm:justify-between',
    );
  });

  it('should have icon container with flex-shrink-0', () => {
    const { container } = render(<EventsSection data={mockData} bandId="1" />);

    // Verificar que el contenedor del icono tiene flex-shrink-0
    const iconContainer = container.querySelector('.h-10.w-10.flex-shrink-0');
    expect(iconContainer).toBeInTheDocument();
  });

  it('should have flex-wrap on buttons container', () => {
    const { container } = render(<EventsSection data={mockData} bandId="1" />);

    // Verificar que el contenedor de botones tiene flex-wrap
    const buttonsContainer = container.querySelector('.flex.flex-wrap');
    expect(buttonsContainer).toBeInTheDocument();
  });

  it('should display event count', () => {
    render(<EventsSection data={mockData} bandId="1" />);
    expect(screen.getByText('2 registrados')).toBeInTheDocument();
  });

  it('should render events grid', () => {
    render(<EventsSection data={mockData} bandId="1" />);
    expect(screen.getByTestId('event-card-1')).toBeInTheDocument();
    expect(screen.getByTestId('event-card-2')).toBeInTheDocument();
  });

  it('should show empty state when no events', () => {
    const emptyData = {
      ...mockData,
      events: [],
      _count: { ...mockData._count, events: 0 },
    };
    render(<EventsSection data={emptyData} bandId="1" />);
    expect(screen.getByText('No hay eventos programados')).toBeInTheDocument();
  });
});
