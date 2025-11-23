import { render, screen, fireEvent } from '@testing-library/react';
import { CommentReplyForm } from '../CommentReplyForm';

jest.mock('@nextui-org/react', () => ({
    Avatar: ({ name }: { name?: string }) => <div>{name}</div>,
    Button: ({
        children,
        onPress,
        isDisabled,
        isLoading,
        ...props
    }: React.PropsWithChildren<{
        onPress?: () => void;
        isDisabled?: boolean;
        isLoading?: boolean;
    }>) => (
        <button
            onClick={onPress}
            disabled={isDisabled || isLoading}
            {...props}
        >
            {children}
        </button>
    ),
    Textarea: ({
        value,
        onChange,
        onKeyDown,
        placeholder,
    }: {
        value: string;
        onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
        onKeyDown?: (e: React.KeyboardEvent) => void;
        placeholder?: string;
    }) => (
        <textarea
            value={value}
            onChange={onChange}
            onKeyDown={onKeyDown}
            placeholder={placeholder}
        />
    ),
}));

// Mock de los iconos
jest.mock('@global/icons', () => ({
    SendIcon: () => <span>SendIcon</span>,
}));

describe('CommentReplyForm', () => {
    const defaultProps = {
        newComment: '',
        setNewComment: jest.fn(),
        handleSubmit: jest.fn(),
        handleKeyPress: jest.fn(),
        isSubmitting: false,
        onCancel: jest.fn(),
        onShareSong: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('renderiza el formulario correctamente', () => {
        render(<CommentReplyForm {...defaultProps} />);

        expect(
            screen.getByPlaceholderText('Escribe una respuesta...'),
        ).toBeInTheDocument();
        expect(screen.getByText('Cancelar respuesta')).toBeInTheDocument();
        expect(screen.getByText('🎵 Compartir Canción')).toBeInTheDocument();
        expect(screen.getByText('Responder')).toBeInTheDocument();
    });

    it('muestra el valor del comentario', () => {
        render(<CommentReplyForm {...defaultProps} newComment="Mi respuesta" />);

        const textarea = screen.getByPlaceholderText('Escribe una respuesta...');
        expect(textarea).toHaveValue('Mi respuesta');
    });

    it('llama setNewComment al escribir', () => {
        const setNewComment = jest.fn();
        render(<CommentReplyForm {...defaultProps} setNewComment={setNewComment} />);

        const textarea = screen.getByPlaceholderText('Escribe una respuesta...');
        fireEvent.change(textarea, { target: { value: 'Nuevo texto' } });

        expect(setNewComment).toHaveBeenCalledWith('Nuevo texto');
    });

    it('llama handleKeyPress al presionar teclas', () => {
        const handleKeyPress = jest.fn();
        render(
            <CommentReplyForm {...defaultProps} handleKeyPress={handleKeyPress} />,
        );

        const textarea = screen.getByPlaceholderText('Escribe una respuesta...');
        fireEvent.keyDown(textarea, { key: 'Enter', ctrlKey: true });

        expect(handleKeyPress).toHaveBeenCalled();
    });

    it('llama onCancel al hacer clic en cancelar', () => {
        const onCancel = jest.fn();
        render(<CommentReplyForm {...defaultProps} onCancel={onCancel} />);

        const cancelButton = screen.getByText('Cancelar respuesta');
        fireEvent.click(cancelButton);

        expect(onCancel).toHaveBeenCalled();
    });

    it('llama onShareSong al hacer clic en compartir canción', () => {
        const onShareSong = jest.fn();
        render(<CommentReplyForm {...defaultProps} onShareSong={onShareSong} />);

        const shareButton = screen.getByText('🎵 Compartir Canción');
        fireEvent.click(shareButton);

        expect(onShareSong).toHaveBeenCalled();
    });

    it('llama handleSubmit al hacer clic en responder', () => {
        const handleSubmit = jest.fn();
        render(
            <CommentReplyForm
                {...defaultProps}
                newComment="Mi respuesta"
                handleSubmit={handleSubmit}
            />,
        );

        const submitButton = screen.getByText('Responder');
        fireEvent.click(submitButton);

        expect(handleSubmit).toHaveBeenCalled();
    });

    it('deshabilita el botón de responder si el comentario está vacío', () => {
        render(<CommentReplyForm {...defaultProps} newComment="" />);

        const submitButton = screen.getByText('Responder');
        expect(submitButton).toBeDisabled();
    });

    it('deshabilita el botón de responder si solo hay espacios', () => {
        render(<CommentReplyForm {...defaultProps} newComment="   " />);

        const submitButton = screen.getByText('Responder');
        expect(submitButton).toBeDisabled();
    });

    it('habilita el botón de responder con contenido válido', () => {
        render(<CommentReplyForm {...defaultProps} newComment="Contenido válido" />);

        const submitButton = screen.getByText('Responder');
        expect(submitButton).not.toBeDisabled();
    });

    it('muestra estado de carga en el botón de responder', () => {
        render(<CommentReplyForm {...defaultProps} isSubmitting={true} />);

        const submitButton = screen.getByText('Responder');
        expect(submitButton).toBeDisabled();
    });

    it('deshabilita compartir canción mientras se envía', () => {
        render(<CommentReplyForm {...defaultProps} isSubmitting={true} />);

        const shareButton = screen.getByText('🎵 Compartir Canción');
        expect(shareButton).toBeDisabled();
    });
});
