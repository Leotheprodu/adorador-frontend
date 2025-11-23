import { render, screen, fireEvent } from '@testing-library/react';
import { CreatePostCollapsedView } from '../CreatePostCollapsedView';

// Mock de NextUI
jest.mock('@nextui-org/react', () => ({
    Avatar: ({ name }: { name?: string }) => <div>Avatar: {name}</div>,
    Button: ({
        children,
        onPress,
        ...props
    }: React.PropsWithChildren<{
        onPress?: () => void;
        'aria-label'?: string;
    }>) => (
        <button onClick={onPress} aria-label={props['aria-label']}>
            {children}
        </button>
    ),
    Tooltip: ({
        children,
        content,
    }: React.PropsWithChildren<{ content?: string }>) => (
        <span title={content}>{children}</span>
    ),
}));

// Mock de iconos
jest.mock('@global/icons', () => ({
    MusicalNoteIcon: () => <span>🎵</span>,
    HandsIcon: () => <span>🙏</span>,
}));

describe('CreatePostCollapsedView', () => {
    const mockOnExpand = jest.fn();
    const mockOnExpandWithType = jest.fn();

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renderiza correctamente', () => {
        render(
            <CreatePostCollapsedView
                userName="Usuario Test"
                onExpand={mockOnExpand}
                onExpandWithType={mockOnExpandWithType}
            />,
        );

        expect(screen.getByText('Avatar: Usuario Test')).toBeInTheDocument();
        expect(
            screen.getByText('¿Qué canción quieres compartir hoy?'),
        ).toBeInTheDocument();
    });

    it('llama onExpand al hacer clic en el área principal', () => {
        render(
            <CreatePostCollapsedView
                userName="Usuario Test"
                onExpand={mockOnExpand}
                onExpandWithType={mockOnExpandWithType}
            />,
        );

        const mainArea = screen.getByText('¿Qué canción quieres compartir hoy?');
        fireEvent.click(mainArea);

        expect(mockOnExpand).toHaveBeenCalled();
    });

    it('llama onExpandWithType con SONG_SHARE al hacer clic en botón compartir', () => {
        render(
            <CreatePostCollapsedView
                userName="Usuario Test"
                onExpand={mockOnExpand}
                onExpandWithType={mockOnExpandWithType}
            />,
        );

        const shareButton = screen.getByLabelText('Compartir canción');
        fireEvent.click(shareButton);

        expect(mockOnExpandWithType).toHaveBeenCalledWith('SONG_SHARE');
    });

    it('llama onExpandWithType con SONG_REQUEST al hacer clic en botón solicitar', () => {
        render(
            <CreatePostCollapsedView
                userName="Usuario Test"
                onExpand={mockOnExpand}
                onExpandWithType={mockOnExpandWithType}
            />,
        );

        const requestButton = screen.getByLabelText('Solicitar canción');
        fireEvent.click(requestButton);

        expect(mockOnExpandWithType).toHaveBeenCalledWith('SONG_REQUEST');
    });
});
