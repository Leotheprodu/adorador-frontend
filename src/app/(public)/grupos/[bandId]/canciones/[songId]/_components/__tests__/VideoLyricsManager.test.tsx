import React from 'react';
import { render, screen } from '@testing-library/react';
import { VideoLyricsManager } from '../VideoLyricsManager';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Mock hooks and services
const mockHandleCreate = jest.fn();
const mockHandleUpdate = jest.fn();
const mockHandleDelete = jest.fn();
const mockHandleSetPreferred = jest.fn();

jest.mock('../../_hooks/useVideoLyrics', () => ({
  useVideoLyrics: jest.fn(() => ({
    isFormOpen: false,
    setIsFormOpen: jest.fn(),
    handleCreate: mockHandleCreate,
    handleUpdate: mockHandleUpdate,
    handleDelete: mockHandleDelete,
    handleSetPreferred: mockHandleSetPreferred,
    isLoading: false,
  })),
}));

const mockVideoLyrics = [
  {
    id: 1,
    youtubeId: 'dQw4w9WgXcQ',
    title: 'Test Video 1',
    videoType: 'instrumental',
    description: 'Test description',
    priority: 1,
    usesVideoLyrics: true,
    isPreferred: false,
  },
  {
    id: 2,
    youtubeId: 'abc123def456',
    title: 'Test Video 2',
    videoType: 'full',
    description: null,
    priority: 2,
    usesVideoLyrics: false,
    isPreferred: true,
  },
];

jest.mock('../../_services/videoLyricsService', () => ({
  getVideoLyricsService: jest.fn(() => ({
    data: mockVideoLyrics,
    isLoading: false,
  })),
}));

// Mock YouTubePlayer component
jest.mock('@global/components/YouTubePlayer', () => ({
  YouTubePlayer: ({
    youtubeUrl,
    title,
  }: {
    youtubeUrl: string;
    title: string;
  }) => (
    <div data-testid="youtube-player">
      <p>YouTube Player: {youtubeUrl}</p>
      <p>Title: {title}</p>
    </div>
  ),
}));

// Mock toast
jest.mock('react-hot-toast', () => ({
  __esModule: true,
  default: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

// Mock modals
jest.mock('../EditVideoLyricsModal', () => ({
  EditVideoLyricsModal: () => <div data-testid="edit-modal">Edit Modal</div>,
}));

jest.mock('../DeleteConfirmModal', () => ({
  DeleteConfirmModal: () => <div data-testid="delete-modal">Delete Modal</div>,
}));

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
  Wrapper.displayName = 'TestWrapper';
  return Wrapper;
};

describe('VideoLyricsManager', () => {
  const defaultProps = {
    bandId: '1',
    songId: '100',
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should render component title and description', () => {
    render(<VideoLyricsManager {...defaultProps} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByText('Videos con Lyrics')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Gestiona los videos de YouTube con instrumental y letras',
      ),
    ).toBeInTheDocument();
  });

  it('should display list of video lyrics', () => {
    render(<VideoLyricsManager {...defaultProps} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByText('Test Video 1')).toBeInTheDocument();
    expect(screen.getByText('Test Video 2')).toBeInTheDocument();
  });

  it('should show YouTube player for each video', () => {
    render(<VideoLyricsManager {...defaultProps} />, {
      wrapper: createWrapper(),
    });

    const players = screen.getAllByTestId('youtube-player');
    expect(players).toHaveLength(2);
  });

  it('should display video type badges', () => {
    render(<VideoLyricsManager {...defaultProps} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByText('Instrumental')).toBeInTheDocument();
    expect(screen.getByText('Canción completa')).toBeInTheDocument();
  });

  it('should display priority badges', () => {
    render(<VideoLyricsManager {...defaultProps} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByText('Prioridad: 1')).toBeInTheDocument();
    expect(screen.getByText('Prioridad: 2')).toBeInTheDocument();
  });

  it('should show preferred badge for preferred video', () => {
    render(<VideoLyricsManager {...defaultProps} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByText('⭐ Preferido')).toBeInTheDocument();
  });

  it('should show "Lyrics del video" badge when usesVideoLyrics is true', () => {
    render(<VideoLyricsManager {...defaultProps} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByText('Lyrics del video')).toBeInTheDocument();
  });

  it('should show description when provided', () => {
    render(<VideoLyricsManager {...defaultProps} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByText('Test description')).toBeInTheDocument();
  });

  it('should render edit modal', () => {
    render(<VideoLyricsManager {...defaultProps} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByTestId('edit-modal')).toBeInTheDocument();
  });

  it('should render delete confirmation modal', () => {
    render(<VideoLyricsManager {...defaultProps} />, {
      wrapper: createWrapper(),
    });

    expect(screen.getByTestId('delete-modal')).toBeInTheDocument();
  });

  it('should have edit buttons for each video', () => {
    render(<VideoLyricsManager {...defaultProps} />, {
      wrapper: createWrapper(),
    });

    const editButtons = screen.getAllByTitle('Editar video');
    expect(editButtons).toHaveLength(2);
  });

  it('should have delete buttons for each video', () => {
    render(<VideoLyricsManager {...defaultProps} />, {
      wrapper: createWrapper(),
    });

    const deleteButtons = screen.getAllByTitle('Eliminar video');
    expect(deleteButtons).toHaveLength(2);
  });

  it('should have set preferred buttons for each video', () => {
    render(<VideoLyricsManager {...defaultProps} />, {
      wrapper: createWrapper(),
    });

    const preferredButtons = screen.getAllByTitle('Marcar como preferido');
    expect(preferredButtons).toHaveLength(2);
  });
});
