import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { SongsSection } from '../SongsSection';

jest.mock('../AddSongButton', () => ({
  AddSongButton: ({ bandId }: { bandId: string }) => (
    <button data-testid="add-song-button">Add Song {bandId}</button>
  ),
}));

const mockData = {
  id: 1,
  name: 'Test Band',
  _count: {
    songs: 3,
    events: 2,
  },
  songs: [
    { id: 1, title: 'Song 1', artist: 'Artist 1' },
    { id: 2, title: 'Song 2', artist: 'Artist 2' },
  ],
};

describe('SongsSection - Responsive Layout', () => {
  it('should render without crashing', () => {
    render(<SongsSection data={mockData} bandId="1" />);
    expect(screen.getByText('Canciones')).toBeInTheDocument();
  });

  it('should have responsive header layout with flex-col on mobile and flex-row on desktop', () => {
    const { container } = render(<SongsSection data={mockData} bandId="1" />);

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
    const { container } = render(<SongsSection data={mockData} bandId="1" />);

    // Verificar que el contenedor del icono tiene flex-shrink-0
    const iconContainer = container.querySelector('.h-10.w-10.flex-shrink-0');
    expect(iconContainer).toBeInTheDocument();
  });

  it('should have flex-wrap on buttons container', () => {
    const { container } = render(<SongsSection data={mockData} bandId="1" />);

    // Verificar que el contenedor de botones tiene flex-wrap
    const buttonsContainer = container.querySelector('.flex.flex-wrap');
    expect(buttonsContainer).toBeInTheDocument();
  });

  it('should display song count', () => {
    render(<SongsSection data={mockData} bandId="1" />);
    expect(screen.getByText('3 en total')).toBeInTheDocument();
  });

  it('should render songs grid', () => {
    render(<SongsSection data={mockData} bandId="1" />);
    expect(screen.getByText('Song 1')).toBeInTheDocument();
    expect(screen.getByText('Song 2')).toBeInTheDocument();
  });

  it('should show empty state when no songs', () => {
    const emptyData = {
      ...mockData,
      songs: [],
      _count: { ...mockData._count, songs: 0 },
    };
    render(<SongsSection data={emptyData} bandId="1" />);
    expect(screen.getByText('Aún no hay canciones')).toBeInTheDocument();
  });
});
