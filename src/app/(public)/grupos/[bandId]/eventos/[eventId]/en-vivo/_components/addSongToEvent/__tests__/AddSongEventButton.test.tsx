import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AddSongEventButton } from '../AddSongEventButton';
import '@testing-library/jest-dom';

// Mock child components
jest.mock('../AddSongEventBySavedSongs', () => ({
  AddSongEventBySavedSongs: ({ isOpen, onClose, params }) =>
    isOpen ? (
      <div data-testid="add-from-catalog-modal">
        Modal Catalog - {params.bandId} - {params.eventId}
        <button onClick={onClose}>Close Catalog Modal</button>
      </div>
    ) : null,
}));

jest.mock('../AddNewSongtoChurchAndEvent', () => ({
  AddNewSongtoChurchAndEvent: ({ isOpen, onClose, params }) =>
    isOpen ? (
      <div data-testid="add-new-song-modal">
        Modal New Song - {params.bandId} - {params.eventId}
        <button onClick={onClose}>Close New Song Modal</button>
      </div>
    ) : null,
}));

jest.mock('@nanostores/react', () => ({
  useStore: jest.fn(() => ({
    songs: [],
  })),
}));

describe('AddSongEventButton', () => {
  const mockRefetch = jest.fn();
  const mockParams = { bandId: '1', eventId: '2' };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render the button', () => {
    render(<AddSongEventButton params={mockParams} refetch={mockRefetch} />);

    const button = screen.getByLabelText('Agregar canción al evento');
    expect(button).toBeInTheDocument();
  });

  it('should open popover when clicking the button', async () => {
    render(<AddSongEventButton params={mockParams} refetch={mockRefetch} />);

    const button = screen.getByLabelText('Agregar canción al evento');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/Catálogo de Canciones/)).toBeInTheDocument();
      expect(screen.getByText(/Nueva Canción/)).toBeInTheDocument();
    });
  });

  it('should open catalog modal when clicking catalog button', async () => {
    render(<AddSongEventButton params={mockParams} refetch={mockRefetch} />);

    const button = screen.getByLabelText('Agregar canción al evento');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/Catálogo de Canciones/)).toBeInTheDocument();
    });

    const catalogButton = screen.getByText(/Catálogo de Canciones/);
    fireEvent.click(catalogButton);

    await waitFor(() => {
      expect(screen.getByTestId('add-from-catalog-modal')).toBeInTheDocument();
      expect(screen.getByText(/Modal Catalog - 1 - 2/)).toBeInTheDocument();
    });
  });

  it('should open new song modal when clicking new song button', async () => {
    render(<AddSongEventButton params={mockParams} refetch={mockRefetch} />);

    const button = screen.getByLabelText('Agregar canción al evento');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/Nueva Canción/)).toBeInTheDocument();
    });

    const newSongButton = screen.getByText(/Nueva Canción/);
    fireEvent.click(newSongButton);

    await waitFor(() => {
      expect(screen.getByTestId('add-new-song-modal')).toBeInTheDocument();
      expect(screen.getByText(/Modal New Song - 1 - 2/)).toBeInTheDocument();
    });
  });

  it('should close catalog modal when close button is clicked', async () => {
    render(<AddSongEventButton params={mockParams} refetch={mockRefetch} />);

    const button = screen.getByLabelText('Agregar canción al evento');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/Catálogo de Canciones/)).toBeInTheDocument();
    });

    const catalogButton = screen.getByText(/Catálogo de Canciones/);
    fireEvent.click(catalogButton);

    await waitFor(() => {
      expect(screen.getByTestId('add-from-catalog-modal')).toBeInTheDocument();
    });

    const closeButton = screen.getByText(/Close Catalog Modal/);
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(
        screen.queryByTestId('add-from-catalog-modal'),
      ).not.toBeInTheDocument();
    });
  });

  it('should close new song modal when close button is clicked', async () => {
    render(<AddSongEventButton params={mockParams} refetch={mockRefetch} />);

    const button = screen.getByLabelText('Agregar canción al evento');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/Nueva Canción/)).toBeInTheDocument();
    });

    const newSongButton = screen.getByText(/Nueva Canción/);
    fireEvent.click(newSongButton);

    await waitFor(() => {
      expect(screen.getByTestId('add-new-song-modal')).toBeInTheDocument();
    });

    const closeButton = screen.getByText(/Close New Song Modal/);
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(
        screen.queryByTestId('add-new-song-modal'),
      ).not.toBeInTheDocument();
    });
  });

  it('should render modals outside popover in the component tree', async () => {
    const { container } = render(
      <AddSongEventButton params={mockParams} refetch={mockRefetch} />,
    );

    const button = screen.getByLabelText('Agregar canción al evento');
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/Catálogo de Canciones/)).toBeInTheDocument();
    });

    const catalogButton = screen.getByText(/Catálogo de Canciones/);
    fireEvent.click(catalogButton);

    await waitFor(() => {
      const modal = screen.getByTestId('add-from-catalog-modal');
      expect(modal).toBeInTheDocument();
      // El modal no debe estar dentro del popover
      const popover = container.querySelector('[data-slot="trigger"]');
      expect(popover).not.toContainElement(modal);
    });
  });
});
