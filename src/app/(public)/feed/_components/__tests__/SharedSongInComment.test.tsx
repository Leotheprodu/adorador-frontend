// Mock nanostores y NextUI antes de cualquier import
jest.mock('@nanostores/react', () => ({
    useStore: jest.fn(() => ({ isNavigating: false })),
}));

import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SharedSongInComment } from '../SharedSongInComment';
import { Comment as FeedComment } from '../../_interfaces/feedInterface';

jest.mock('@nextui-org/react', () => ({
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
    Tooltip: ({
        children,
        content,
    }: React.PropsWithChildren<{ content?: string }>) => (
        <span title={content}>{children}</span>
    ),
}));

// Mock del FeedYouTubePlayer
jest.mock('../FeedYouTubePlayer', () => ({
    FeedYouTubePlayer: () => <div>YouTube Player</div>,
}));

const renderWithQueryClient = (ui: React.ReactElement) => {
    const queryClient = new QueryClient();
    return render(
        <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
    );
};

const mockComment: FeedComment = {
    id: 1,
    content: 'Comentario de prueba',
    postId: 1,
    authorId: 1,
    parentId: null,
    sharedSongId: 10,
    createdAt: new Date().toISOString(),
    author: { id: 1, name: 'Test User' },
    sharedSong: {
        id: 10,
        bandId: 1,
        title: 'Canción Compartida',
        artist: 'Artista Test',
        key: 'C',
        tempo: 120,
        songType: 'worship',
        youtubeLink: 'https://youtube.com/watch?v=test',
    },
    _count: { blessings: 0, songCopies: 2 },
    userBlessing: [],
    replies: [],
};

describe('SharedSongInComment', () => {
    const mockOnCopySong = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('no renderiza nada si no hay canción compartida', () => {
        const commentWithoutSong = { ...mockComment, sharedSong: null };
        const { container } = renderWithQueryClient(
            <SharedSongInComment
                comment={commentWithoutSong}
                onCopySong={mockOnCopySong}
            />,
        );
        expect(container.firstChild).toBeNull();
    });

    it('muestra información de la canción', () => {
        renderWithQueryClient(
            <SharedSongInComment comment={mockComment} onCopySong={mockOnCopySong} />,
        );

        expect(screen.getByText('Canción Compartida')).toBeInTheDocument();
        expect(screen.getByText('Artista Test')).toBeInTheDocument();
        expect(screen.getByText('C')).toBeInTheDocument();
        expect(screen.getByText('120 BPM')).toBeInTheDocument();
        expect(screen.getByText('Adoración')).toBeInTheDocument();
    });

    it('muestra reproductor de YouTube si existe link', () => {
        renderWithQueryClient(
            <SharedSongInComment comment={mockComment} onCopySong={mockOnCopySong} />,
        );

        expect(screen.getByText('YouTube Player')).toBeInTheDocument();
    });

    it('llama onCopySong con los datos correctos', () => {
        renderWithQueryClient(
            <SharedSongInComment comment={mockComment} onCopySong={mockOnCopySong} />,
        );

        const copyButton = screen.getByText('Copiar');
        copyButton.click();

        expect(mockOnCopySong).toHaveBeenCalledWith(10, 'Canción Compartida', 'C', 120, 1);
    });
});
