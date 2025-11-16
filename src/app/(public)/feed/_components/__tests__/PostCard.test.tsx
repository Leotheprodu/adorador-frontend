// Mock nanostores y NextUI antes de cualquier import
jest.mock('@nanostores/react', () => ({
  useStore: jest.fn(() => ({})),
}));
jest.mock('@nextui-org/react', () => ({
  Card: ({ children }: React.PropsWithChildren<object>) => (
    <div>{children}</div>
  ),
  CardHeader: ({ children }: React.PropsWithChildren<object>) => (
    <div>{children}</div>
  ),
  CardBody: ({ children }: React.PropsWithChildren<object>) => (
    <div>{children}</div>
  ),
  CardFooter: ({ children }: React.PropsWithChildren<object>) => (
    <div>{children}</div>
  ),
  Avatar: ({ children }: React.PropsWithChildren<object>) => (
    <div>{children}</div>
  ),
  Button: ({
    children,
    onPress,
    ...props
  }: React.PropsWithChildren<
    Record<string, unknown> & { onPress?: () => void }
  >) => (
    <button onClick={onPress} {...props}>
      {children}
    </button>
  ),
  Chip: ({ children }: React.PropsWithChildren<object>) => (
    <span>{children}</span>
  ),
  Tooltip: ({ children }: React.PropsWithChildren<object>) => (
    <span>{children}</span>
  ),
}));

import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PostCard } from '../PostCard';

const renderWithQueryClient = (ui: React.ReactElement) => {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
};

const mockPost = {
  id: 1,
  type: 'SONG_SHARE' as const,
  status: 'ACTIVE' as const,
  title: 'Post de Canción',
  description: '¡Miren esta letra!',
  requestedSongTitle: null,
  requestedArtist: null,
  requestedYoutubeUrl: null,
  authorId: 1,
  bandId: 1,
  sharedSongId: 10,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  author: { id: 1, name: 'Test User' },
  band: { id: 1, name: 'Banda Test' },
  sharedSong: {
    id: 10,
    bandId: 1,
    title: 'Canción Compartida',
    artist: 'Autor',
    key: 'C',
    tempo: 120,
    songType: 'worship' as const,
    youtubeLink: null,
    lyrics: [
      {
        id: 1,
        position: 1,
        lyrics: 'Letra de la canción',
        structure: { id: 1, title: 'Verso' },
        chords: [],
      },
    ],
  },
  _count: { blessings: 0, comments: 0, songCopies: 0 },
  userBlessing: [],
  comments: [],
};

describe('PostCard', () => {
  it('muestra la información de una canción compartida', () => {
    renderWithQueryClient(<PostCard post={mockPost} />);
    expect(screen.getByText('Canción Compartida')).toBeInTheDocument();
    expect(screen.getByText('Autor')).toBeInTheDocument();
    expect(screen.getByText('C')).toBeInTheDocument();
  });

  it('llama a onCopySong cuando el usuario copia la canción', () => {
    const onCopySong = jest.fn();
    renderWithQueryClient(<PostCard post={mockPost} onCopySong={onCopySong} />);
    const copyButton = screen.getByLabelText('Copiar canción');
    fireEvent.click(copyButton);
    expect(onCopySong).toHaveBeenCalledWith(mockPost.id);
  });
});
