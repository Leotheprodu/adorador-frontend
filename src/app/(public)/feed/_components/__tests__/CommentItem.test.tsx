import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { CommentItem } from '../CommentItem';
import { Comment as FeedComment } from '../../_interfaces/feedInterface';
import * as feedService from '../../_services/feedService';

// Mock de servicios
jest.mock('../../_services/feedService', () => ({
    toggleCommentBlessingService: jest.fn(),
}));

// Mock de NextUI
jest.mock('@heroui/react', () => ({
    Avatar: ({ name }: { name?: string }) => <div>Avatar: {name}</div>,
    Button: ({
        children,
        onPress,
        className,
    }: React.PropsWithChildren<{
        onPress?: () => void;
        className?: string;
    }>) => (
        <button onClick={onPress} className={className}>
            {children}
        </button>
    ),
    Card: ({ children }: { children: React.ReactNode }) => <div>Card: {children}</div>,
    CardBody: ({ children }: { children: React.ReactNode }) => <div>CardBody: {children}</div>,
    Textarea: ({ placeholder, value, onValueChange }: { placeholder?: string; value?: string; onValueChange?: (value: string) => void }) => (
        <textarea
            placeholder={placeholder}
            value={value}
            onChange={(e) => onValueChange?.(e.target.value)}
        />
    ),
    Chip: ({ children }: { children: React.ReactNode }) => <div>Chip: {children}</div>,
    Tooltip: ({ children, content }: { children: React.ReactNode; content: string }) => (
        <div title={content}>{children}</div>
    ),
}));

// Mock de componentes
jest.mock('../FeedYouTubePlayer', () => ({
    FeedYouTubePlayer: () => <div>FeedYouTubePlayer</div>,
}));

jest.mock('../BlessingButton', () => ({
    BlessingButton: ({
        onPress,
        isBlessed,
        count,
    }: {
        onPress: () => void;
        isBlessed: boolean;
        count: number;
    }) => (
        <button onClick={onPress}>
            Blessing: {isBlessed ? 'Yes' : 'No'} ({count})
        </button>
    ),
}));

// Mock de utils
jest.mock('@global/utils/datesUtils', () => ({
    formatRelativeTime: () => 'hace 5 minutos',
}));

const renderWithQueryClient = (ui: React.ReactElement) => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: { retry: false },
            mutations: { retry: false },
        },
    });
    return render(
        <QueryClientProvider client={queryClient}>{ui}</QueryClientProvider>,
    );
};

const mockComment: FeedComment = {
    id: 1,
    content: 'Este es un comentario de prueba',
    postId: 1,
    authorId: 1,
    parentId: null,
    sharedSongId: null,
    createdAt: new Date().toISOString(),
    author: { id: 1, name: 'Usuario Test' },
    sharedSong: null,
    _count: { blessings: 5, songCopies: 0 },
    userBlessing: [],
    replies: [],
};

describe('CommentItem', () => {
    const defaultProps = {
        comment: mockComment,
        postId: 1,
        onReply: jest.fn(),
        replyingTo: null,
        newComment: '',
        setNewComment: jest.fn(),
        onSubmitReply: jest.fn(),
        onCancelReply: jest.fn(),
        isSubmitting: false,
        onViewSong: jest.fn(),
        onCopySong: jest.fn(),
    };

    const mockToggleBlessing = {
        mutate: jest.fn(),
        isPending: false,
    };

    beforeEach(() => {
        jest.clearAllMocks();
        (feedService.toggleCommentBlessingService as jest.Mock).mockReturnValue(
            mockToggleBlessing,
        );
    });

    it('renderiza el comentario correctamente', () => {
        renderWithQueryClient(<CommentItem {...defaultProps} />);

        expect(screen.getByText('Usuario Test')).toBeInTheDocument();
        expect(
            screen.getByText('Este es un comentario de prueba'),
        ).toBeInTheDocument();
        expect(screen.getByText('hace 5 minutos')).toBeInTheDocument();
    });

    it('muestra el botón de responder', () => {
        renderWithQueryClient(<CommentItem {...defaultProps} />);
        expect(screen.getByText('Responder')).toBeInTheDocument();
    });

    it('llama onReply al hacer clic en responder', () => {
        const onReply = jest.fn();
        renderWithQueryClient(<CommentItem {...defaultProps} onReply={onReply} />);

        const replyButton = screen.getByText('Responder');
        fireEvent.click(replyButton);

        expect(onReply).toHaveBeenCalledWith(1);
    });

    it('muestra formulario de respuesta cuando está respondiendo', () => {
        renderWithQueryClient(<CommentItem {...defaultProps} replyingTo={1} />);
        expect(screen.getByPlaceholderText('Escribe tu respuesta...')).toBeInTheDocument();
        expect(screen.getByText('Respondiendo a este comentario')).toBeInTheDocument();
    });

    it('muestra el botón de blessing con el conteo correcto', () => {
        renderWithQueryClient(<CommentItem {...defaultProps} />);
        expect(screen.getByText('Blessing: No (5)')).toBeInTheDocument();
    });

    it('llama toggleBlessing al hacer clic en blessing', () => {
        renderWithQueryClient(<CommentItem {...defaultProps} />);

        const blessingButton = screen.getByText('Blessing: No (5)');
        fireEvent.click(blessingButton);

        expect(mockToggleBlessing.mutate).toHaveBeenCalled();
    });
});
