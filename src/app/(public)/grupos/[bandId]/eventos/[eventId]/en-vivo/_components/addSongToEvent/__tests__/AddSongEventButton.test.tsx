import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AddSongEventButton } from '../AddSongEventButton';

// Mock child components
jest.mock('../AddSongEventBySavedSongs', () => ({
  AddSongEventBySavedSongs: ({ params }) => (
    <div data-testid="add-from-catalog">
      AddSongEventBySavedSongs - {params.bandId} - {params.eventId}
    </div>
  ),
}));

jest.mock('../AddNewSongtoChurchAndEvent', () => ({
  AddNewSongtoChurchAndEvent: ({ params }) => (
    <div data-testid="add-new-song">
      AddNewSongtoChurchAndEvent - {params.bandId} - {params.eventId}
    </div>
  ),
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
      expect(screen.getByTestId('add-from-catalog')).toBeInTheDocument();
      expect(screen.getByTestId('add-new-song')).toBeInTheDocument();
    });
  });

  it('should show both child components in popover', async () => {
    render(<AddSongEventButton params={mockParams} refetch={mockRefetch} />);

    const button = screen.getByLabelText('Agregar canción al evento');
    fireEvent.click(button);

    await waitFor(() => {
      expect(
        screen.getByText(/AddSongEventBySavedSongs - 1 - 2/),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/AddNewSongtoChurchAndEvent - 1 - 2/),
      ).toBeInTheDocument();
    });
  });

  it('should pass correct params to child components', async () => {
    render(<AddSongEventButton params={mockParams} refetch={mockRefetch} />);

    const button = screen.getByLabelText('Agregar canción al evento');
    fireEvent.click(button);

    await waitFor(() => {
      const catalogComponent = screen.getByTestId('add-from-catalog');
      const newSongComponent = screen.getByTestId('add-new-song');

      expect(catalogComponent).toHaveTextContent('1');
      expect(catalogComponent).toHaveTextContent('2');
      expect(newSongComponent).toHaveTextContent('1');
      expect(newSongComponent).toHaveTextContent('2');
    });
  });
});
