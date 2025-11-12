import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { AddNewSongtoChurchAndEvent } from '../AddNewSongtoChurchAndEvent';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { addSongsToEventService } from '../services/AddSongsToEventService';
import {
  addSongsToBandService,
  getSongsOfBand,
} from '@bands/[bandId]/canciones/_services/songsOfBandService';

// Mock dependencies
jest.mock('react-hot-toast');
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));
jest.mock('../services/AddSongsToEventService');
jest.mock('@bands/[bandId]/canciones/_services/songsOfBandService');
jest.mock('../FormAddNewSong', () => ({
  FormAddNewSong: ({ form, handleChange }) => (
    <div data-testid="form-add-new-song">
      <input
        data-testid="title-input"
        value={form.title}
        onChange={handleChange}
        name="title"
      />
    </div>
  ),
}));
jest.mock('@stores/event', () => ({
  $event: {
    subscribe: jest.fn(),
    get: jest.fn(() => ({
      songs: [],
    })),
  },
}));
jest.mock('@nanostores/react', () => ({
  useStore: jest.fn(() => ({
    songs: [],
  })),
}));

const createMutationMock = (overrides = {}) => ({
  mutate: jest.fn(),
  mutateAsync: jest.fn(),
  status: 'idle',
  isPending: false,
  isSuccess: false,
  isError: false,
  isIdle: true,
  data: undefined,
  error: null,
  reset: jest.fn(),
  variables: undefined,
  context: undefined,
  failureCount: 0,
  failureReason: null,
  isPaused: false,
  submittedAt: 0,
  ...overrides,
});

describe('AddNewSongtoChurchAndEvent', () => {
  const mockRefetch = jest.fn();
  const mockOnClose = jest.fn();
  const mockParams = { bandId: '1', eventId: '2' };
  const mockPush = jest.fn();
  const mockMutateAddSong = jest.fn();
  const mockMutateAddToEvent = jest.fn();

  const mockGetSongsOfBand = getSongsOfBand as jest.MockedFunction<
    typeof getSongsOfBand
  >;
  const mockAddSongsToBandService =
    addSongsToBandService as jest.MockedFunction<typeof addSongsToBandService>;
  const mockAddSongsToEventService =
    addSongsToEventService as jest.MockedFunction<
      typeof addSongsToEventService
    >;
  const mockUseRouter = useRouter as jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseRouter.mockReturnValue({ push: mockPush } as any); // eslint-disable-line @typescript-eslint/no-explicit-any
    mockGetSongsOfBand.mockReturnValue({
      data: [],
      status: 'success',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
    mockAddSongsToBandService.mockReturnValue(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      createMutationMock({ mutate: mockMutateAddSong }) as any,
    );
    mockAddSongsToEventService.mockReturnValue(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      createMutationMock({ mutate: mockMutateAddToEvent }) as any,
    );
  });

  it('should render modal when isOpen is true', () => {
    render(
      <AddNewSongtoChurchAndEvent
        params={mockParams}
        isOpen={true}
        onClose={mockOnClose}
        refetch={mockRefetch}
      />,
    );

    expect(screen.getByText(/Crear Nueva Canción/)).toBeInTheDocument();
  });

  it('should not render modal when isOpen is false', () => {
    render(
      <AddNewSongtoChurchAndEvent
        params={mockParams}
        isOpen={false}
        onClose={mockOnClose}
        refetch={mockRefetch}
      />,
    );

    expect(screen.queryByText(/Crear Nueva Canción/)).not.toBeInTheDocument();
  });

  it('should display form inside modal', async () => {
    render(
      <AddNewSongtoChurchAndEvent
        params={mockParams}
        isOpen={true}
        onClose={mockOnClose}
        refetch={mockRefetch}
      />,
    );

    await waitFor(() => {
      expect(screen.getByTestId('form-add-new-song')).toBeInTheDocument();
    });
  });

  it('should show error toast when title is empty', async () => {
    render(
      <AddNewSongtoChurchAndEvent
        params={mockParams}
        isOpen={true}
        onClose={mockOnClose}
        refetch={mockRefetch}
      />,
    );

    await waitFor(() => {
      expect(screen.getByText(/Crear Nueva Canción/)).toBeInTheDocument();
    });

    const createButton = screen.getByRole('button', { name: /Crear Canción/ });
    fireEvent.click(createButton);

    expect(toast.error).toHaveBeenCalledWith(
      'El título de la canción es obligatorio',
    );
  });

  it('should call add to church when creating song', async () => {
    render(
      <AddNewSongtoChurchAndEvent
        params={mockParams}
        isOpen={true}
        onClose={mockOnClose}
        refetch={mockRefetch}
      />,
    );

    await waitFor(() => {
      expect(screen.getByTestId('title-input')).toBeInTheDocument();
    });

    const titleInput = screen.getByTestId('title-input');
    fireEvent.change(titleInput, { target: { value: 'New Song' } });

    const createButton = screen.getByRole('button', { name: /Crear Canción/ });
    fireEvent.click(createButton);

    expect(mockMutateAddSong).toHaveBeenCalledWith(
      expect.objectContaining({
        title: 'New Song',
      }),
    );
  });

  it('should show success toast when song is added to church', async () => {
    mockAddSongsToBandService.mockReturnValue(
      createMutationMock({
        mutate: mockMutateAddSong,
        status: 'success',
        isSuccess: true,
        isIdle: false,
        data: { id: 123 },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      }) as any,
    );

    render(
      <AddNewSongtoChurchAndEvent
        params={mockParams}
        isOpen={true}
        onClose={mockOnClose}
        refetch={mockRefetch}
      />,
    );

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith(
        'Canción agregada al catálogo de la iglesia',
      );
    });
  });

  it('should show error toast on church add failure', async () => {
    mockAddSongsToBandService.mockReturnValue(
      createMutationMock({
        mutate: mockMutateAddSong,
        status: 'error',
        isError: true,
        isIdle: false,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      }) as any,
    );

    render(
      <AddNewSongtoChurchAndEvent
        params={mockParams}
        isOpen={true}
        onClose={mockOnClose}
        refetch={mockRefetch}
      />,
    );

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(
        'Error al agregar canción al catálogo de la iglesia',
      );
    });
  });

  it('should show success toast when song is added to event', async () => {
    mockAddSongsToEventService.mockReturnValue(
      createMutationMock({
        mutate: mockMutateAddToEvent,
        status: 'success',
        isSuccess: true,
        isIdle: false,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      }) as any,
    );

    render(
      <AddNewSongtoChurchAndEvent
        params={mockParams}
        isOpen={true}
        onClose={mockOnClose}
        refetch={mockRefetch}
      />,
    );

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Canción agregada al evento');
      expect(mockRefetch).toHaveBeenCalled();
    });
  });

  it('should navigate to song when checkbox is selected', async () => {
    let addSongStatus = 'idle';
    let addToEventStatus = 'idle';

    mockAddSongsToBandService.mockImplementation(
      () =>
        createMutationMock({
          mutate: mockMutateAddSong,
          status: addSongStatus,
          isSuccess: addSongStatus === 'success',
          isIdle: addSongStatus === 'idle',
          data: addSongStatus === 'success' ? { id: 456 } : undefined,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }) as any,
    );

    mockAddSongsToEventService.mockImplementation(
      () =>
        createMutationMock({
          mutate: mockMutateAddToEvent,
          status: addToEventStatus,
          isSuccess: addToEventStatus === 'success',
          isIdle: addToEventStatus === 'idle',
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
        }) as any,
    );

    const { rerender } = render(
      <AddNewSongtoChurchAndEvent
        params={mockParams}
        isOpen={true}
        onClose={mockOnClose}
        refetch={mockRefetch}
      />,
    );

    const buttons = screen.getAllByText(/Nueva Canción/);
    const button = buttons[0];
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/Crear Nueva Canción/)).toBeInTheDocument();
    });

    // Seleccionar el checkbox
    const checkbox = screen.getByText(/Ir a la canción después de crear/);
    fireEvent.click(checkbox);

    // Simular creación exitosa de la canción
    addSongStatus = 'success';
    rerender(
      <AddNewSongtoChurchAndEvent
        params={mockParams}
        isOpen={true}
        onClose={mockOnClose}
        refetch={mockRefetch}
      />,
    );

    // Esperar a que se agregue al evento
    await waitFor(() => {
      expect(mockMutateAddToEvent).toHaveBeenCalled();
    });

    // Simular que se agregó al evento exitosamente
    addToEventStatus = 'success';
    rerender(
      <AddNewSongtoChurchAndEvent
        params={mockParams}
        isOpen={true}
        onClose={mockOnClose}
        refetch={mockRefetch}
      />,
    );

    // Verificar que se redirige
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/grupos/1/canciones/456');
    });
  });

  it('should show loading state when creating', async () => {
    mockAddSongsToBandService.mockReturnValue(
      createMutationMock({
        mutate: mockMutateAddSong,
        status: 'pending',
        isPending: true,
        isIdle: false,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      }) as any,
    );

    render(
      <AddNewSongtoChurchAndEvent
        params={mockParams}
        isOpen={true}
        onClose={mockOnClose}
        refetch={mockRefetch}
      />,
    );

    await waitFor(() => {
      expect(screen.getByText(/Creando.../)).toBeInTheDocument();
    });
  });

  it('should call onClose when clicking cancel button', async () => {
    render(
      <AddNewSongtoChurchAndEvent
        params={mockParams}
        isOpen={true}
        onClose={mockOnClose}
        refetch={mockRefetch}
      />,
    );

    const cancelButton = screen.getByRole('button', { name: /Cancelar/ });
    fireEvent.click(cancelButton);

    expect(mockOnClose).toHaveBeenCalled();
  });
});
