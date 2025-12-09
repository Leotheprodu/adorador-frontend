// Mock nanostores y NextUI antes de cualquier import
jest.mock('@nanostores/react', () => ({
  useStore: jest.fn(() => ({ isNavigating: false })),
}));

jest.mock('@heroui/react', () => ({
  Card: ({ children, ...props }: React.PropsWithChildren<object>) => (
    <div {...props}>{children}</div>
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
  Avatar: ({ name }: { name?: string }) => <div>Avatar: {name}</div>,
  Button: ({
    children,
    onPress,
  }: React.PropsWithChildren<{ onPress?: () => void }>) => (
    <button onClick={onPress}>{children}</button>
  ),
  Chip: ({ children }: React.PropsWithChildren<object>) => (
    <span>{children}</span>
  ),
  Tooltip: ({ children }: React.PropsWithChildren<object>) => (
    <span>{children}</span>
  ),
}));

// Mock de los sub-componentes
jest.mock('../PostHeader', () => ({
  PostHeader: ({ authorName, bandName }: { authorName: string; bandName: string }) => (
    <div>
      <div>Author: {authorName}</div>
      <div>Band: {bandName}</div>
    </div>
  ),
}));

jest.mock('../SongShareContent', () => ({
  SongShareContent: () => <div>Song Share Content</div>,
}));

jest.mock('../SongRequestContent', () => ({
  SongRequestContent: () => <div>Song Request Content</div>,
}));

jest.mock('../PostFooter', () => ({
  PostFooter: ({ commentCount }: { commentCount: number }) => (
    <div>Comments: {commentCount}</div>
  ),
}));

jest.mock('../InlineComments', () => ({
  InlineComments: () => <div>Inline Comments</div>,
}));

import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { PostCard } from '../PostCard';
import { Post } from '../../_interfaces/feedInterface';

const renderWithQueryClient = (ui: React.ReactElement) => {
  const queryClient = new QueryClient();
  return render(
    <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
  );
};

const mockPost: Post = {
  id: 1,
  type: 'SONG_SHARE',
  status: 'ACTIVE',
  title: 'Test Post',
  description: 'Test Description',
  requestedSongTitle: null,
  requestedArtist: null,
  requestedYoutubeUrl: null,
  authorId: 1,
  bandId: 1,
  sharedSongId: 10,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  author: { id: 1, name: 'Test User' },
  band: { id: 1, name: 'Test Band' },
  sharedSong: {
    id: 10,
    bandId: 1,
    title: 'Test Song',
    artist: 'Test Artist',
    key: 'C',
    tempo: 120,
    songType: 'worship',
  },
  _count: { blessings: 5, comments: 3, songCopies: 2 },
  userBlessing: [],
};

describe('PostCard', () => {
  it('renderiza el post correctamente', () => {
    renderWithQueryClient(<PostCard post={mockPost} />);

    expect(screen.getByText('Author: Test User')).toBeInTheDocument();
    expect(screen.getByText('Band: Test Band')).toBeInTheDocument();
    expect(screen.getByText('Test Post')).toBeInTheDocument();
    expect(screen.getByText('Test Description')).toBeInTheDocument();
  });

  it('muestra SongShareContent para posts de tipo SONG_SHARE', () => {
    renderWithQueryClient(<PostCard post={mockPost} />);

    expect(screen.getByText('Song Share Content')).toBeInTheDocument();
  });

  it('muestra SongRequestContent para posts de tipo SONG_REQUEST', () => {
    const requestPost: Post = {
      ...mockPost,
      type: 'SONG_REQUEST',
      sharedSong: null,
      sharedSongId: null,
      requestedSongTitle: 'Requested Song',
      requestedArtist: 'Requested Artist',
    };

    renderWithQueryClient(<PostCard post={requestPost} />);

    expect(screen.getByText('Song Request Content')).toBeInTheDocument();
  });
});
