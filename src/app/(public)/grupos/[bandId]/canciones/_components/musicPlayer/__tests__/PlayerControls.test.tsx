import { render, screen, fireEvent, cleanup } from '@testing-library/react';
import { PlayerControls } from '../PlayerControls';

describe('PlayerControls', () => {
    const defaultProps = {
        playing: false,
        hasSelectedBeat: true,
        hasMultipleSongs: true,
        onPlayPause: jest.fn(),
        onNext: jest.fn(),
        onPrev: jest.fn(),
    };

    beforeEach(() => {
        jest.clearAllMocks();
    });

    afterEach(() => {
        cleanup();
    });

    it('renderiza el botón de play cuando no está reproduciendo', () => {
        render(<PlayerControls {...defaultProps} />);

        const playButton = screen.getByRole('button', { name: '' });
        expect(playButton).toBeInTheDocument();
    });

    it('renderiza el botón de pause cuando está reproduciendo', () => {
        render(<PlayerControls {...defaultProps} playing={true} />);

        const pauseButton = screen.getByRole('button', { name: '' });
        expect(pauseButton).toBeInTheDocument();
    });

    it('muestra botones de navegación cuando hay múltiples canciones', () => {
        render(<PlayerControls {...defaultProps} />);

        const buttons = screen.getAllByRole('button');
        expect(buttons).toHaveLength(3); // prev, play/pause, next
    });

    it('oculta botones de navegación cuando hay una sola canción', () => {
        render(<PlayerControls {...defaultProps} hasMultipleSongs={false} />);

        const buttons = screen.getAllByRole('button');
        expect(buttons).toHaveLength(1); // solo play/pause
    });

    it('llama onPlayPause al hacer clic en play/pause', () => {
        const onPlayPause = jest.fn();
        render(<PlayerControls {...defaultProps} onPlayPause={onPlayPause} />);

        const playButton = screen.getAllByRole('button')[1]; // El botón central
        fireEvent.click(playButton);

        expect(onPlayPause).toHaveBeenCalledTimes(1);
    });

    it('llama onNext al hacer clic en siguiente', () => {
        const onNext = jest.fn();
        render(<PlayerControls {...defaultProps} onNext={onNext} />);

        const buttons = screen.getAllByRole('button');
        const nextButton = buttons[2]; // Último botón
        fireEvent.click(nextButton);

        expect(onNext).toHaveBeenCalledTimes(1);
    });

    it('llama onPrev al hacer clic en anterior', () => {
        const onPrev = jest.fn();
        render(<PlayerControls {...defaultProps} onPrev={onPrev} />);

        const buttons = screen.getAllByRole('button');
        const prevButton = buttons[0]; // Primer botón
        fireEvent.click(prevButton);

        expect(onPrev).toHaveBeenCalledTimes(1);
    });
});
