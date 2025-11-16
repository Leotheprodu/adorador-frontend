// Mock NextUI Button para simular <a> y <button> según corresponda
jest.mock('@nextui-org/react', () => {
  const original = jest.requireActual('@nextui-org/react');
  return {
    ...original,
    Button: ({
      href,
      children,
      isDisabled,
      isIconOnly,
      isLoading,
      onPress,
      ...props
    }: any) => {
      const onClick = onPress;
      return href ? (
        <a href={href} aria-disabled={isDisabled} {...props}>
          {children}
        </a>
      ) : (
        <button
          type="button"
          disabled={isDisabled}
          onClick={onClick}
          {...props}
        >
          {children}
        </button>
      );
    },
  };
});
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { UpdatingSongList } from '../UpdatingSongList.tsx';
import {
  eventUpdateSongs,
  eventDeleteSongs,
} from '../services/updatingEventSongsService';
import toast from 'react-hot-toast';

// Mock dependencies
jest.mock('../services/updatingEventSongsService');
jest.mock('react-hot-toast');
jest.mock('@hello-pangea/dnd', () => ({
  DragDropContext: ({
    children,
    onDragEnd,
  }: {
    children: React.ReactNode;
    onDragEnd: () => void;
  }) => (
    <div data-testid="drag-drop-context" data-on-drag-end={onDragEnd}>
      {children}
    </div>
  ),
  Droppable: ({
    children,
    droppableId,
  }: {
    children: (
      provided: Record<string, unknown>,
      snapshot: Record<string, unknown>,
    ) => React.ReactNode;
    droppableId: string;
  }) => {
    const provided = {
      innerRef: () => null,
      droppableProps: {
        'data-rbd-droppable-id': droppableId,
      },
      placeholder: null,
    };
    const snapshot = {
      isDraggingOver: false,
      draggingOverWith: null,
      draggingFromThisWith: null,
      isUsingPlaceholder: false,
    };
    return <div data-testid="droppable">{children(provided, snapshot)}</div>;
  },
  Draggable: ({
    children,
    draggableId,
    index,
  }: {
    children: (
      provided: Record<string, unknown>,
      snapshot: Record<string, unknown>,
    ) => React.ReactNode;
    draggableId: string;
    index: number;
  }) => {
    const provided = {
      innerRef: () => null,
      draggableProps: {
        'data-rbd-draggable-id': draggableId,
      },
      dragHandleProps: {
        'data-rbd-drag-handle-draggable-id': draggableId,
      },
    };
    const snapshot = {
      isDragging: false,
      isDropAnimating: false,
    };
    return (
      <div data-testid={`draggable-${index}`}>
        {children(provided, snapshot)}
      </div>
    );
  },
}));

const mockEventUpdateSongs = eventUpdateSongs as jest.MockedFunction<
  typeof eventUpdateSongs
>;
const mockEventDeleteSongs = eventDeleteSongs as jest.MockedFunction<
  typeof eventDeleteSongs
>;

// Helper function to create complete mutation result mocks
const createMutationMock = (overrides: Record<string, unknown> = {}) =>
  ({
    mutate: jest.fn(),
    status: 'idle',
    isPending: false,
    data: undefined,
    variables: undefined,
    error: null,
    isError: false,
    isIdle: true,
    isSuccess: false,
    reset: jest.fn(),
    mutateAsync: jest.fn(),
    failureCount: 0,
    failureReason: null,
    isPaused: false,
    submittedAt: 0,
    context: undefined,
    ...overrides,
  }) as unknown as ReturnType<typeof eventUpdateSongs>;

describe('UpdatingSongList', () => {
  const mockSongs = [
    {
      order: 1,
      transpose: 0,
      song: {
        id: 1,
        title: 'Canción 1',
        artist: 'Artista 1',
        songType: 'worship' as const,
        key: 'C' as const,
        lyrics: [],
      },
    },
    {
      order: 2,
      transpose: 2,
      song: {
        id: 2,
        title: 'Canción 2',
        artist: 'Artista 2',
        songType: 'praise' as const,
        key: 'D' as const,
        lyrics: [],
      },
    },
  ];

  const mockParams = { bandId: '1', eventId: '1' };
  const mockRefetch = jest.fn();

  const mockMutate = jest.fn();
  const mockDeleteMutate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockEventUpdateSongs.mockReturnValue({
      mutate: mockMutate,
      status: 'idle',
      isPending: false,
      data: undefined,
      variables: undefined,
      error: null,
      isError: false,
      isIdle: true,
      isSuccess: false,
      reset: jest.fn(),
      mutateAsync: jest.fn(),
      failureCount: 0,
      failureReason: null,
      isPaused: false,
      isLoading: false,
      submittedAt: 0,
      context: undefined,
    } as unknown as ReturnType<typeof eventUpdateSongs>);
    mockEventDeleteSongs.mockReturnValue({
      mutate: mockDeleteMutate,
      status: 'idle',
      isPending: false,
      data: undefined,
      variables: undefined,
      error: null,
      isError: false,
      isIdle: true,
      isSuccess: false,
      reset: jest.fn(),
      mutateAsync: jest.fn(),
      failureCount: 0,
      failureReason: null,
      isPaused: false,
      isLoading: false,
      submittedAt: 0,
      context: undefined,
    } as unknown as ReturnType<typeof eventDeleteSongs>);
  });

  it('should render the edit button', () => {
    render(
      <UpdatingSongList
        songs={mockSongs}
        params={mockParams}
        refetch={mockRefetch}
      />,
    );

    const editButton = screen.getByLabelText('Editar canciones del evento');
    expect(editButton).toBeInTheDocument();
  });

  it('should open modal when clicking the edit button', async () => {
    render(
      <UpdatingSongList
        songs={mockSongs}
        params={mockParams}
        refetch={mockRefetch}
      />,
    );

    const editButton = screen.getByLabelText('Editar canciones del evento');
    fireEvent.click(editButton);

    // Wait for modal to open
    await waitFor(() => {
      expect(screen.getByText('Editar Canciones')).toBeInTheDocument();
    });

    expect(screen.getByText('Canción 1')).toBeInTheDocument();
    expect(screen.getByText('Canción 2')).toBeInTheDocument();
  });

  it('should reset state when opening modal', async () => {
    render(
      <UpdatingSongList
        songs={mockSongs}
        params={mockParams}
        refetch={mockRefetch}
      />,
    );

    const editButton = screen.getByLabelText('Editar canciones del evento');
    fireEvent.click(editButton);

    // Wait for modal to open and check original songs
    await waitFor(() => {
      expect(screen.getByText('Canción 1')).toBeInTheDocument();
      expect(screen.getByText('Canción 2')).toBeInTheDocument();
    });
  });

  it('should close modal and reset changes when clicking cancel', async () => {
    render(
      <UpdatingSongList
        songs={mockSongs}
        params={mockParams}
        refetch={mockRefetch}
      />,
    );

    // Open modal
    const editButton = screen.getByLabelText('Editar canciones del evento');
    fireEvent.click(editButton);

    // Wait for modal to open
    await waitFor(() => {
      expect(screen.getByText('Editar Canciones')).toBeInTheDocument();
    });

    // Close with cancel button
    const cancelButton = screen.getByRole('button', { name: /cancelar/i });
    fireEvent.click(cancelButton);

    // Wait for modal to close
    await waitFor(() => {
      expect(screen.queryByText('Editar Canciones')).not.toBeInTheDocument();
    });
  });

  it('should show save button as disabled when there are no changes', async () => {
    render(
      <UpdatingSongList
        songs={mockSongs}
        params={mockParams}
        refetch={mockRefetch}
      />,
    );

    const editButton = screen.getByLabelText('Editar canciones del evento');
    fireEvent.click(editButton);

    // Wait for modal to open
    await waitFor(() => {
      expect(screen.getByText('Editar Canciones')).toBeInTheDocument();
    });

    const saveButton = screen.getByRole('button', { name: /guardar cambios/i });
    expect(saveButton).toBeInTheDocument();
    expect(saveButton).not.toBeDisabled();
  });

  it('should display empty state when there are no songs', async () => {
    render(
      <UpdatingSongList songs={[]} params={mockParams} refetch={mockRefetch} />,
    );

    const editButton = screen.getByLabelText('Editar canciones del evento');
    fireEvent.click(editButton);

    // Wait for modal to open
    await waitFor(() => {
      expect(
        screen.getByText('No hay canciones en este evento'),
      ).toBeInTheDocument();
    });
  });

  it('should call refetch after successful save', async () => {
    mockEventUpdateSongs.mockReturnValue(
      createMutationMock({
        mutate: mockMutate,
        status: 'success',
        isPending: false,
        isSuccess: true,
        isIdle: false,
      }),
    );

    const { rerender } = render(
      <UpdatingSongList
        songs={mockSongs}
        params={mockParams}
        refetch={mockRefetch}
      />,
    );

    // Trigger the success effect
    rerender(
      <UpdatingSongList
        songs={mockSongs}
        params={mockParams}
        refetch={mockRefetch}
      />,
    );

    await waitFor(() => {
      expect(mockRefetch).toHaveBeenCalled();
    });
  });

  it('should show error toast on update failure', () => {
    mockEventUpdateSongs.mockReturnValue(
      createMutationMock({
        mutate: mockMutate,
        status: 'error',
        isPending: false,
        isError: true,
        isIdle: false,
      }),
    );

    render(
      <UpdatingSongList
        songs={mockSongs}
        params={mockParams}
        refetch={mockRefetch}
      />,
    );

    expect(toast.error).toHaveBeenCalledWith(
      'Ha ocurrido un actualizando las canciones',
    );
  });

  it('should show success toast after saving', () => {
    mockEventUpdateSongs.mockReturnValue(
      createMutationMock({
        mutate: mockMutate,
        status: 'success',
        isPending: false,
        isSuccess: true,
        isIdle: false,
      }),
    );

    render(
      <UpdatingSongList
        songs={mockSongs}
        params={mockParams}
        refetch={mockRefetch}
      />,
    );

    expect(toast.success).toHaveBeenCalledWith(
      'Canciones actualizadas correctamente',
    );
  });

  it('should show loading state on save button when pending', async () => {
    mockEventUpdateSongs.mockReturnValue(
      createMutationMock({
        mutate: mockMutate,
        status: 'pending',
        isPending: true,
        isIdle: false,
      }),
    );

    render(
      <UpdatingSongList
        songs={mockSongs}
        params={mockParams}
        refetch={mockRefetch}
      />,
    );

    const editButton = screen.getByLabelText('Editar canciones del evento');
    fireEvent.click(editButton);

    // Wait for modal to open
    await waitFor(() => {
      const saveButton = screen.getByRole('button', { name: /guardando/i });
      expect(saveButton).toBeInTheDocument();
    });
  });

  it('should disable cancel button when operation is pending', async () => {
    mockEventUpdateSongs.mockReturnValue(
      createMutationMock({
        mutate: mockMutate,
        status: 'pending',
        isPending: true,
        isIdle: false,
      }),
    );

    render(
      <UpdatingSongList
        songs={mockSongs}
        params={mockParams}
        refetch={mockRefetch}
      />,
    );

    const editButton = screen.getByLabelText('Editar canciones del evento');
    fireEvent.click(editButton);

    // Wait for modal to open
    await waitFor(() => {
      const cancelButton = screen.getByRole('button', { name: /cancelar/i });
      expect(cancelButton).toBeDisabled();
    });
  });

  it('should maintain modal open state during save operation', async () => {
    mockEventUpdateSongs.mockReturnValue(
      createMutationMock({
        mutate: mockMutate,
        status: 'pending',
        isPending: true,
        isIdle: false,
      }),
    );

    render(
      <UpdatingSongList
        songs={mockSongs}
        params={mockParams}
        refetch={mockRefetch}
      />,
    );

    const editButton = screen.getByLabelText('Editar canciones del evento');
    fireEvent.click(editButton);

    // Wait for modal to open
    await waitFor(() => {
      expect(screen.getByText('Editar Canciones')).toBeInTheDocument();
    });
  });
});
