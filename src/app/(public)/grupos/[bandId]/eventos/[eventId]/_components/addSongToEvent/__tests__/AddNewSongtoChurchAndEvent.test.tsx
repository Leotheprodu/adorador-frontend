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
  const mockSetIsOpenPopover = jest.fn();
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

  it('should render the new song button', () => {
    render(
      <AddNewSongtoChurchAndEvent
        params={mockParams}
        setIsOpenPopover={mockSetIsOpenPopover}
        refetch={mockRefetch}
      />,
    );

    expect(screen.getByText(/Nueva Canción/)).toBeInTheDocument();
  });

  it('should open modal when clicking the button', async () => {
    render(
      <AddNewSongtoChurchAndEvent
        params={mockParams}
        setIsOpenPopover={mockSetIsOpenPopover}
        refetch={mockRefetch}
      />,
    );

    const button = screen.getByText(/Nueva Canción/);
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/Crear Nueva Canción/)).toBeInTheDocument();
    });
  });

  it('should display form inside modal', async () => {
    render(
      <AddNewSongtoChurchAndEvent
        params={mockParams}
        setIsOpenPopover={mockSetIsOpenPopover}
        refetch={mockRefetch}
      />,
    );

    const button = screen.getByText(/Nueva Canción/);
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByTestId('form-add-new-song')).toBeInTheDocument();
    });
  });

  it('should show error toast when title is empty', async () => {
    render(
      <AddNewSongtoChurchAndEvent
        params={mockParams}
        setIsOpenPopover={mockSetIsOpenPopover}
        refetch={mockRefetch}
      />,
    );

    const button = screen.getByText(/Nueva Canción/);
    fireEvent.click(button);

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
        setIsOpenPopover={mockSetIsOpenPopover}
        refetch={mockRefetch}
      />,
    );

    const button = screen.getByText(/Nueva Canción/);
    fireEvent.click(button);

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
        setIsOpenPopover={mockSetIsOpenPopover}
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
        setIsOpenPopover={mockSetIsOpenPopover}
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
        setIsOpenPopover={mockSetIsOpenPopover}
        refetch={mockRefetch}
      />,
    );

    await waitFor(() => {
      expect(toast.success).toHaveBeenCalledWith('Canción agregada al evento');
      expect(mockRefetch).toHaveBeenCalled();
    });
  });

  it('should navigate to song when checkbox is selected', async () => {
    mockAddSongsToBandService.mockReturnValue(
      createMutationMock({
        mutate: mockMutateAddSong,
        status: 'success',
        isSuccess: true,
        isIdle: false,
        data: { id: 456 },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      }) as any,
    );

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
        setIsOpenPopover={mockSetIsOpenPopover}
        refetch={mockRefetch}
      />,
    );

    const buttons = screen.getAllByText(/Nueva Canción/);
    const button = buttons[0]; // Get the first button
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/Crear Nueva Canción/)).toBeInTheDocument();
    });

    const checkbox = screen.getByText(/Ir a la canción después de crear/);
    fireEvent.click(checkbox);

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
        setIsOpenPopover={mockSetIsOpenPopover}
        refetch={mockRefetch}
      />,
    );

    const button = screen.getByText(/Nueva Canción/);
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/Creando.../)).toBeInTheDocument();
    });
  });

  it('should close popover when opening modal', async () => {
    render(
      <AddNewSongtoChurchAndEvent
        params={mockParams}
        setIsOpenPopover={mockSetIsOpenPopover}
        refetch={mockRefetch}
      />,
    );

    const button = screen.getByText(/Nueva Canción/);
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockSetIsOpenPopover).toHaveBeenCalledWith(false);
    });
  });
});
